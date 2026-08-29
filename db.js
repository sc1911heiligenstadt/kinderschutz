// Persistenz über das zentrale ToolsUebersicht-Login-Gateway.
//
// ABWEICHUNG vom üblichen Gateway-Muster: diese App nutzt NICHT dav-load/dav-save.
// "kinderschutz" steht bewusst NICHT in DAV_APPS des Workers — es gibt also gar
// keinen generischen Lese- oder Schreibweg auf die Datendateien. Vier Gründe, von
// denen jeder einzelne schon reicht:
//
//   1. Melden geht OHNE Login. Ein Kind, ein Elternteil oder ein Zuschauer hat
//      keinen Sitzungstoken. dav-save verlangt einen.
//   2. Eine Meldung kann Angaben über Gesundheit, Sexualleben und strafbare
//      Handlungen enthalten (Art. 9 und Art. 10 DSGVO). Ein dav-load, das die
//      ganze Datei ausliefert, hätte sie an jeden geschickt, der das Tool sehen
//      darf. Ausblenden im Client wäre keine Zurückhaltung.
//   3. Meldungen lesen dürfen NUR die eingetragenen Beauftragten. Das ist NICHT
//      canEdit und NICHT isAdmin — der globale Admin greift hier bewusst nicht
//      durch, siehe ksDarfMeldungenLesen() im Worker.
//   4. Die Quittungsnummer ist ein Ausweis. Sie liegt nur als Hash in der Datei;
//      wer die Datei läse, könnte damit trotzdem nichts anfangen — aber er läse
//      alles andere. Der einzige Schutz, der trägt, ist: gar nicht ausliefern.
//
// Jede Aktion hier hat ein Gegenstück in admin-worker.js, das Rechte, Fristen und
// Sichtbarkeit selbst prüft. Der Client hält keinen eigenen Bestand, den er
// zurückschreibt — nach jeder Änderung wird neu geladen. Der sonst übliche
// Debounce-Save mitsamt In-Flight-Guard entfällt deshalb.
const GATEWAY_URL = "https://landingpage.michel-brunner.workers.dev";
const TOKEN_STORAGE_KEY = "tu_session_token";
const GATEWAY_APP_ID = "kinderschutz";

class NotLoggedInError extends Error {
  constructor(message) {
    super(message || "Nicht angemeldet");
    this.name = "NotLoggedInError";
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message || "Daten wurden zwischenzeitlich von einem anderen Gerät geändert");
    this.name = "ConflictError";
  }
}

function getSessionToken() {
  try { return localStorage.getItem(TOKEN_STORAGE_KEY); } catch (_) { return null; }
}

// Aufruf MIT Sitzung. Wirft NotLoggedInError, wenn kein Token da ist.
async function gatewayRequest(payload) {
  const token = getSessionToken();
  if (!token) throw new NotLoggedInError();
  return gatewaySenden(payload, token);
}

// Aufruf OHNE Sitzung — für die offenen Bereiche. Ein vorhandener Token wird
// trotzdem mitgeschickt: der Worker erkennt daran, dass die Meldung von einer
// angemeldeten Person kommt, und kann den Namen mitschreiben, WENN nicht anonym
// gemeldet wird. Ohne Token geht es genauso, nur eben immer anonym.
async function gatewayOffen(payload) {
  return gatewaySenden(payload, getSessionToken());
}

async function gatewaySenden(payload, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = "Bearer " + token;
  const resp = await fetch(GATEWAY_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  if (resp.status === 401) throw new NotLoggedInError("Sitzung abgelaufen");
  // 409 trägt hier eine echte Begründung ("Diese Meldung wurde inzwischen
  // geändert") und ist NICHT nur der Schreibkonflikt anderer Apps — deshalb wird
  // die Nachricht durchgereicht statt durch den generischen ConflictError-Text
  // ersetzt. Das gilt genauso für 400/403/429 aus dem Worker.
  if (!resp.ok) {
    let msg = `Gateway-Fehler (HTTP ${resp.status})`;
    try {
      const body = await resp.json();
      if (body && body.error) msg = body.error;
    } catch (_) { /* Antwort ohne JSON-Körper — Standardtext bleibt */ }
    if (resp.status === 409) throw new ConflictError(msg);
    throw new Error(msg);
  }
  return resp.json();
}

// ---------- Offene Bereiche (kein Login nötig) ----------

// Alles, was jeder sehen darf: Ansprechpartner, Meldeweg, Konzept, FAQ, externe
// Stellen, Kindertext, Schulungskapitel, und die paar Einstellungen, die die
// Oberfläche braucht (Rückmeldefrist, ob anonym erlaubt ist, ob das Formular
// offen ist).
//
// ⚠️ Was hier NIE mitkommt: `meldungen`, `beauftragte` (die Benutzernamen),
// `schulungStand` und alles aus `einstellungen`, was niemanden angeht. Der
// Worker baut die Antwort feldweise zusammen, statt ein Objekt zu filtern —
// ein neu hinzugefügtes Feld ist damit standardmäßig NICHT öffentlich.
//
// Ist eine Sitzung vorhanden, kommt zusätzlich `me` (canEdit/canAdmin/
// darfMeldungen) und `meinStand` (eigener Schulungsfortschritt) mit.
async function ladeOeffentlich() {
  return gatewayOffen({ action: "kinderschutz-info", app: GATEWAY_APP_ID });
}

// Eine Meldung absenden. Geht mit und ohne Login.
//
// ⚠️ Die Quittungsnummer erzeugt der SERVER und gibt sie genau einmal zurück —
// sie steht danach nur noch als Hash in der Datei. Geht sie verloren, gibt es
// keinen Weg zurück; das steht so auch im Formular.
//
// ⚠️ `anhaenge` sind hier nur die Kennungen bereits hochgeladener Dateien. Die
// Dateien selbst gehen über sendeAnhang(), BEVOR die Meldung abgesendet wird.
async function sendeMeldung(meldung) {
  return gatewayOffen({ action: "kinderschutz-melden", app: GATEWAY_APP_ID, meldung });
}

// Anhang hochladen, BEVOR die Meldung abgesendet wird. Der Server vergibt die
// Kennung und prüft den Dateityp an den ersten Bytes, nie an der Client-Angabe.
//
// ⚠️ Reihenfolge bindend: erst die Datei, dann die Meldung. Bricht es dazwischen
// ab, liegt höchstens eine Datei ohne Meldung herum — die räumt der nächtliche
// Lauf weg (ksVerwaisteAnhaengeRaeumen). Andersherum stünde in der Meldung eine
// Kennung ohne Datei dahinter.
async function sendeAnhang(name, contentType, dataBase64) {
  return gatewayOffen({ action: "kinderschutz-anhang-put", app: GATEWAY_APP_ID, name, contentType, dataBase64 });
}

// Nachschauen, was aus der eigenen Meldung wurde — mit der Quittungsnummer.
//
// ⚠️ Die Antwort enthält AUSDRÜCKLICH NICHT den Meldetext. Wer den Code errät,
// soll nichts über den Inhalt erfahren; der echte Melder kennt ihn ohnehin.
// Zurück kommen nur: Eingangsdatum, Stand, Antworttext und ob eine Antwort da
// ist. Dazu eine Bremse je Anschluss gegen das Durchprobieren.
async function frageNachStand(code) {
  return gatewayOffen({ action: "kinderschutz-stand", app: GATEWAY_APP_ID, code });
}

// ---------- Schulung (Fortschritt nur mit Login) ----------

// Ein Kapitel als gelesen/bestanden vermerken. Ohne Login passiert nichts —
// lesen darf jeder, der Nachweis hängt an einem Konto.
async function speichereSchulungsSchritt(kapitelId, bestanden) {
  return gatewayRequest({ action: "kinderschutz-schulung-schritt", app: GATEWAY_APP_ID, kapitelId, bestanden: !!bestanden });
}

// Die Nachweisliste: wer ist durch, wer nicht, wer braucht sie.
// Gate: Bearbeiten-Recht. Das ist bewusst NICHT das Meldungs-Recht — eine
// Schulungsliste ist kein Meldegeheimnis.
async function ladeSchulungsStand() {
  return gatewayRequest({ action: "kinderschutz-schulung-stand", app: GATEWAY_APP_ID });
}

// Häkchen "Schulung nötig" je Person setzen. Gate: Bearbeiten-Recht.
async function setzeSchulungNoetig(username, noetig) {
  return gatewayRequest({ action: "kinderschutz-schulung-noetig", app: GATEWAY_APP_ID, username, noetig: !!noetig });
}

// ---------- Meldungen (nur Beauftragte) ----------

// Die Meldungsliste. Gate: der Aufrufer steht in `beauftragte`.
//
// ⚠️ NICHT canEdit und NICHT isAdmin. Der globale Administrator der Flotte greift
// hier bewusst nicht durch — das ist der Kern der Zusage "nur die Beauftragten
// lesen mit". Technisch kommt er über die Nextcloud an die Datei; das steht so im
// Datenschutztext und wird nicht schöngeredet.
async function ladeMeldungen() {
  return gatewayRequest({ action: "kinderschutz-meldungen", app: GATEWAY_APP_ID });
}

// Stand einer Meldung setzen: neu | bearbeitung | extern | abgeschlossen.
//
// ⚠️ "extern" hält die Löschfrist an, solange etwas bei Jugendamt, Polizei oder
// einer Fachstelle läuft. "abgeschlossen" startet sie. Der Worker rechnet das
// selbst; der Client schickt nie ein Fristdatum mit.
async function setzeMeldungsStand(id, status) {
  return gatewayRequest({ action: "kinderschutz-meldung-status", app: GATEWAY_APP_ID, id, status });
}

// Antwort an den Melder hinterlegen — sichtbar über die Quittungsnummer, und bei
// angegebener Mailadresse zusätzlich per Mail.
async function antworteAufMeldung(id, text, perMail) {
  return gatewayRequest({ action: "kinderschutz-meldung-antwort", app: GATEWAY_APP_ID, id, text, perMail: !!perMail });
}

// Interne Notiz an einer Meldung. Geht nie an den Melder.
async function notiereAnMeldung(id, text) {
  return gatewayRequest({ action: "kinderschutz-meldung-notiz", app: GATEWAY_APP_ID, id, text });
}

// Eine mündlich oder telefonisch eingegangene Meldung nacherfassen.
async function erfasseMeldung(meldung) {
  return gatewayRequest({ action: "kinderschutz-meldung-erfassen", app: GATEWAY_APP_ID, meldung });
}

// Meldung endgültig löschen — samt Anhängen.
//
// ⚠️ Es gibt bewusst KEINEN automatischen Löschlauf (Michel-Entscheidung
// 29.08.2026). Die App erinnert, gelöscht wird von Hand. Folge: der
// Datenschutztext sagt "sobald sie nicht mehr benötigt wird, spätestens acht
// Wochen nach Abschluss" und verspricht keine Automatik, die es nicht gibt.
async function loescheMeldung(id) {
  return gatewayRequest({ action: "kinderschutz-meldung-loeschen", app: GATEWAY_APP_ID, id });
}

// Einen Anhang abrufen. Gate wie die Meldungsliste. Kommt als Data-URL zurück,
// nie als offene Adresse — eine Bilddatei mit ratbarer URL wäre der Umweg um
// jedes Recht.
async function ladeAnhang(meldungId, anhangId) {
  return gatewayRequest({ action: "kinderschutz-anhang-get", app: GATEWAY_APP_ID, meldungId, anhangId });
}

// ---------- Verwaltung (Inhalte pflegen) ----------

// Gate: Bearbeiten-Recht. Inhalte pflegen und Meldungen lesen sind getrennte
// Rechte — Michel pflegt Texte, ohne Meldungen zu sehen; die Beauftragte sieht
// Meldungen und darf zusätzlich Texte pflegen.
async function speichereInhalte(teil, daten) {
  return gatewayRequest({ action: "kinderschutz-inhalt-speichern", app: GATEWAY_APP_ID, teil, daten });
}

// Foto eines Ansprechpartners ablegen. Gate: Bearbeiten-Recht.
async function speicherePortrait(id, contentType, dataBase64) {
  return gatewayRequest({ action: "kinderschutz-portrait-put", app: GATEWAY_APP_ID, id, contentType, dataBase64 });
}

// Die Liste derer, die Meldungen lesen dürfen.
//
// ⚠️ Ändern darf sie nur, wer Administrieren-Recht hat — und JEDE Änderung landet
// in `beauftragteVerlauf`, der in der App SICHTBAR ist. Der technische
// Administrator könnte sich selbst eintragen; das lässt sich nicht verhindern,
// aber es lässt sich sichtbar machen. Genau das ist hier der Schutz.
async function setzeBeauftragte(namen) {
  return gatewayRequest({ action: "kinderschutz-beauftragte-setzen", app: GATEWAY_APP_ID, namen });
}

// Die Nutzerliste für die Auswahlfelder (Beauftragte, Schulungspflicht).
async function ladeNutzerliste() {
  return gatewayRequest({ action: "list-tool-editors", app: GATEWAY_APP_ID });
}

// Aktuelle Sitzung. Wirft NotLoggedInError, wenn niemand angemeldet ist —
// in dieser App ist das der Normalfall und KEIN Fehler.
async function fetchMe() {
  return gatewayRequest({ action: "me", app: GATEWAY_APP_ID });
}
