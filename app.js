// Kinderschutz-App — Oberfläche und Ablauf.
//
// ⚠️ Diese App hat KEIN Anmelde-Gate. Sie startet für jeden Besucher. Was
// Anmeldung braucht, blendet sich einzeln ein (siehe rechteAnwenden). Wer das
// später ändert, sperrt Kinder, Jugendliche und Eltern aus — genau die
// Zielgruppe, für die die App gebaut wurde.
//
// ⚠️ Es gibt keinen Debounce-Save und keinen lokalen Bestand, der zurück-
// geschrieben wird. Jede Änderung ist ein eigener Worker-Aufruf, danach wird neu
// geladen. Grund: die Daten sind teils login-los geschrieben und teils
// hochsensibel — ein "ganzes Dokument vom Client" gibt es hier nicht.

let daten = null;           // die öffentlichen Inhalte (immer da)
let currentUser = null;     // { username, name, isAdmin, canEdit, canAdmin, darfMeldungen } oder null
let meinStand = null;       // eigener Schulungsfortschritt (nur angemeldet)
let meldungen = null;       // nur für Beauftragte, erst auf Anforderung geladen
let schulungsListe = null;  // Nachweisliste, erst auf Anforderung geladen
let nutzerListe = [];       // für die Auswahlfelder in der Verwaltung
let kindModus = false;
let anhangPuffer = [];      // { id, name, typ, groesse } vor dem Absenden

const MODUS_KEY = "ks_modus";

// ---------- Kleinkram ----------

function $(id) { return document.getElementById(id); }

// Jede Zeichenkette aus den Daten läuft hier durch, bevor sie in innerHTML
// landet. Ein Ansprechpartner-Name kommt aus einem Textfeld — auch ein
// vertrauenswürdiger Bearbeiter tippt mal ein spitzes Klammerzeichen.
function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// Für href="tel:..." und href="mailto:..." reicht esc() nicht: dort könnte ein
// javascript:-Schema stehen. Deshalb wird das Schema hier selbst gesetzt und
// alles Verdächtige aus dem Rest entfernt.
function telHref(nr) {
  const rein = String(nr || "").replace(/[^0-9+]/g, "");
  return rein ? "tel:" + rein : "";
}
function mailHref(adr) {
  const s = String(adr || "").trim();
  return /^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(s) ? "mailto:" + s : "";
}

function toast(text, art) {
  const t = $("toast");
  t.textContent = text;
  t.className = "toast" + (art ? " " + art : "");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.add("hidden"), art === "fehler" ? 7000 : 4000);
}

function status(text, fehler) {
  const s = $("save-status");
  s.textContent = text || "";
  s.className = "header-status" + (fehler ? " error" : "");
}

function datumDe(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return String(iso);
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}
function datumZeitDe(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return String(iso);
  return d.toLocaleString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// Wie viele Tage liegt ein Zeitpunkt zurück? Für Fristen und Mahnungen.
function tageSeit(iso) {
  const d = Date.parse(iso || "");
  if (!d) return 0;
  return Math.floor((Date.now() - d) / 86400000);
}

// Werktage zwischen einem Datum und heute. Samstag und Sonntag zählen nicht —
// die zugesagten drei Werktage sollen an einem Freitagabend nicht schon am
// Montag gerissen sein.
function werktageSeit(iso) {
  const start = new Date(Date.parse(iso || ""));
  if (isNaN(start)) return 0;
  let tage = 0;
  const lauf = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const heute = new Date();
  const ende = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate());
  while (lauf < ende) {
    lauf.setDate(lauf.getDate() + 1);
    const wt = lauf.getDay();
    if (wt !== 0 && wt !== 6) tage++;
  }
  return tage;
}

// ---------- Start ----------

document.addEventListener("DOMContentLoaded", start);

async function start() {
  $("app-version").textContent = APP_VERSION;
  notfallZeichnen();
  changelogZeichnen();
  navVerdrahten();
  modusVerdrahten();
  meldeFormularVerdrahten();
  standAbfrageVerdrahten();

  try {
    const antwort = await ladeOeffentlich();
    daten = antwort;
    currentUser = antwort.me || null;
    meinStand = antwort.meinStand || null;
    status("");
  } catch (e) {
    // ⚠️ Ein Fehler beim Laden darf die App nicht leer lassen. Der Notrufkasten
    // steht schon (fest im Code), die Vorgabetexte springen ein, und der Fehler
    // wird benannt statt verschwiegen.
    daten = vorgabeAlsDaten();
    status("Inhalte konnten nicht geladen werden", true);
    toast("Die Inhalte konnten nicht geladen werden. Du siehst die Entwurfsfassung. Die Notrufnummern oben stimmen trotzdem.", "fehler");
  }

  if (currentUser) {
    $("header-user").textContent = currentUser.name || currentUser.username || "";
  }
  rechteAnwenden();
  allesZeichnen();
  fixKnopfVerdrahten();
}

// Die Vorgabe als vollständiger Datensatz — für den Fehlerfall und für den
// Erststart, solange in Nextcloud noch nichts steht.
function vorgabeAlsDaten() {
  return {
    istVorgabe: true,
    ansprechpartner: [],
    beauftragteNamen: [],
    beauftragteVerlauf: [],
    konzept: { version: VORGABE_KONZEPT_VERSION, html: VORGABE_KONZEPT_HTML, standAm: "", istEntwurf: true },
    zusammenfassung: VORGABE_ZUSAMMENFASSUNG,
    meldeweg: VORGABE_MELDEWEG,
    rolle: VORGABE_ROLLE,
    schulung: VORGABE_SCHULUNG,
    faq: VORGABE_FAQ,
    externe: VORGABE_EXTERNE,
    kindertext: VORGABE_KINDERTEXT,
    einstellungen: {
      anonymErlaubt: true, anhaengeErlaubt: true, rueckmeldeTage: 3,
      loeschfristWochen: 8, meldungenOffen: true, datenschutzHtml: VORGABE_DATENSCHUTZ
    },
    me: currentUser, meinStand: meinStand
  };
}

// Ein Feld aus den geladenen Daten, mit Rückfall auf die Vorgabe — aber NUR,
// wenn es wirklich leer ist. Eine bewusst geleerte Liste soll nicht stillschweigend
// durch die Vorgabe wieder aufgefüllt werden; deshalb wird auf null/undefined
// geprüft und nicht auf "leer".
function feld(name, vorgabe) {
  if (!daten) return vorgabe;
  const w = daten[name];
  if (w === null || w === undefined) return vorgabe;
  if (Array.isArray(w) && w.length === 0 && daten.istVorgabe) return vorgabe;
  return w;
}

// ---------- Rechte ----------

// ⚠️ Drei getrennte Stufen, und die dritte ist NICHT aus den anderen ableitbar:
//
//   canEdit          -> Inhalte pflegen (Verwaltung), Schulungsliste sehen
//   canAdmin         -> zusätzlich: wer Meldungen lesen darf, festlegen
//   darfMeldungen    -> Meldungen lesen. Kommt AUSSCHLIESSLICH daher, dass der
//                       Benutzername in der Beauftragten-Liste steht.
//
// Der globale Administrator der Flotte hat isAdmin === true und damit canEdit
// und canAdmin — aber NICHT darfMeldungen. Das ist der Kern der Zusage an die
// Melder. Wer hier ein "|| currentUser.isAdmin" ergänzt, hebt sie auf.
function canEdit() { return !!(currentUser && (currentUser.isAdmin || currentUser.canEdit)); }
function canAdmin() { return !!(currentUser && (currentUser.isAdmin || currentUser.canAdmin)); }
function darfMeldungen() { return !!(currentUser && currentUser.darfMeldungen); }

function rechteAnwenden() {
  document.querySelectorAll(".editor-only").forEach((el) => el.classList.toggle("hidden", !canEdit()));
  document.querySelectorAll(".admin-only").forEach((el) => el.classList.toggle("hidden", !canAdmin()));
  document.querySelectorAll(".beauftragte-only").forEach((el) => el.classList.toggle("hidden", !darfMeldungen()));
}

// ---------- Navigation ----------

function navVerdrahten() {
  document.querySelectorAll("nav button[data-tab]").forEach((b) => {
    b.addEventListener("click", () => tabZeigen(b.dataset.tab));
  });
}

function tabZeigen(name) {
  document.querySelectorAll("nav button[data-tab]").forEach((b) => b.classList.toggle("active", b.dataset.tab === name));
  document.querySelectorAll(".tab-section").forEach((s) => s.classList.toggle("active", s.id === "tab-" + name));
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

  // Erst beim Öffnen laden — sonst holt jeder Seitenaufruf Daten, die keiner
  // ansieht. Bei den Meldungen ist das nicht nur Tempo: die Datei soll so selten
  // wie möglich über die Leitung gehen.
  if (name === "meldungen" && darfMeldungen() && meldungen === null) meldungenLaden();
  if (name === "schulung" && canEdit() && schulungsListe === null) schulungsListeLaden();
  if (name === "verwaltung" && canEdit()) verwaltungZeichnen();
}

// ---------- Erwachsen / Kind ----------

function modusVerdrahten() {
  try {
    kindModus = localStorage.getItem(MODUS_KEY) === "kind";
  } catch (_) { kindModus = false; }
  document.querySelectorAll("#modus-schalter button").forEach((b) => {
    b.addEventListener("click", () => {
      kindModus = b.dataset.modus === "kind";
      try { localStorage.setItem(MODUS_KEY, kindModus ? "kind" : "erwachsen"); } catch (_) { /* privater Modus */ }
      modusAnwenden();
    });
  });
}

function modusAnwenden() {
  document.body.classList.toggle("ks-kindmodus", kindModus);
  document.querySelectorAll("#modus-schalter button").forEach((b) => {
    b.setAttribute("aria-pressed", String((b.dataset.modus === "kind") === kindModus));
  });
  $("start-erwachsen").classList.toggle("hidden", kindModus);
  $("start-kind").classList.toggle("hidden", !kindModus);
}

// ---------- Zeichnen ----------

function allesZeichnen() {
  const kon = feld("konzept", { version: VORGABE_KONZEPT_VERSION, html: VORGABE_KONZEPT_HTML, istEntwurf: true });
  $("entwurf-hinweis").classList.toggle("hidden", !(daten && (daten.istVorgabe || kon.istEntwurf)));

  heldZeichnen();
  partnerZeichnen();
  wegZeichnen();
  rolleZeichnen();
  beauftragteOffenZeichnen();
  konzeptZeichnen();
  schulungZeichnen();
  faqZeichnen();
  hilfeZeichnen();
  kindZeichnen();
  datenschutzZeichnen();
  modusAnwenden();
}

function notfallZeichnen() {
  const k = $("notfall-kasten");
  k.innerHTML =
    '<h2>Bist du oder ist jemand gerade in Gefahr?</h2>' +
    '<p>Dann warte nicht auf diese App. Sie wird nicht rund um die Uhr gelesen.</p>' +
    '<div class="ks-notfall-nummern">' +
    NOTFALL_FEST.map((n) =>
      '<a href="' + esc(telHref(n.nummer)) + '">' +
      '<span class="nr">' + esc(n.nummer) + '</span>' +
      '<span class="was">' + esc(n.name) + '</span>' +
      '<span class="was">' + esc(n.hinweis) + '</span>' +
      '</a>').join("") +
    '</div>';
}

// Die Beauftragte. Sie ist der erste Eintrag in ansprechpartner mit
// rolle === "beauftragte", sonst der erste überhaupt.
function beauftragtePerson() {
  const liste = feld("ansprechpartner", []);
  return liste.find((p) => p.rolle === "beauftragte") || liste[0] || null;
}

function heldZeichnen() {
  const p = beauftragtePerson();
  const k = $("held-kachel");
  const botschaft = "Du hast eine Frage, ein ungutes Gefühl oder möchtest etwas melden? " +
    "Du kannst dich jederzeit an unsere Kinder- und Jugendschutzbeauftragte wenden.";

  if (!p) {
    k.innerHTML =
      '<div class="ks-held-kopf">' +
      '<div class="ks-held-foto ks-held-foto-leer">🛟</div>' +
      '<div class="ks-held-text">' +
      '<span class="rolle">Kinder- und Jugendschutz</span>' +
      '<h2>Noch nicht eingetragen</h2>' +
      '<div class="funktion">Die Kontaktdaten der Beauftragten fehlen noch.</div>' +
      '</div></div>' +
      '<div class="ks-held-botschaft">' + esc(botschaft) + '</div>' +
      '<div class="ks-held-knoepfe">' +
      '<a class="aus">Anrufen</a><a class="aus">E-Mail schreiben</a>' +
      '</div>';
    return;
  }

  const tel = telHref(p.telefon);
  const mail = mailHref(p.email);
  const fotoHtml = p.bildUrl
    ? '<img class="ks-held-foto" src="' + esc(p.bildUrl) + '" alt="' + esc(p.name) + '" />'
    : '<div class="ks-held-foto ks-held-foto-leer">👤</div>';

  k.innerHTML =
    '<div class="ks-held-kopf">' + fotoHtml +
    '<div class="ks-held-text">' +
    '<span class="rolle">Kinder- und Jugendschutzbeauftragte</span>' +
    '<h2>' + esc(p.name) + '</h2>' +
    '<div class="funktion">' + esc(p.funktion || "Kinder- und Jugendschutzbeauftragte") + '</div>' +
    (p.erreichbarkeit ? '<div class="erreichbar">🕐 ' + esc(p.erreichbarkeit) + '</div>' : "") +
    '</div></div>' +
    '<div class="ks-held-botschaft">' + esc(botschaft) +
    (p.aufgabenText ? '<br /><br />' + esc(p.aufgabenText) : "") + '</div>' +
    '<div class="ks-held-knoepfe">' +
    (tel ? '<a href="' + esc(tel) + '">📞 Anrufen</a>' : '<a class="aus">📞 Keine Nummer hinterlegt</a>') +
    (mail ? '<a href="' + esc(mail) + '">✉️ E-Mail schreiben</a>' : '<a class="aus">✉️ Keine Adresse hinterlegt</a>') +
    '</div>';
}

function partnerZeichnen() {
  const alle = feld("ansprechpartner", []);
  const haupt = beauftragtePerson();
  const rest = alle.filter((p) => p !== haupt);
  const box = $("partner-liste");
  $("partner-leer").classList.toggle("hidden", rest.length > 0);

  box.innerHTML = rest.map((p) => {
    const tel = telHref(p.telefon);
    const mail = mailHref(p.email);
    const foto = p.bildUrl
      ? '<img src="' + esc(p.bildUrl) + '" alt="' + esc(p.name) + '" />'
      : '<div class="ks-partner-foto-leer">👤</div>';
    return '<div class="ks-partner">' + foto +
      '<div class="ks-partner-text">' +
      '<strong>' + esc(p.name) + '</strong>' +
      '<span class="funktion">' + esc(p.funktion || "") + '</span>' +
      (p.erreichbarkeit ? '<span class="funktion">🕐 ' + esc(p.erreichbarkeit) + '</span>' : "") +
      '<div class="ks-partner-wege">' +
      (tel ? '<a href="' + esc(tel) + '">📞 Anrufen</a>' : "") +
      (mail ? '<a href="' + esc(mail) + '">✉️ E-Mail</a>' : "") +
      '</div></div></div>';
  }).join("");
}

function wegZeichnen() {
  const weg = feld("meldeweg", VORGABE_MELDEWEG);
  $("weg-liste").innerHTML = weg.map((s) =>
    '<div class="ks-weg-schritt' + (s.nr === 3 ? " betont" : "") + '">' +
    '<div class="ks-weg-nr">' + esc(s.nr) + '</div>' +
    '<div class="ks-weg-text"><strong>' + esc(s.titel) + '</strong><p>' + esc(s.text) + '</p></div>' +
    '</div>').join("");
}

function rolleZeichnen() {
  const r = feld("rolle", VORGABE_ROLLE);
  $("rolle-macht").innerHTML = (r.macht || []).map((t) => "<li>" + esc(t) + "</li>").join("");
  $("rolle-macht-nicht").innerHTML = (r.machtNicht || []).map((t) => "<li>" + esc(t) + "</li>").join("");
}

// Wer Meldungen lesen darf — offen für JEDEN sichtbar, auch ohne Anmeldung.
// Das ist der Gegenwert dafür, dass die Liste im Verwaltungsbereich änderbar
// ist: sie lässt sich nicht still verändern.
function beauftragteOffenZeichnen() {
  const namen = feld("beauftragteNamen", []);
  const verlauf = feld("beauftragteVerlauf", []);
  const box = $("beauftragte-offen");

  let html = "";
  if (!namen.length) {
    html += '<p class="muted">Es ist noch niemand eingetragen. Bis dahin kann niemand Meldungen in der App lesen — bitte wende dich direkt an die Beauftragte oder an eine der externen Stellen.</p>';
  } else {
    html += '<p style="line-height:1.6;">Deine Meldung können <strong>' + namen.length +
      (namen.length === 1 ? ' Person</strong> lesen:' : ' Personen</strong> lesen:') + '</p><ul style="margin:10px 0 0 20px;">' +
      namen.map((n) => '<li style="margin-bottom:4px;">' + esc(n) + '</li>').join("") + '</ul>';
    html += '<p class="muted" style="margin-top:12px; line-height:1.55;">Niemand sonst — auch nicht der technische Administrator der Vereins-Tools. ' +
      'Wenn es um eine dieser Personen selbst geht, wende dich bitte an eine der externen Stellen im Bereich Hilfe.</p>';
  }

  if (verlauf.length) {
    html += '<details style="margin-top:14px;"><summary class="muted" style="cursor:pointer;">Änderungen an dieser Liste (' + verlauf.length + ')</summary>' +
      '<ul style="margin:10px 0 0 20px; font-size:0.86rem; color:var(--muted);">' +
      verlauf.slice().reverse().slice(0, 30).map((v) =>
        '<li style="margin-bottom:5px;">' + esc(datumZeitDe(v.am)) + ' — ' + esc(v.was) + ' (durch ' + esc(v.von) + ')</li>'
      ).join("") + '</ul></details>';
  }
  box.innerHTML = html;
}

function konzeptZeichnen() {
  const kon = feld("konzept", { version: VORGABE_KONZEPT_VERSION, html: VORGABE_KONZEPT_HTML, istEntwurf: true });
  const zus = feld("zusammenfassung", VORGABE_ZUSAMMENFASSUNG);

  $("konzept-karten").innerHTML = zus.map((z) =>
    '<div class="ks-karte"><span class="icon">' + esc(z.icon || "•") + '</span>' +
    '<strong>' + esc(z.titel) + '</strong><p>' + esc(z.text) + '</p></div>').join("");

  $("konzept-stand").textContent =
    "Fassung " + (kon.version || "—") +
    (kon.standAm ? ", Stand " + datumDe(kon.standAm) : "") +
    (kon.istEntwurf ? " — noch nicht vom Verein freigegeben" : "");

  // ⚠️ Hier steht bewusst innerHTML: der Wortlaut ist ein formatiertes Dokument
  // mit Überschriften und Listen. Er kommt aus der Verwaltung und damit nur von
  // Personen mit Bearbeiten-Recht. Für Melder-Eingaben gilt das NICHT — dort
  // läuft alles durch esc().
  $("konzept-wortlaut").innerHTML = kon.html || VORGABE_KONZEPT_HTML;

  $("btn-konzept-drucken").onclick = () => window.print();
}

function faqZeichnen() {
  $("faq-liste").innerHTML = feld("faq", VORGABE_FAQ).map((f) =>
    '<details class="ks-frage"><summary>' + esc(f.frage) + '</summary>' +
    '<div class="ks-frage-antwort">' + esc(f.antwort) + '</div></details>').join("");
}

function hilfeZeichnen() {
  const liste = feld("externe", VORGABE_EXTERNE).slice()
    .sort((a, b) => (a.notfall === b.notfall ? (a.sortierung || 0) - (b.sortierung || 0) : (a.notfall ? -1 : 1)));

  $("hilfe-liste").innerHTML = liste.map((s) => {
    const tel = telHref(s.telefon);
    const mail = mailHref(s.email);
    const web = /^https?:\/\//i.test(String(s.web || "")) ? s.web : "";
    return '<div class="ks-stelle' + (s.notfall ? " notfall" : "") + '">' +
      '<strong>' + esc(s.name) + (s.notfall ? ' <span class="ks-chip rot">Notfall</span>' : "") + '</strong>' +
      '<p>' + esc(s.beschreibung || "") + '</p>' +
      '<div class="ks-stelle-wege">' +
      (tel ? '<a href="' + esc(tel) + '">📞 ' + esc(s.telefon) + '</a>' : "") +
      (mail ? '<a class="sanft" href="' + esc(mail) + '">✉️ E-Mail</a>' : "") +
      (web ? '<a class="sanft" href="' + esc(web) + '" target="_blank" rel="noopener noreferrer">🌐 Webseite</a>' : "") +
      '</div></div>';
  }).join("");
}

function kindZeichnen() {
  const kt = feld("kindertext", VORGABE_KINDERTEXT);
  $("kind-gruss").textContent = kt.begruessung || VORGABE_KINDERTEXT.begruessung;
  $("kind-bloecke").innerHTML = (kt.bloecke || []).map((b) =>
    '<div class="ks-kind-block"><span class="icon">' + esc(b.icon || "•") + '</span>' +
    '<strong>' + esc(b.titel) + '</strong><p>' + esc(b.text) + '</p></div>').join("");

  const p = beauftragtePerson();
  const tel = p ? telHref(p.telefon) : "";
  $("kind-wer").innerHTML =
    '<span class="icon">👋</span><strong>Das ist unsere Kinderschutz-Beauftragte</strong>' +
    '<p>' + (p ? esc(p.name) + " kümmert sich darum, dass es dir beim Fußball gut geht. Du darfst sie jederzeit ansprechen." : "Sie ist noch nicht eingetragen.") + '</p>' +
    (tel ? '<div class="ks-stelle-wege" style="margin-top:10px;"><a href="' + esc(tel) + '">📞 Anrufen</a></div>' : "");
}

function datenschutzZeichnen() {
  const e = feld("einstellungen", {});
  // Auch hier bewusst innerHTML — formatierter Rechtstext aus der Verwaltung.
  $("info-datenschutz").innerHTML = e.datenschutzHtml || VORGABE_DATENSCHUTZ;
}

function changelogZeichnen() {
  $("changelog").innerHTML = APP_CHANGELOG.map((b) =>
    '<div style="margin-bottom:16px;"><strong>Version ' + esc(b.version) + '</strong>' +
    b.groups.map((g) =>
      '<div style="margin-top:8px;"><em>' + esc(g.title) + '</em><ul style="margin:6px 0 0 20px;">' +
      g.items.map((i) => '<li style="margin-bottom:4px; line-height:1.5;">' + esc(i) + '</li>').join("") +
      '</ul></div>').join("") + '</div>').join("");
}

// Der feste Meldeknopf am unteren Rand. Er erscheint, sobald der große Knopf
// oben nicht im Bild ist — sonst stünden zwei gleiche Knöpfe übereinander.
function fixKnopfVerdrahten() {
  const knopf = document.createElement("button");
  knopf.type = "button";
  knopf.className = "ks-melden-gross ks-melden-fix hidden";
  knopf.addEventListener("click", meldeModalOeffnen);
  document.body.appendChild(knopf);

  // Der feste Knopf spricht die Sprache der Seite, auf der er schwebt. Im
  // Kinder-Modus heißt der große Knopf "Ich möchte etwas erzählen"; ein
  // schwebendes "Verdacht oder Vorfall melden" daneben wäre genau der
  // Behördenton, den der Kinderbereich vermeiden soll.
  let letzteBeschriftung = null;
  const beschriften = () => {
    const text = document.body.classList.contains("ks-kindmodus")
      ? "<span>💬</span><span>Ich möchte etwas erzählen</span>"
      : "<span>🛟</span><span>Verdacht oder Vorfall melden</span>";
    if (text !== letzteBeschriftung) {
      knopf.innerHTML = text;
      letzteBeschriftung = text;
    }
  };

  const beobachten = () => {
    const aktiverTab = document.querySelector(".tab-section.active");
    const aufMeldeTab = aktiverTab && ["tab-meldungen", "tab-verwaltung", "tab-info"].indexOf(aktiverTab.id) !== -1;
    const oben = $("btn-melden-start");
    // ⚠️ ZWEI Bedingungen, nicht eine. `bottom > 0` allein heißt nur "nicht nach
    // oben weggescrollt" und ist damit auch für einen Knopf WEIT UNTERHALB des
    // Bildschirmrands wahr. Genau dort steht er am Handy: hochkant bei 1392 px
    // auf 812 px Schirmhöhe, quer bei 952 px auf 375 px (gemessen 2026-08-29).
    // Ohne `top < innerHeight` galt er über den GANZEN Scrollweg als sichtbar —
    // der feste Knopf blieb auf der Startseite also immer weg, ausgerechnet auf
    // der Seite, auf der jeder ankommt und für die er gebaut wurde.
    // Für ein display:none-Element bleibt es bei `bottom > 0` = false, die
    // Erkennung "steht auf einem anderen Tab" hängt also weiter daran.
    const r = oben ? oben.getBoundingClientRect() : null;
    const obenImBild = !!r && r.bottom > 0 && r.top < window.innerHeight && !oben.closest(".hidden");
    const modalZu = $("melde-modal").classList.contains("hidden");

    // ⚠️ Der schwebende Knopf darf den Notfallkasten NICHT überdecken
    // (Entscheidung Michel, 2026-08-29). Er steht unten fest; solange der Kasten
    // bis in diesen Streifen hineinreicht, läge er quer mitten auf der 116111
    // und hochkant auf dem Elterntelefon. Eine Nummer, die im Notfall gewählt
    // wird, hat Vorrang vor einem Knopf, der einen Wisch später erscheint.
    // Sichtbar wird er dadurch ab rund 134 px Scrollweg hochkant und 267 px quer
    // — statt wie vorher nie (gemessen 2026-08-29).
    // KNOPF_STREIFEN ist bewusst dieselbe Zahl wie das `padding-bottom` von
    // `.ks-hat-fixknopf .tab-inhalt` in kinderschutz.css: beide beschreiben den
    // Streifen, den der Knopf am unteren Rand belegt. Nicht die eine ändern,
    // ohne die andere mitzunehmen.
    const KNOPF_STREIFEN = 84;
    const kasten = $("notfall-kasten");
    const kr = kasten ? kasten.getBoundingClientRect() : null;
    // Auf jedem anderen Tab ist der Kasten display:none, das Rect also lauter
    // Nullen — `0 > (innerHeight - 84)` ist false, dort bremst nichts.
    const verdecktNotfall = !!kr && kr.bottom > (window.innerHeight - KNOPF_STREIFEN);

    const zeigen = !aufMeldeTab && !obenImBild && modalZu && !verdecktNotfall;
    beschriften();
    knopf.classList.toggle("hidden", !zeigen);
    document.body.classList.toggle("ks-hat-fixknopf", zeigen);
  };
  window.addEventListener("scroll", beobachten, { passive: true });
  window.addEventListener("resize", beobachten);
  // ⚠️ Der Modus-Umschalter muss mit horchen: er tauscht den großen Knopf aus
  // und ändert damit sowohl die Sichtbarkeit als auch die Beschriftung.
  document.querySelectorAll("nav button[data-tab], #modus-schalter button")
    .forEach((b) => b.addEventListener("click", () => setTimeout(beobachten, 0)));
  beobachten();
}

// ---------- Meldeformular ----------

function meldeFormularVerdrahten() {
  ["btn-melden-start", "btn-melden-weg", "btn-melden-fragen", "btn-melden-kind"].forEach((id) => {
    const b = $(id);
    if (b) b.addEventListener("click", meldeModalOeffnen);
  });
  $("melde-schliessen").addEventListener("click", meldeModalSchliessen);
  $("btn-melde-abbrechen").addEventListener("click", meldeModalSchliessen);
  $("btn-melde-abbrechen2").addEventListener("click", meldeModalSchliessen);
  $("btn-melde-weiter").addEventListener("click", () => {
    $("melde-schritt-info").classList.add("hidden");
    $("melde-formular").classList.remove("hidden");
    $("melde-body").scrollTop = 0;
  });

  $("melde-anonym").addEventListener("change", (e) => {
    $("melde-kontakt-block").classList.toggle("hidden", e.target.checked);
  });

  $("melde-text").addEventListener("input", (e) => {
    $("melde-text-zahl").textContent = String(e.target.value.length);
  });

  $("melde-datei").addEventListener("change", dateienAufnehmen);
  $("melde-formular").addEventListener("submit", meldungAbsenden);

  // Klick auf den dunklen Hintergrund schließt — aber nur, wenn noch nichts
  // getippt wurde. Ein versehentlicher Klick darf keinen langen Text vernichten.
  $("melde-modal").addEventListener("click", (e) => {
    if (e.target !== $("melde-modal")) return;
    if ($("melde-text").value.trim() && !confirm("Der eingegebene Text geht verloren. Wirklich schließen?")) return;
    meldeModalSchliessen();
  });
}

function meldeModalOeffnen() {
  const e = feld("einstellungen", {});
  if (e.meldungenOffen === false) {
    toast("Das Meldeformular ist zurzeit geschlossen. Bitte wende dich direkt an die Beauftragte oder an eine der Nummern im Bereich Hilfe.", "fehler");
    return;
  }

  // ⚠️ Ohne eingetragene Beauftragte kann diese Meldung niemand lesen. Dann gar
  // nicht erst das Formular öffnen: eine Quittungsnummer auszugeben und den
  // Melder glauben zu lassen, es kümmere sich jemand, wäre schlimmer als eine
  // ehrliche Absage. Der Worker lehnt zusätzlich selbst ab (503) — das hier ist
  // nur der freundliche Weg davor.
  const namen = feld("beauftragteNamen", []);
  if (!namen.length) {
    toast("Zurzeit ist niemand als Kinder- und Jugendschutzbeauftragte eingetragen — deine Meldung könnte hier niemand lesen. Bitte wende dich an eine der Nummern im Bereich Hilfe: bei Gefahr 110, sonst 116 111.", "fehler");
    tabZeigen("hilfe");
    return;
  }
  $("melde-wer-liest").textContent =
    "Deine Meldung lesen: " + namen.join(", ") + ". Sonst niemand. Antwort bekommst du innerhalb von " +
    (e.rueckmeldeTage || 3) + " Werktagen.";

  // ⚠️ Art. 13 DSGVO verlangt die Information ZUM ZEITPUNKT der Erhebung, nicht
  // irgendwo auf der Seite. Bis 2026-08-29 standen hier nur Zweck und
  // Rechtsgrundlage, alles Weitere hinter dem Satz "steht im Tab Info" -- als
  // reiner Text, nicht einmal anklickbar. Wer hier meldet, ist meist ein Kind
  // ohne Vereinskonto, und die Angaben fallen unter Art. 9 und Art. 10.
  // Verantwortlicher, Speicherdauer und Aufsichtsbehörde gehören deshalb hierher.
  // Muster: der ds-block der übrigen Flotte, siehe fussballcamp/anmeldung.html.
  // ⚠️ Alles Weitere steht ZUGEKLAPPT. Die erste Fassung dieses Fixes setzte die
  // Pflichtangaben offen darüber und war am Handy gemessen 616 px hoch -- eine Wand
  // aus Rechtstext zwischen dem letzten Eingabefeld und dem Absende-Knopf, ausgerechnet
  // für jemanden, der gerade etwas Schweres aufschreibt. Genau deshalb ist der
  // Flotten-Standard ein <details class="ds-block"> in Vorgabe ZU
  // (fussballcamp/anmeldung.html). Art. 13 verlangt die Information an der Stelle der
  // Erhebung, nicht dass sie den Knopf verdeckt.
  $("melde-ds-hinweis").innerHTML =
    "<p style=\"margin:0 0 4px;\">Mit dem Absenden werden deine Angaben zum Schutz von " +
    "Kindern und Jugendlichen verarbeitet (Art. 6 Abs. 1 lit. f und Art. 9 Abs. 2 lit. f " +
    "DSGVO).</p>" +
    // ⚠️ Der vollständige Text steht HIER, nicht als Verweis auf einen anderen Tab.
    // Ein Sprung dorthin liefe über meldeModalSchliessen() und damit durch
    // form.reset() -- die halb getippte Meldung wäre weg. Und ein Verweis, den man
    // nicht anklicken kann, ist ohnehin kein Weg (f-gate-kappt-weg).
    // Der Text ist im Worker durch ksHtmlSicher gegangen, siehe handleKsInfo.
    "<details class=\"ds-block\" style=\"margin:0;\">" +
    "<summary>Wer verantwortlich ist, wie lange gespeichert wird, welche Rechte du hast</summary>" +
    "<div class=\"ds-block-inhalt\">" +
    "<p><strong>Verantwortlich</strong> ist der 1. SC 1911 Heiligenstadt e.V., Leineberg 2, " +
    "37308 Heilbad Heiligenstadt, Telefon 03606 612206, " +
    "<a href=\"mailto:info@sc1911-heiligenstadt.de\">info@sc1911-heiligenstadt.de</a>.</p>" +
    "<p><strong>Wie lange:</strong> so lange die Bearbeitung dauert, längstens " +
    (e.loeschfristWochen || 8) + " Wochen danach. Läuft ein Verfahren bei Behörde oder " +
    "Gericht, ruht diese Frist.</p>" +
    "<p><strong>Deine Rechte:</strong> Auskunft, Berichtigung, Löschung, Einschränkung und " +
    "Widerspruch. Du kannst dich auch beim Thüringer Landesbeauftragten für den Datenschutz " +
    "und die Informationsfreiheit beschweren.</p>" +
    (e.datenschutzHtml || VORGABE_DATENSCHUTZ) +
    "</div></details>";

  $("melde-anhang-block").classList.toggle("hidden", e.anhaengeErlaubt === false);
  $("melde-anonym").parentElement.classList.toggle("hidden", e.anonymErlaubt === false);

  $("melde-schritt-info").classList.remove("hidden");
  $("melde-formular").classList.add("hidden");
  $("melde-fertig").classList.add("hidden");
  $("melde-modal").classList.remove("hidden");
  $("melde-body").scrollTop = 0;
}

function meldeModalSchliessen() {
  $("melde-modal").classList.add("hidden");
  $("melde-formular").reset();
  $("melde-text-zahl").textContent = "0";
  $("melde-kontakt-block").classList.remove("hidden");
  anhangPuffer = [];
  $("melde-datei-liste").innerHTML = "";
}

async function dateienAufnehmen(ev) {
  const dateien = Array.from(ev.target.files || []);
  ev.target.value = "";
  for (const d of dateien) {
    if (anhangPuffer.length >= ANHANG_MAX_ANZAHL) {
      toast("Mehr als " + ANHANG_MAX_ANZAHL + " Dateien gehen nicht.", "fehler");
      break;
    }
    if (d.size > ANHANG_MAX_BYTES) {
      toast(d.name + " ist größer als 8 MB.", "fehler");
      continue;
    }
    if (ANHANG_TYPEN.indexOf(d.type) === -1) {
      toast(d.name + ": nur Bilder und PDF.", "fehler");
      continue;
    }
    try {
      status("Datei wird übertragen …");
      const b64 = await dateiAlsBase64(d);
      const antwort = await sendeAnhang(d.name, d.type, b64);
      anhangPuffer.push({ id: antwort.id, name: d.name, typ: d.type, groesse: d.size });
      anhangListeZeichnen();
      status("");
    } catch (e) {
      status("");
      toast("Die Datei konnte nicht übertragen werden: " + e.message, "fehler");
    }
  }
}

function dateiAlsBase64(datei) {
  return new Promise((ok, fehler) => {
    const r = new FileReader();
    r.onload = () => ok(String(r.result).split(",")[1] || "");
    r.onerror = () => fehler(new Error("Datei konnte nicht gelesen werden"));
    r.readAsDataURL(datei);
  });
}

function anhangListeZeichnen() {
  $("melde-datei-liste").innerHTML = anhangPuffer.map((a, i) =>
    '<div style="display:flex; gap:8px; align-items:center; background:var(--gray); border-radius:8px; padding:8px 10px; margin-bottom:6px;">' +
    '<span style="flex:1 1 auto; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">📎 ' + esc(a.name) + '</span>' +
    '<button type="button" class="btn tiny secondary" data-weg="' + i + '">Entfernen</button></div>').join("");
  $("melde-datei-liste").querySelectorAll("[data-weg]").forEach((b) => {
    b.addEventListener("click", () => {
      anhangPuffer.splice(Number(b.dataset.weg), 1);
      anhangListeZeichnen();
    });
  });
}

async function meldungAbsenden(ev) {
  ev.preventDefault();
  const text = $("melde-text").value.trim();
  if (text.length < 20) {
    toast("Bitte beschreibe kurz, was passiert ist — mindestens ein paar Sätze.", "fehler");
    $("melde-text").focus();
    return;
  }

  const anonym = $("melde-anonym").checked;
  const knopf = $("btn-melde-senden");
  knopf.disabled = true;
  knopf.textContent = "Wird gesendet …";

  try {
    const antwort = await sendeMeldung({
      anonym,
      // ⚠️ Bei anonym werden die Felder gar nicht erst mitgeschickt. Ein leeres
      // Feld hier ist die einzige Stelle, an der die Zusage "wir speichern
      // keinen Namen" technisch eingelöst wird — der Worker prüft es zusätzlich.
      name: anonym ? "" : $("melde-name").value.trim(),
      rolle: anonym ? "" : $("melde-rolle").value.trim(),
      telefon: anonym ? "" : $("melde-telefon").value.trim(),
      email: anonym ? "" : $("melde-email").value.trim(),
      vorfallDatum: $("melde-datum").value || "",
      vorfallOrt: $("melde-ort").value.trim(),
      betroffene: $("melde-betroffen").value.trim(),
      beteiligte: $("melde-beteiligte").value.trim(),
      beschreibung: text,
      anhaenge: anhangPuffer.map((a) => a.id)
    });

    $("melde-formular").classList.add("hidden");
    $("melde-fertig").classList.remove("hidden");
    $("melde-fertig").innerHTML =
      '<div class="ks-quittung">' +
      '<h3 style="margin-bottom:6px;">Deine Meldung ist angekommen.</h3>' +
      '<p style="line-height:1.55;">Schreib dir diese Nummer auf. Damit kannst du später nachschauen, was daraus geworden ist — ohne dich zu erkennen zu geben.</p>' +
      '<span class="code">' + esc(antwort.code) + '</span>' +
      '<p class="muted" style="line-height:1.5;">Wir zeigen sie dir nur dieses eine Mal. Geht sie verloren, gibt es keinen Weg zurück.</p>' +
      '<div class="btn-row" style="justify-content:center; margin-top:14px;">' +
      '<button type="button" class="btn" id="btn-code-kopieren">Nummer kopieren</button>' +
      '<button type="button" class="btn secondary" id="btn-fertig-schliessen">Schließen</button>' +
      '</div></div>' +
      '<p style="margin-top:16px; line-height:1.6;">Die Kinder- und Jugendschutzbeauftragte meldet sich innerhalb von ' +
      esc(String((feld("einstellungen", {}).rueckmeldeTage) || 3)) + ' Werktagen.</p>' +
      '<div class="ks-hinweis wichtig" style="margin-top:12px;">Wenn sich die Lage zuspitzt oder jemand in Gefahr ist: nicht warten, sondern 110 anrufen.</div>';

    $("btn-code-kopieren").addEventListener("click", () => {
      // clipboard gibt es auf älteren iOS-Geräten nicht — dort bleibt die
      // Nummer am Bildschirm stehen und lässt sich von Hand abschreiben.
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(antwort.code).then(
          () => toast("Nummer kopiert.", "gut"),
          () => toast("Kopieren ging nicht. Bitte abschreiben.", "fehler"));
      } else {
        toast("Dieses Gerät kann nicht kopieren. Bitte abschreiben.", "fehler");
      }
    });
    $("btn-fertig-schliessen").addEventListener("click", meldeModalSchliessen);
    anhangPuffer = [];
  } catch (e) {
    toast("Die Meldung konnte nicht gesendet werden: " + e.message, "fehler");
  } finally {
    knopf.disabled = false;
    knopf.textContent = "Meldung absenden";
  }
}

// ---------- Stand abfragen ----------

function standAbfrageVerdrahten() {
  $("btn-stand-abfragen").addEventListener("click", standAbfragen);
  $("stand-code").addEventListener("keydown", (e) => { if (e.key === "Enter") standAbfragen(); });
}

async function standAbfragen() {
  const code = $("stand-code").value.trim().toUpperCase();
  const box = $("stand-ergebnis");
  if (!CODE_MUSTER.test(code)) {
    box.innerHTML = '<div class="ks-hinweis wichtig">Die Nummer sieht nicht richtig aus. Sie hat die Form KS-XXXX-XXXX.</div>';
    return;
  }
  box.innerHTML = '<p class="muted">Wird geprüft …</p>';
  try {
    const a = await frageNachStand(code);
    const stufe = MELDE_STAENDE.find((s) => s.id === a.status) || MELDE_STAENDE[0];
    box.innerHTML =
      '<div class="card" style="border-left:4px solid var(--' + (stufe.farbe === "rot" ? "red" : stufe.farbe === "gelb" ? "gold" : stufe.farbe === "blau" ? "blue" : "green") + ');">' +
      '<p class="muted" style="font-size:0.85rem;">Eingegangen am ' + esc(datumDe(a.eingangAm)) + '</p>' +
      '<p style="margin:8px 0;"><strong>Stand: ' + esc(stufe.label) + '</strong></p>' +
      '<p class="muted" style="line-height:1.5;">' + esc(stufe.beschreibung) + '</p>' +
      (a.antwort
        ? '<div style="margin-top:12px; padding:12px; background:var(--blue-light); border-radius:8px; line-height:1.55;">' +
          '<strong>Nachricht für dich</strong><br />' + esc(a.antwort) + '</div>'
        : '<p class="muted" style="margin-top:12px;">Es liegt noch keine Nachricht für dich vor.</p>') +
      '</div>';
  } catch (e) {
    box.innerHTML = '<div class="ks-hinweis wichtig">' + esc(e.message) + '</div>';
  }
}

// ---------- Schulung ----------

function schulungZeichnen() {
  const kapitel = feld("schulung", VORGABE_SCHULUNG);
  const stand = (meinStand && meinStand.kapitel) || {};
  const fertig = kapitel.filter((k) => stand[k.id]).length;
  const anteil = kapitel.length ? Math.round((fertig / kapitel.length) * 100) : 0;

  const f = $("schulung-fortschritt");
  if (!currentUser) {
    f.innerHTML =
      '<strong>Schulung Kinder- und Jugendschutz</strong>' +
      '<p class="muted" style="margin-top:6px; line-height:1.55;">Sechs kurze Kapitel, etwa 20 Minuten. Lesen kannst du sie ohne Anmeldung. ' +
      'Damit dein Abschluss gespeichert wird und im Verein als Nachweis zählt, musst du dich über die Tools-Übersicht anmelden.</p>' +
      '<div class="btn-row" style="margin-top:10px;"><a class="btn secondary" href="https://sc1911heiligenstadt.github.io/ToolsUebersicht/">Zur Anmeldung</a></div>';
  } else if (fertig === kapitel.length && kapitel.length) {
    f.innerHTML = '<span class="ks-abzeichen">✅ Schulung abgeschlossen' +
      (meinStand && meinStand.bestandenAm ? " am " + esc(datumDe(meinStand.bestandenAm)) : "") + '</span>' +
      '<p class="muted" style="margin-top:8px;">Du kannst die Kapitel jederzeit noch einmal lesen.</p>';
  } else {
    f.innerHTML = '<strong>Dein Fortschritt: ' + fertig + " von " + kapitel.length + ' Kapiteln</strong>' +
      '<div class="ks-balken"><span style="width:' + anteil + '%;"></span></div>' +
      '<p class="muted">Ein Kapitel gilt als geschafft, wenn du die Frage am Ende richtig beantwortet hast.</p>';
  }

  $("schulung-kapitel").innerHTML = kapitel.map((k, i) => {
    const ok = !!stand[k.id];
    return '<details class="ks-kapitel' + (ok ? " fertig" : "") + '" data-kap="' + esc(k.id) + '">' +
      '<summary><span class="ks-kapitel-haken">' + (ok ? "✓" : String(i + 1)) + '</span>' +
      '<span style="flex:1 1 auto; min-width:0;">' + esc(k.titel) + '</span>' +
      '<span class="muted" style="font-size:0.82rem;">' + esc(k.dauer || "") + '</span></summary>' +
      '<div class="ks-kapitel-inhalt">' + (k.html || "") +
      (k.frage ? quizHtml(k, ok) : "") + '</div></details>';
  }).join("");

  $("schulung-kapitel").querySelectorAll(".ks-quiz-antwort").forEach((b) => {
    b.addEventListener("click", () => quizAntwort(b));
  });
}

function quizHtml(kapitel, schonBestanden) {
  const f = kapitel.frage;
  return '<div class="ks-quiz" data-frage="' + esc(kapitel.id) + '" data-richtig="' + esc(String(f.richtig)) + '">' +
    '<p class="frage">' + esc(f.text) + '</p>' +
    f.antworten.map((a, i) =>
      '<button type="button" class="ks-quiz-antwort' + (schonBestanden && i === f.richtig ? " richtig" : "") + '"' +
      (schonBestanden ? " disabled" : "") + ' data-kap="' + esc(kapitel.id) + '" data-i="' + i + '">' +
      '<span>' + String.fromCharCode(65 + i) + ')</span><span>' + esc(a) + '</span></button>').join("") +
    (schonBestanden ? '<div class="ks-quiz-erklaerung">' + esc(f.erklaerung) + '</div>' : "") +
    '</div>';
}

async function quizAntwort(knopf) {
  const box = knopf.closest(".ks-quiz");
  const richtig = Number(box.dataset.richtig);
  const gewaehlt = Number(knopf.dataset.i);
  const kapId = knopf.dataset.kap;
  const kapitel = feld("schulung", VORGABE_SCHULUNG).find((k) => k.id === kapId);
  if (!kapitel) return;

  box.querySelectorAll(".ks-quiz-antwort").forEach((b) => { b.disabled = true; });
  knopf.classList.add(gewaehlt === richtig ? "richtig" : "falsch");
  if (gewaehlt !== richtig) {
    const r = box.querySelector('[data-i="' + richtig + '"]');
    if (r) r.classList.add("richtig");
  }
  const erk = document.createElement("div");
  erk.className = "ks-quiz-erklaerung";
  erk.textContent = kapitel.frage.erklaerung;
  box.appendChild(erk);

  if (gewaehlt !== richtig) {
    const nochmal = document.createElement("button");
    nochmal.type = "button";
    nochmal.className = "btn small secondary";
    nochmal.style.marginTop = "10px";
    nochmal.textContent = "Noch einmal versuchen";
    nochmal.addEventListener("click", () => schulungZeichnen());
    box.appendChild(nochmal);
    return;
  }

  if (!currentUser) {
    const hinweis = document.createElement("p");
    hinweis.className = "muted";
    hinweis.style.marginTop = "10px";
    hinweis.textContent = "Richtig. Dein Fortschritt wird nicht gespeichert, weil du nicht angemeldet bist.";
    box.appendChild(hinweis);
    return;
  }

  try {
    const antwort = await speichereSchulungsSchritt(kapId, true);
    meinStand = antwort.meinStand || meinStand;
    if (antwort.fertig) toast("Geschafft — die Schulung ist abgeschlossen.", "gut");
    schulungZeichnen();
  } catch (e) {
    toast("Der Fortschritt konnte nicht gespeichert werden: " + e.message, "fehler");
  }
}

async function schulungsListeLaden() {
  try {
    const a = await ladeSchulungsStand();
    schulungsListe = a.personen || [];
    schulungsListeZeichnen();
  } catch (e) {
    schulungsListe = [];
    $("schulung-liste").innerHTML = '<p class="muted">Die Liste konnte nicht geladen werden: ' + esc(e.message) + '</p>';
  }
}

function schulungsListeZeichnen() {
  const box = $("schulung-liste");
  if (!schulungsListe || !schulungsListe.length) {
    box.innerHTML = '<p class="muted">Es sind noch keine Personen erfasst.</p>';
    return;
  }
  const durch = schulungsListe.filter((p) => p.bestandenAm).length;
  const noetig = schulungsListe.filter((p) => p.noetig).length;

  box.innerHTML =
    '<p style="margin-bottom:12px;"><strong>' + durch + ' von ' + noetig + '</strong> der Personen mit Schulungspflicht sind durch.</p>' +
    schulungsListe.slice().sort((a, b) => (b.noetig ? 1 : 0) - (a.noetig ? 1 : 0) || String(a.name).localeCompare(String(b.name), "de"))
      .map((p) =>
        '<div style="display:flex; gap:10px; align-items:center; padding:10px 0; border-bottom:1px solid var(--border); flex-wrap:wrap;">' +
        '<label style="display:flex; gap:8px; align-items:center; flex:1 1 200px; min-width:0; cursor:pointer;">' +
        '<input type="checkbox" data-noetig="' + esc(p.username) + '"' + (p.noetig ? " checked" : "") + ' style="width:20px; height:20px;" />' +
        '<span style="min-width:0; overflow:hidden; text-overflow:ellipsis;">' + esc(p.name || p.username) + '</span></label>' +
        (p.bestandenAm
          ? '<span class="ks-chip gruen">✓ ' + esc(datumDe(p.bestandenAm)) + '</span>'
          : '<span class="ks-chip">' + esc(String(p.kapitelFertig || 0)) + '/' + esc(String(p.kapitelGesamt || 0)) + ' Kapitel</span>') +
        (p.erinnertAm ? '<span class="muted" style="font-size:0.8rem;">erinnert ' + esc(datumDe(p.erinnertAm)) + '</span>' : "") +
        '</div>').join("");

  box.querySelectorAll("[data-noetig]").forEach((c) => {
    c.addEventListener("change", async () => {
      try {
        await setzeSchulungNoetig(c.dataset.noetig, c.checked);
        const p = schulungsListe.find((x) => x.username === c.dataset.noetig);
        if (p) p.noetig = c.checked;
        schulungsListeZeichnen();
      } catch (e) {
        c.checked = !c.checked;
        toast("Konnte nicht gespeichert werden: " + e.message, "fehler");
      }
    });
  });
}

// ---------- Meldungen (nur Beauftragte) ----------

async function meldungenLaden() {
  const box = $("meldungen-liste");
  box.innerHTML = '<p class="muted">Wird geladen …</p>';
  try {
    const a = await ladeMeldungen();
    meldungen = a.meldungen || [];
    meldungenZeichnen();
  } catch (e) {
    meldungen = [];
    box.innerHTML = '<div class="ks-hinweis wichtig">' + esc(e.message) + '</div>';
  }
}

function meldungenZeichnen() {
  const filter = $("meldung-filter").value;
  const e = feld("einstellungen", {});
  const wochen = e.loeschfristWochen || 8;

  let liste = (meldungen || []).slice();
  if (filter === "offen") liste = liste.filter((m) => m.status !== "abgeschlossen");
  else if (filter === "neu") liste = liste.filter((m) => m.status === "neu");
  else if (filter === "abgeschlossen") liste = liste.filter((m) => m.status === "abgeschlossen");
  else if (filter === "loeschbar") liste = liste.filter((m) => loeschReif(m, wochen));
  liste.sort((a, b) => String(b.eingangAm).localeCompare(String(a.eingangAm)));

  $("meldungen-leer").classList.toggle("hidden", liste.length > 0);
  $("meldungen-liste").innerHTML = liste.map((m) => meldungHtml(m, wochen)).join("");

  $("meldungen-liste").querySelectorAll("[data-oeffnen]").forEach((b) => {
    b.addEventListener("click", () => meldungOeffnen(b.dataset.oeffnen));
  });
}

// Wann ist eine Meldung löschreif? Die Frist läuft ab dem Abschluss. Steht sie
// auf "extern", ruht sie — dann ist nie löschreif, egal wie alt.
function loeschReif(m, wochen) {
  if (m.status === "extern") return false;
  const start = m.status === "abgeschlossen" ? m.abgeschlossenAm : m.eingangAm;
  return tageSeit(start) >= wochen * 7;
}

function meldungHtml(m, wochen) {
  const stufe = MELDE_STAENDE.find((s) => s.id === m.status) || MELDE_STAENDE[0];
  const offen = m.status !== "abgeschlossen";
  const wt = werktageSeit(m.eingangAm);
  const frist = feld("einstellungen", {}).rueckmeldeTage || 3;

  let warnung = "";
  if (offen && !m.antwortAm && wt > frist) {
    warnung = '<div class="ks-frist-warnung dringend">⏰ Seit ' + wt + ' Werktagen ohne Rückmeldung. Zugesagt waren ' + frist + '.</div>';
  } else if (offen && !m.antwortAm && wt >= frist) {
    warnung = '<div class="ks-frist-warnung">⏰ Heute läuft die zugesagte Rückmeldefrist ab.</div>';
  }
  if (loeschReif(m, wochen)) {
    warnung += '<div class="ks-frist-warnung">🗑️ Die Aufbewahrungsfrist von ' + wochen + ' Wochen ist abgelaufen. Bitte löschen, wenn nichts dagegenspricht.</div>';
  } else if (m.status === "abgeschlossen") {
    const rest = wochen * 7 - tageSeit(m.abgeschlossenAm);
    if (rest <= 14 && rest > 0) warnung += '<div class="ks-frist-warnung">🗓️ Löschfrist läuft in ' + rest + ' Tagen ab.</div>';
  }

  const auszug = String(m.beschreibung || "").slice(0, 180);
  return '<div class="ks-meldung ' + esc(m.status) + '">' +
    '<div class="ks-meldung-kopf">' +
    '<span class="ks-chip ' + esc(stufe.farbe) + '">' + esc(stufe.label) + '</span>' +
    '<span class="ks-chip">Nr. ' + esc(String(m.nummer)) + '</span>' +
    (m.anonym ? '<span class="ks-chip">anonym</span>' : "") +
    (m.quelle === "nacherfasst" ? '<span class="ks-chip">nacherfasst</span>' : "") +
    ((m.anhaenge || []).length ? '<span class="ks-chip">📎 ' + (m.anhaenge || []).length + '</span>' : "") +
    '<span class="muted" style="font-size:0.82rem; margin-left:auto;">' + esc(datumZeitDe(m.eingangAm)) + '</span>' +
    '</div>' + warnung +
    '<p style="line-height:1.5; color:var(--muted);">' + esc(auszug) + (m.beschreibung.length > 180 ? " …" : "") + '</p>' +
    '<div class="btn-row" style="margin-top:10px;"><button type="button" class="btn small" data-oeffnen="' + esc(m.id) + '">Öffnen</button></div>' +
    '</div>';
}

function meldungOeffnen(id) {
  const m = (meldungen || []).find((x) => x.id === id);
  if (!m) return;
  const stufe = MELDE_STAENDE.find((s) => s.id === m.status) || MELDE_STAENDE[0];

  $("allgemein-titel").textContent = "Meldung Nr. " + m.nummer;
  $("allgemein-body").innerHTML =
    '<div class="ks-meldung-kopf">' +
    '<span class="ks-chip ' + esc(stufe.farbe) + '">' + esc(stufe.label) + '</span>' +
    (m.anonym ? '<span class="ks-chip">anonym gemeldet</span>' : "") +
    '<span class="muted" style="font-size:0.82rem;">Eingang ' + esc(datumZeitDe(m.eingangAm)) + '</span></div>' +

    '<div class="ks-meldung-felder" style="margin-top:12px;">' +
    feldHtml("Wann", m.vorfallDatum ? datumDe(m.vorfallDatum) : "keine Angabe") +
    feldHtml("Wo", m.vorfallOrt || "keine Angabe") +
    feldHtml("Betroffene Person", m.betroffene || "keine Angabe") +
    feldHtml("Weitere Beteiligte", m.beteiligte || "keine Angabe") +
    '</div>' +

    (m.anonym
      ? '<div class="ks-hinweis ruhig">Anonyme Meldung. Es gibt keinen Namen und keinen Kontakt. Eine Antwort erreicht die Person nur über ihre Quittungsnummer.</div>'
      : '<div class="ks-meldung-felder">' +
        feldHtml("Name", m.melderName || "nicht angegeben") +
        feldHtml("Rolle", m.melderRolle || "nicht angegeben") +
        feldHtml("Telefon", m.melderTelefon || "nicht angegeben") +
        feldHtml("E-Mail", m.melderEmail || "nicht angegeben") +
        '</div>') +

    '<h3 style="margin:16px 0 6px; font-size:1rem;">Beschreibung</h3>' +
    '<div class="ks-meldung-text">' + esc(m.beschreibung) + '</div>' +

    ((m.anhaenge || []).length
      ? '<h3 style="margin:16px 0 6px; font-size:1rem;">Anhänge</h3><div id="anhang-liste">' +
        m.anhaenge.map((a) =>
          '<div style="display:flex; gap:8px; align-items:center; background:var(--gray); border-radius:8px; padding:10px; margin-bottom:6px; flex-wrap:wrap;">' +
          '<span style="flex:1 1 160px; min-width:0; overflow:hidden; text-overflow:ellipsis;">📎 ' + esc(a.name || a.id) + '</span>' +
          '<button type="button" class="btn tiny" data-anhang="' + esc(a.id) + '">Ansehen</button></div>').join("") +
        '</div>'
      : "") +

    (m.notizen && m.notizen.length
      ? '<h3 style="margin:16px 0 6px; font-size:1rem;">Interne Notizen</h3>' +
        m.notizen.map((n) => '<div style="background:var(--gold-light); border-radius:8px; padding:10px; margin-bottom:6px; font-size:0.9rem; line-height:1.5;">' +
          '<span class="muted" style="font-size:0.8rem;">' + esc(datumZeitDe(n.am)) + ' · ' + esc(n.von) + '</span><br />' + esc(n.text) + '</div>').join("")
      : "") +

    '<h3 style="margin:18px 0 6px; font-size:1rem;">Stand ändern</h3>' +
    '<div class="btn-row">' +
    MELDE_STAENDE.map((s) =>
      '<button type="button" class="btn small' + (s.id === m.status ? "" : " secondary") + '" data-status="' + esc(s.id) + '">' + esc(s.label) + '</button>').join("") +
    '</div>' +
    '<p class="muted" style="margin-top:6px; font-size:0.84rem; line-height:1.45;">Solange eine externe Stelle eingebunden ist, ruht die Löschfrist. Sie startet erst mit „Abgeschlossen“.</p>' +

    '<h3 style="margin:18px 0 6px; font-size:1rem;">Antwort an die meldende Person</h3>' +
    (m.antwort ? '<div style="background:var(--blue-light); border-radius:8px; padding:10px; margin-bottom:8px; line-height:1.5;">' +
      '<span class="muted" style="font-size:0.8rem;">' + esc(datumZeitDe(m.antwortAm)) + '</span><br />' + esc(m.antwort) + '</div>' : "") +
    '<textarea id="antwort-text" maxlength="2000" style="width:100%; min-height:100px; padding:12px; border:1px solid var(--border); border-radius:10px; font:inherit; font-size:16px;" placeholder="Diese Nachricht sieht die meldende Person über ihre Quittungsnummer."></textarea>' +
    (m.melderEmail ? '<label style="display:flex; gap:8px; align-items:center; margin-top:8px;"><input type="checkbox" id="antwort-mail" checked style="width:18px; height:18px;" /> Zusätzlich per E-Mail schicken</label>' : "") +
    '<div class="btn-row" style="margin-top:8px;">' +
    '<button type="button" class="btn" id="btn-antwort-speichern">Antwort speichern</button>' +
    '<button type="button" class="btn secondary" id="btn-notiz">Interne Notiz</button>' +
    '</div>' +

    '<hr style="border:0; border-top:1px solid var(--border); margin:20px 0;" />' +
    '<div class="ks-hinweis wichtig">Löschen kann nicht rückgängig gemacht werden. Anhänge gehen mit. Denk daran, dass eine Kopie auch in deinem Postfach oder als Ausdruck liegen kann.</div>' +
    '<button type="button" class="btn danger" id="btn-meldung-loeschen">Meldung endgültig löschen</button>';

  $("allgemein-body").querySelectorAll("[data-status]").forEach((b) => {
    b.addEventListener("click", async () => {
      try {
        await setzeMeldungsStand(m.id, b.dataset.status);
        toast("Stand geändert.", "gut");
        await meldungenLaden();
        modalSchliessen();
      } catch (e) { toast(e.message, "fehler"); }
    });
  });

  $("allgemein-body").querySelectorAll("[data-anhang]").forEach((b) => {
    b.addEventListener("click", async () => {
      b.disabled = true;
      b.textContent = "Wird geholt …";
      try {
        const a = await ladeAnhang(m.id, b.dataset.anhang);
        // Data-URL in einem neuen Fenster. Bewusst kein Download-Link: die
        // Datei soll angesehen und nicht unbemerkt weiterverteilt werden.
        const w = window.open();
        if (!w) { toast("Das Fenster wurde blockiert. Bitte Pop-ups erlauben.", "fehler"); return; }
        if (String(a.contentType).indexOf("image/") === 0) {
          w.document.write('<img src="' + a.dataUrl + '" style="max-width:100%;" />');
        } else {
          w.document.write('<iframe src="' + a.dataUrl + '" style="width:100%; height:100vh; border:0;"></iframe>');
        }
      } catch (e) {
        toast(e.message, "fehler");
      } finally {
        b.disabled = false;
        b.textContent = "Ansehen";
      }
    });
  });

  $("btn-antwort-speichern").addEventListener("click", async () => {
    const text = $("antwort-text").value.trim();
    if (!text) { toast("Bitte schreib etwas.", "fehler"); return; }
    const perMail = $("antwort-mail") ? $("antwort-mail").checked : false;
    try {
      await antworteAufMeldung(m.id, text, perMail);
      toast("Antwort gespeichert.", "gut");
      await meldungenLaden();
      modalSchliessen();
    } catch (e) { toast(e.message, "fehler"); }
  });

  $("btn-notiz").addEventListener("click", async () => {
    const text = $("antwort-text").value.trim();
    if (!text) { toast("Schreib die Notiz in das Textfeld darüber.", "fehler"); return; }
    try {
      await notiereAnMeldung(m.id, text);
      toast("Notiz gespeichert. Sie geht nicht an die meldende Person.", "gut");
      await meldungenLaden();
      modalSchliessen();
    } catch (e) { toast(e.message, "fehler"); }
  });

  $("btn-meldung-loeschen").addEventListener("click", async () => {
    if (!confirm("Meldung Nr. " + m.nummer + " endgültig löschen? Das lässt sich nicht rückgängig machen.")) return;
    try {
      await loescheMeldung(m.id);
      toast("Meldung gelöscht.", "gut");
      await meldungenLaden();
      modalSchliessen();
    } catch (e) { toast(e.message, "fehler"); }
  });

  modalOeffnen();
}

function feldHtml(label, wert) {
  return '<div class="ks-meldung-feld"><span class="label">' + esc(label) + '</span>' + esc(wert) + '</div>';
}

// Meldung nacherfassen — für Gespräche, Anrufe und Zettel.
function meldungErfassenOeffnen() {
  $("allgemein-titel").textContent = "Meldung nacherfassen";
  $("allgemein-body").innerHTML =
    '<div class="ks-hinweis ruhig">Für etwas, das dir mündlich, am Telefon oder auf einem Zettel zugetragen wurde. ' +
    'Schreib auch hier nur auf, was gesagt oder beobachtet wurde — keine Deutung.</div>' +
    '<div class="ks-feld"><label for="nf-quelle">Woher kam die Meldung?</label>' +
    '<input type="text" id="nf-quelle" maxlength="200" placeholder="z. B. Gespräch nach dem Training, Anruf einer Mutter" /></div>' +
    '<div class="ks-feld"><label for="nf-name">Name der meldenden Person <span class="muted">(leer lassen = anonym)</span></label>' +
    '<input type="text" id="nf-name" maxlength="120" /></div>' +
    '<div class="ks-feld"><label for="nf-datum">Wann war der Vorfall?</label><input type="date" id="nf-datum" /></div>' +
    '<div class="ks-feld"><label for="nf-ort">Wo?</label><input type="text" id="nf-ort" maxlength="200" /></div>' +
    '<div class="ks-feld"><label for="nf-betroffen">Betroffene Person</label><input type="text" id="nf-betroffen" maxlength="200" /></div>' +
    '<div class="ks-feld"><label for="nf-beteiligte">Weitere Beteiligte</label><input type="text" id="nf-beteiligte" maxlength="300" /></div>' +
    '<div class="ks-feld"><label for="nf-text">Was wurde berichtet?</label>' +
    '<textarea id="nf-text" maxlength="6000" placeholder="Wörtliche Aussagen in Anführungszeichen. Keine Vermutungen."></textarea></div>' +
    '<div class="btn-row"><button type="button" class="btn" id="btn-nf-speichern">Speichern</button>' +
    '<button type="button" class="btn secondary" id="btn-nf-abbrechen">Abbrechen</button></div>';

  $("btn-nf-abbrechen").addEventListener("click", modalSchliessen);
  $("btn-nf-speichern").addEventListener("click", async () => {
    const text = $("nf-text").value.trim();
    if (text.length < 20) { toast("Bitte beschreibe kurz, was berichtet wurde.", "fehler"); return; }
    try {
      await erfasseMeldung({
        quelleText: $("nf-quelle").value.trim(),
        name: $("nf-name").value.trim(),
        vorfallDatum: $("nf-datum").value || "",
        vorfallOrt: $("nf-ort").value.trim(),
        betroffene: $("nf-betroffen").value.trim(),
        beteiligte: $("nf-beteiligte").value.trim(),
        beschreibung: text
      });
      toast("Meldung erfasst.", "gut");
      await meldungenLaden();
      modalSchliessen();
    } catch (e) { toast(e.message, "fehler"); }
  });
  modalOeffnen();
}

function modalOeffnen() { $("allgemein-modal").classList.remove("hidden"); $("allgemein-body").scrollTop = 0; }
function modalSchliessen() { $("allgemein-modal").classList.add("hidden"); $("allgemein-body").innerHTML = ""; }

// ---------- Verwaltung ----------

let verwaltungGezeichnet = false;

async function verwaltungZeichnen() {
  if (verwaltungGezeichnet) return;
  verwaltungGezeichnet = true;
  try { nutzerListe = (await ladeNutzerliste()).users || []; } catch (_) { nutzerListe = []; }

  vPartnerZeichnen();
  vBeauftragteZeichnen();
  vKonzeptZeichnen();
  vWegZeichnen();
  vSchulungZeichnen();
  vFaqZeichnen();
  vExterneZeichnen();
  vKindZeichnen();
  vEinstellungenZeichnen();
  vWerbungZeichnen();

  $("btn-v-partner-neu").addEventListener("click", () => {
    const l = feld("ansprechpartner", []).slice();
    l.push({ id: "p" + Date.now(), rolle: l.length ? "weiterer" : "beauftragte", name: "", funktion: "", telefon: "", email: "", erreichbarkeit: "", aufgabenText: "" });
    daten.ansprechpartner = l;
    vPartnerZeichnen();
  });
  $("btn-v-faq-neu").addEventListener("click", () => {
    const l = feld("faq", VORGABE_FAQ).slice();
    l.push({ id: "f" + Date.now(), frage: "", antwort: "" });
    daten.faq = l;
    vFaqZeichnen();
  });
  $("btn-v-externe-neu").addEventListener("click", () => {
    const l = feld("externe", VORGABE_EXTERNE).slice();
    l.push({ id: "e" + Date.now(), name: "", beschreibung: "", telefon: "", email: "", web: "", notfall: false, sortierung: l.length });
    daten.externe = l;
    vExterneZeichnen();
  });
}

// Ein Eingabefeld für die Verwaltung. Der Wert wird über textContent gesetzt
// und nie in das HTML eingebaut — sonst würde ein Anführungszeichen im Text das
// Attribut sprengen.
function vFeld(label, wert, aendern, opt) {
  const o = opt || {};
  const wrap = document.createElement("div");
  wrap.className = "ks-feld";
  const l = document.createElement("label");
  l.textContent = label;
  wrap.appendChild(l);
  if (o.erklaerung) {
    const p = document.createElement("p");
    p.className = "erklaerung";
    p.textContent = o.erklaerung;
    wrap.appendChild(p);
  }
  const el = document.createElement(o.gross ? "textarea" : "input");
  if (!o.gross) el.type = o.typ || "text";
  if (o.gross) el.style.minHeight = (o.hoehe || 150) + "px";
  el.value = wert == null ? "" : String(wert);
  if (o.platzhalter) el.placeholder = o.platzhalter;
  el.addEventListener("input", () => aendern(el.value));
  wrap.appendChild(el);
  return wrap;
}

function vSpeichernKnopf(teil, holen, danach) {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "btn";
  b.textContent = "Speichern";
  b.addEventListener("click", async () => {
    b.disabled = true;
    b.textContent = "Wird gespeichert …";
    try {
      const antwort = await speichereInhalte(teil, holen());
      if (antwort && antwort.daten) {
        Object.assign(daten, antwort.daten);
        daten.istVorgabe = false;
      }
      toast("Gespeichert.", "gut");
      allesZeichnen();
      if (danach) danach();
    } catch (e) {
      toast("Konnte nicht gespeichert werden: " + e.message, "fehler");
    } finally {
      b.disabled = false;
      b.textContent = "Speichern";
    }
  });
  return b;
}

function vPartnerZeichnen() {
  const box = $("v-partner");
  box.innerHTML = "";
  const liste = feld("ansprechpartner", []);

  liste.forEach((p, i) => {
    const k = document.createElement("div");
    k.style.cssText = "border:1px solid var(--border); border-radius:10px; padding:12px; margin-bottom:12px;";
    const kopf = document.createElement("div");
    kopf.style.cssText = "display:flex; gap:8px; align-items:center; margin-bottom:10px; flex-wrap:wrap;";
    const chip = document.createElement("span");
    chip.className = "ks-chip" + (p.rolle === "beauftragte" ? " blau" : "");
    chip.textContent = p.rolle === "beauftragte" ? "Kinder- und Jugendschutzbeauftragte" : "Weiterer Ansprechpartner";
    kopf.appendChild(chip);

    if (p.rolle !== "beauftragte") {
      const hoch = document.createElement("button");
      hoch.type = "button"; hoch.className = "btn tiny secondary";
      hoch.textContent = "Zur Beauftragten machen";
      hoch.addEventListener("click", () => {
        liste.forEach((x) => { x.rolle = "weiterer"; });
        p.rolle = "beauftragte";
        vPartnerZeichnen();
      });
      kopf.appendChild(hoch);
    }
    const weg = document.createElement("button");
    weg.type = "button"; weg.className = "btn tiny danger";
    weg.textContent = "Entfernen";
    weg.style.marginLeft = "auto";
    weg.addEventListener("click", () => {
      if (!confirm("Diese Person entfernen?")) return;
      daten.ansprechpartner = liste.filter((_, j) => j !== i);
      vPartnerZeichnen();
    });
    kopf.appendChild(weg);
    k.appendChild(kopf);

    k.appendChild(vFeld("Name", p.name, (v) => { p.name = v; }));
    k.appendChild(vFeld("Funktion", p.funktion, (v) => { p.funktion = v; },
      { platzhalter: "z. B. Kinder- und Jugendschutzbeauftragte" }));
    k.appendChild(vFeld("Telefon", p.telefon, (v) => { p.telefon = v; }, { typ: "tel" }));
    k.appendChild(vFeld("E-Mail", p.email, (v) => { p.email = v; }, { typ: "email" }));
    k.appendChild(vFeld("Erreichbarkeit", p.erreichbarkeit, (v) => { p.erreichbarkeit = v; },
      { platzhalter: "z. B. Mo bis Fr ab 17 Uhr, sonst per Mail" }));
    if (p.rolle === "beauftragte") {
      k.appendChild(vFeld("Kurz zu ihren Aufgaben", p.aufgabenText, (v) => { p.aufgabenText = v; },
        { gross: true, hoehe: 90, erklaerung: "Erscheint auf der Startseite unter der wichtigsten Botschaft." }));
    }

    const fotoZeile = document.createElement("div");
    fotoZeile.className = "ks-feld";
    const fl = document.createElement("label");
    fl.textContent = "Foto";
    fotoZeile.appendChild(fl);
    const fi = document.createElement("input");
    fi.type = "file";
    fi.accept = "image/jpeg,image/png,image/webp";
    fi.addEventListener("change", async () => {
      const d = fi.files && fi.files[0];
      if (!d) return;
      try {
        status("Foto wird übertragen …");
        const b64 = await bildVerkleinern(d, 400);
        const a = await speicherePortrait(p.id, "image/jpeg", b64);
        p.bildUrl = a.url;
        status("");
        toast("Foto gespeichert. Nicht vergessen: unten auf Speichern.", "gut");
        vPartnerZeichnen();
      } catch (e) {
        status("");
        toast("Foto konnte nicht übertragen werden: " + e.message, "fehler");
      }
    });
    if (p.bildUrl) {
      const vorschau = document.createElement("img");
      vorschau.src = p.bildUrl;
      vorschau.style.cssText = "width:64px; height:64px; border-radius:50%; object-fit:cover; margin-bottom:8px; display:block;";
      fotoZeile.appendChild(vorschau);
    }
    fotoZeile.appendChild(fi);
    k.appendChild(fotoZeile);

    box.appendChild(k);
  });

  box.appendChild(vSpeichernKnopf("ansprechpartner", () => feld("ansprechpartner", [])));
}

function vBeauftragteZeichnen() {
  const box = $("v-beauftragte");
  box.innerHTML = "";
  if (!canAdmin()) {
    box.innerHTML = '<p class="muted">Diese Liste darf nur ändern, wer Administrieren-Recht für diese App hat.</p>';
    return;
  }
  const gewaehlt = new Set(feld("beauftragteUsernames", []));

  const info = document.createElement("p");
  info.className = "muted";
  info.style.cssText = "line-height:1.55; margin-bottom:12px;";
  info.textContent = "Nur wer hier steht, sieht den Tab Meldungen. Der globale Administrator sieht ihn nicht, solange er nicht hier steht.";
  box.appendChild(info);

  nutzerListe.forEach((u) => {
    const l = document.createElement("label");
    l.style.cssText = "display:flex; gap:10px; align-items:center; padding:9px 0; border-bottom:1px solid var(--border); cursor:pointer;";
    const c = document.createElement("input");
    c.type = "checkbox";
    c.style.cssText = "width:20px; height:20px;";
    c.checked = gewaehlt.has(u.username);
    c.addEventListener("change", () => {
      if (c.checked) gewaehlt.add(u.username); else gewaehlt.delete(u.username);
    });
    const s = document.createElement("span");
    s.textContent = u.name || u.username;
    l.appendChild(c); l.appendChild(s);
    box.appendChild(l);
  });

  const b = document.createElement("button");
  b.type = "button"; b.className = "btn"; b.style.marginTop = "12px";
  b.textContent = "Liste speichern";
  b.addEventListener("click", async () => {
    b.disabled = true;
    try {
      const a = await setzeBeauftragte(Array.from(gewaehlt));
      if (a && a.daten) Object.assign(daten, a.daten);
      toast("Gespeichert. Die Änderung steht jetzt öffentlich im Bereich Meldeweg.", "gut");
      allesZeichnen();
    } catch (e) { toast(e.message, "fehler"); }
    finally { b.disabled = false; }
  });
  box.appendChild(b);
}

function vKonzeptZeichnen() {
  const box = $("v-konzept");
  box.innerHTML = "";
  const kon = feld("konzept", { version: VORGABE_KONZEPT_VERSION, html: VORGABE_KONZEPT_HTML, istEntwurf: true });
  const arbeit = Object.assign({}, kon);

  const hinweis = document.createElement("div");
  hinweis.className = "ks-hinweis wichtig";
  hinweis.innerHTML = "Dieser Text ist zugleich der Wortlaut, den die Trainer in <strong>Trainerdaten</strong> unterschreiben. " +
    "Änderst du ihn inhaltlich, zähl die Fassung hoch — dann müssen alle neu bestätigen. Bei einem Tippfehler lass sie stehen.";
  box.appendChild(hinweis);

  box.appendChild(vFeld("Fassung", arbeit.version, (v) => { arbeit.version = v; },
    { erklaerung: "Zum Beispiel 2.0. Wer welche Fassung bestätigt hat, wird in Trainerdaten mitgeschrieben." }));
  box.appendChild(vFeld("Stand vom", (arbeit.standAm || "").slice(0, 10), (v) => { arbeit.standAm = v; }, { typ: "date" }));

  const eL = document.createElement("label");
  eL.style.cssText = "display:flex; gap:10px; align-items:center; margin-bottom:14px; cursor:pointer;";
  const eC = document.createElement("input");
  eC.type = "checkbox"; eC.style.cssText = "width:20px; height:20px;";
  eC.checked = arbeit.istEntwurf !== false;
  eC.addEventListener("change", () => { arbeit.istEntwurf = eC.checked; });
  const eS = document.createElement("span");
  eS.textContent = "Noch Entwurf — Hinweis in der App anzeigen";
  eL.appendChild(eC); eL.appendChild(eS);
  box.appendChild(eL);

  box.appendChild(vFeld("Wortlaut (HTML)", arbeit.html, (v) => { arbeit.html = v; },
    { gross: true, hoehe: 400, erklaerung: "Überschriften mit h3, Absätze mit p, Listen mit ul und li." }));

  const zurueck = document.createElement("button");
  zurueck.type = "button"; zurueck.className = "btn secondary"; zurueck.style.marginRight = "8px";
  zurueck.textContent = "Entwurfsfassung wieder einspielen";
  zurueck.addEventListener("click", () => {
    if (!confirm("Den aktuellen Wortlaut durch die Entwurfsfassung ersetzen?")) return;
    arbeit.html = VORGABE_KONZEPT_HTML;
    arbeit.version = VORGABE_KONZEPT_VERSION;
    vKonzeptZeichnen();
  });
  box.appendChild(zurueck);
  box.appendChild(vSpeichernKnopf("konzept", () => arbeit));

  // Die Zusammenfassungs-Kacheln.
  const trenner = document.createElement("h3");
  trenner.style.cssText = "margin:24px 0 10px; font-size:1rem;";
  trenner.textContent = "Kacheln „Das Wichtigste in Kürze“";
  box.appendChild(trenner);

  const zus = feld("zusammenfassung", VORGABE_ZUSAMMENFASSUNG).slice();
  zus.forEach((z, i) => {
    const k = document.createElement("div");
    k.style.cssText = "border:1px solid var(--border); border-radius:10px; padding:10px; margin-bottom:10px;";
    k.appendChild(vFeld("Zeichen", z.icon, (v) => { z.icon = v; }));
    k.appendChild(vFeld("Überschrift", z.titel, (v) => { z.titel = v; }));
    k.appendChild(vFeld("Text", z.text, (v) => { z.text = v; }, { gross: true, hoehe: 70 }));
    const w = document.createElement("button");
    w.type = "button"; w.className = "btn tiny danger";
    w.textContent = "Kachel entfernen";
    w.addEventListener("click", () => { daten.zusammenfassung = zus.filter((_, j) => j !== i); vKonzeptZeichnen(); });
    k.appendChild(w);
    box.appendChild(k);
  });
  const neu = document.createElement("button");
  neu.type = "button"; neu.className = "btn small secondary"; neu.style.marginRight = "8px";
  neu.textContent = "+ Kachel";
  neu.addEventListener("click", () => { zus.push({ id: "z" + Date.now(), icon: "•", titel: "", text: "" }); daten.zusammenfassung = zus; vKonzeptZeichnen(); });
  box.appendChild(neu);
  box.appendChild(vSpeichernKnopf("zusammenfassung", () => zus));
}

function vWegZeichnen() {
  const box = $("v-weg");
  box.innerHTML = "";
  const weg = feld("meldeweg", VORGABE_MELDEWEG).slice();
  weg.forEach((s) => {
    const k = document.createElement("div");
    k.style.cssText = "border:1px solid var(--border); border-radius:10px; padding:10px; margin-bottom:10px;";
    k.appendChild(vFeld("Schritt " + s.nr + " — Überschrift", s.titel, (v) => { s.titel = v; }));
    k.appendChild(vFeld("Text", s.text, (v) => { s.text = v; }, { gross: true, hoehe: 80 }));
    box.appendChild(k);
  });
  box.appendChild(vSpeichernKnopf("meldeweg", () => weg));

  const t = document.createElement("h3");
  t.style.cssText = "margin:24px 0 10px; font-size:1rem;";
  t.textContent = "Was die Beauftragte tut — und was nicht";
  box.appendChild(t);

  const rolle = JSON.parse(JSON.stringify(feld("rolle", VORGABE_ROLLE)));
  box.appendChild(vFeld("Das tut sie (eine Zeile je Punkt)", (rolle.macht || []).join("\n"),
    (v) => { rolle.macht = v.split("\n").map((x) => x.trim()).filter(Boolean); }, { gross: true, hoehe: 180 }));
  box.appendChild(vFeld("Das tut sie nicht (eine Zeile je Punkt)", (rolle.machtNicht || []).join("\n"),
    (v) => { rolle.machtNicht = v.split("\n").map((x) => x.trim()).filter(Boolean); }, { gross: true, hoehe: 120 }));
  box.appendChild(vSpeichernKnopf("rolle", () => rolle));
}

function vSchulungZeichnen() {
  const box = $("v-schulung");
  box.innerHTML = "";
  const kapitel = JSON.parse(JSON.stringify(feld("schulung", VORGABE_SCHULUNG)));

  const warn = document.createElement("div");
  warn.className = "ks-hinweis";
  warn.textContent = "Wenn du ein Kapitel entfernst, verlieren alle, die es schon geschafft haben, diesen Haken. Ein neues Kapitel setzt einen bereits erteilten Abschluss zurück.";
  box.appendChild(warn);

  kapitel.forEach((k, i) => {
    const d = document.createElement("details");
    d.style.cssText = "border:1px solid var(--border); border-radius:10px; padding:10px; margin-bottom:10px;";
    const s = document.createElement("summary");
    s.style.cssText = "cursor:pointer; font-weight:600; padding:4px 0;";
    s.textContent = (i + 1) + ". " + (k.titel || "ohne Titel");
    d.appendChild(s);

    d.appendChild(vFeld("Überschrift", k.titel, (v) => { k.titel = v; }));
    d.appendChild(vFeld("Dauer", k.dauer, (v) => { k.dauer = v; }, { platzhalter: "z. B. 3 Min." }));
    d.appendChild(vFeld("Inhalt (HTML)", k.html, (v) => { k.html = v; }, { gross: true, hoehe: 220 }));

    if (!k.frage) k.frage = { id: k.id + "f", text: "", antworten: ["", "", ""], richtig: 0, erklaerung: "" };
    d.appendChild(vFeld("Quizfrage", k.frage.text, (v) => { k.frage.text = v; }));
    d.appendChild(vFeld("Antworten (eine Zeile je Antwort)", (k.frage.antworten || []).join("\n"),
      (v) => { k.frage.antworten = v.split("\n").map((x) => x.trim()).filter(Boolean); }, { gross: true, hoehe: 100 }));
    d.appendChild(vFeld("Nummer der richtigen Antwort (1, 2, 3 …)", String((k.frage.richtig || 0) + 1),
      (v) => { k.frage.richtig = Math.max(0, (parseInt(v, 10) || 1) - 1); }));
    d.appendChild(vFeld("Erklärung nach der Antwort", k.frage.erklaerung, (v) => { k.frage.erklaerung = v; }, { gross: true, hoehe: 90 }));

    const w = document.createElement("button");
    w.type = "button"; w.className = "btn tiny danger";
    w.textContent = "Kapitel entfernen";
    w.addEventListener("click", () => {
      if (!confirm("Kapitel entfernen? Wer es schon geschafft hat, verliert den Haken.")) return;
      daten.schulung = kapitel.filter((_, j) => j !== i);
      vSchulungZeichnen();
    });
    d.appendChild(w);
    box.appendChild(d);
  });

  const neu = document.createElement("button");
  neu.type = "button"; neu.className = "btn small secondary"; neu.style.marginRight = "8px";
  neu.textContent = "+ Kapitel";
  neu.addEventListener("click", () => {
    kapitel.push({ id: "k" + Date.now(), titel: "Neues Kapitel", dauer: "3 Min.", html: "<p></p>",
      frage: { id: "k" + Date.now() + "f", text: "", antworten: ["", ""], richtig: 0, erklaerung: "" } });
    daten.schulung = kapitel;
    vSchulungZeichnen();
  });
  box.appendChild(neu);
  box.appendChild(vSpeichernKnopf("schulung", () => kapitel));
}

function vFaqZeichnen() {
  const box = $("v-faq");
  box.innerHTML = "";
  const faq = feld("faq", VORGABE_FAQ).slice();
  faq.forEach((f, i) => {
    const k = document.createElement("div");
    k.style.cssText = "border:1px solid var(--border); border-radius:10px; padding:10px; margin-bottom:10px;";
    k.appendChild(vFeld("Frage", f.frage, (v) => { f.frage = v; }));
    k.appendChild(vFeld("Antwort", f.antwort, (v) => { f.antwort = v; }, { gross: true, hoehe: 100 }));
    const w = document.createElement("button");
    w.type = "button"; w.className = "btn tiny danger";
    w.textContent = "Entfernen";
    w.addEventListener("click", () => { daten.faq = faq.filter((_, j) => j !== i); vFaqZeichnen(); });
    k.appendChild(w);
    box.appendChild(k);
  });
  box.appendChild(vSpeichernKnopf("faq", () => faq));
}

function vExterneZeichnen() {
  const box = $("v-externe");
  box.innerHTML = "";
  const liste = feld("externe", VORGABE_EXTERNE).slice();
  liste.forEach((s, i) => {
    const k = document.createElement("div");
    k.style.cssText = "border:1px solid var(--border); border-radius:10px; padding:10px; margin-bottom:10px;";
    k.appendChild(vFeld("Name", s.name, (v) => { s.name = v; }));
    k.appendChild(vFeld("Beschreibung", s.beschreibung, (v) => { s.beschreibung = v; }, { gross: true, hoehe: 80 }));
    k.appendChild(vFeld("Telefon", s.telefon, (v) => { s.telefon = v; }, { typ: "tel" }));
    k.appendChild(vFeld("E-Mail", s.email, (v) => { s.email = v; }, { typ: "email" }));
    k.appendChild(vFeld("Webseite", s.web, (v) => { s.web = v; }, { platzhalter: "https://…" }));

    const nl = document.createElement("label");
    nl.style.cssText = "display:flex; gap:10px; align-items:center; margin-bottom:10px; cursor:pointer;";
    const nc = document.createElement("input");
    nc.type = "checkbox"; nc.style.cssText = "width:20px; height:20px;";
    nc.checked = !!s.notfall;
    nc.addEventListener("change", () => { s.notfall = nc.checked; });
    const ns = document.createElement("span");
    ns.textContent = "Notfall — steht ganz oben und ist rot umrandet";
    nl.appendChild(nc); nl.appendChild(ns);
    k.appendChild(nl);

    const w = document.createElement("button");
    w.type = "button"; w.className = "btn tiny danger";
    w.textContent = "Entfernen";
    w.addEventListener("click", () => { daten.externe = liste.filter((_, j) => j !== i); vExterneZeichnen(); });
    k.appendChild(w);
    box.appendChild(k);
  });
  box.appendChild(vSpeichernKnopf("externe", () => liste));
}

function vKindZeichnen() {
  const box = $("v-kind");
  box.innerHTML = "";
  const kt = JSON.parse(JSON.stringify(feld("kindertext", VORGABE_KINDERTEXT)));
  box.appendChild(vFeld("Begrüßung", kt.begruessung, (v) => { kt.begruessung = v; }));
  (kt.bloecke || []).forEach((b, i) => {
    const k = document.createElement("div");
    k.style.cssText = "border:1px solid var(--border); border-radius:10px; padding:10px; margin-bottom:10px;";
    k.appendChild(vFeld("Zeichen", b.icon, (v) => { b.icon = v; }));
    k.appendChild(vFeld("Überschrift", b.titel, (v) => { b.titel = v; }));
    k.appendChild(vFeld("Text", b.text, (v) => { b.text = v; }, { gross: true, hoehe: 90,
      erklaerung: "Kurze Sätze, keine Fremdwörter. Ein Kind soll es beim ersten Lesen verstehen." }));
    const w = document.createElement("button");
    w.type = "button"; w.className = "btn tiny danger";
    w.textContent = "Entfernen";
    w.addEventListener("click", () => { kt.bloecke.splice(i, 1); daten.kindertext = kt; vKindZeichnen(); });
    k.appendChild(w);
    box.appendChild(k);
  });
  const neu = document.createElement("button");
  neu.type = "button"; neu.className = "btn small secondary"; neu.style.marginRight = "8px";
  neu.textContent = "+ Block";
  neu.addEventListener("click", () => { kt.bloecke.push({ id: "kt" + Date.now(), icon: "•", titel: "", text: "" }); daten.kindertext = kt; vKindZeichnen(); });
  box.appendChild(neu);
  box.appendChild(vSpeichernKnopf("kindertext", () => kt));
}

function vEinstellungenZeichnen() {
  const box = $("v-einstellungen");
  box.innerHTML = "";
  const e = Object.assign({}, feld("einstellungen", {}));

  const schalter = (label, schluessel, erklaerung) => {
    const l = document.createElement("label");
    l.style.cssText = "display:flex; gap:10px; align-items:flex-start; margin-bottom:14px; cursor:pointer;";
    const c = document.createElement("input");
    c.type = "checkbox"; c.style.cssText = "width:20px; height:20px; margin-top:2px; flex:0 0 auto;";
    c.checked = e[schluessel] !== false;
    c.addEventListener("change", () => { e[schluessel] = c.checked; });
    const s = document.createElement("span");
    s.innerHTML = "<strong>" + esc(label) + "</strong><br /><span style='color:var(--muted); font-size:0.86rem;'>" + esc(erklaerung) + "</span>";
    l.appendChild(c); l.appendChild(s);
    return l;
  };

  box.appendChild(schalter("Meldeformular ist offen", "meldungenOffen",
    "Ausschalten schließt das Formular. Die Notrufnummern und die Kontaktdaten bleiben sichtbar. Nur für den Notfall gedacht."));
  box.appendChild(schalter("Anonyme Meldungen erlauben", "anonymErlaubt",
    "Ausschalten heißt: jede Meldung braucht einen Namen. Erfahrungsgemäß melden dann die ängstlichen Fälle gar nicht."));
  box.appendChild(schalter("Dateianhänge erlauben", "anhaengeErlaubt",
    "Bild und PDF, höchstens drei je Meldung."));

  box.appendChild(vFeld("Zugesagte Rückmeldung in Werktagen", e.rueckmeldeTage || 3,
    (v) => { e.rueckmeldeTage = Math.max(1, parseInt(v, 10) || 3); },
    { erklaerung: "Steht so im Formular. Nach Ablauf mahnt die App in der Meldungsliste." }));
  box.appendChild(vFeld("Aufbewahrung in Wochen nach Abschluss", e.loeschfristWochen || 8,
    (v) => { e.loeschfristWochen = Math.max(1, parseInt(v, 10) || 8); },
    { erklaerung: "Die App erinnert ans Löschen, löscht aber nie von allein. Solange eine externe Stelle eingebunden ist, ruht die Frist." }));
  box.appendChild(vFeld("Datenschutz-Information (HTML)", e.datenschutzHtml || VORGABE_DATENSCHUTZ,
    (v) => { e.datenschutzHtml = v; }, { gross: true, hoehe: 320,
    erklaerung: "Steht im Tab Info. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f und Art. 9 Abs. 2 lit. f DSGVO — bitte NICHT auf eine Einwilligung umstellen." }));

  box.appendChild(vSpeichernKnopf("einstellungen", () => e));
}

// Werbematerial: der Text für die Vereinsseite und ein Aushang zum Ausdrucken.
function vWerbungZeichnen() {
  const box = $("v-werbung");
  const p = beauftragtePerson();
  const url = "https://sc1911heiligenstadt.github.io/kinderschutz/";

  box.innerHTML =
    '<p style="line-height:1.6; margin-bottom:12px;">Die Adresse dieser App:</p>' +
    '<code style="display:block; background:var(--gray); padding:12px; border-radius:8px; word-break:break-all; margin-bottom:14px;">' + esc(url) + '</code>' +
    '<div class="btn-row"><button type="button" class="btn secondary" id="btn-aushang">Aushang zum Ausdrucken öffnen</button></div>' +
    '<h3 style="margin:20px 0 8px; font-size:1rem;">Text für die Vereinsseite</h3>' +
    '<textarea readonly style="width:100%; min-height:200px; padding:12px; border:1px solid var(--border); border-radius:10px; font:inherit; font-size:14px;">' +
    esc("Kinder- und Jugendschutz\n\n" +
      "Beim 1. SC 1911 Heiligenstadt e.V. soll sich jedes Kind sicher fühlen. " +
      "Wenn du eine Frage hast, dir Sorgen um ein Kind machst oder etwas melden möchtest, " +
      "wende dich an unsere Kinder- und Jugendschutzbeauftragte" + (p && p.name ? " " + p.name : "") + ".\n\n" +
      "Alle Informationen, der Meldeweg und ein Meldeformular stehen hier:\n" + url + "\n\n" +
      "Bei akuter Gefahr: 110.\n" +
      "Nummer gegen Kummer für Kinder und Jugendliche: 116 111 (kostenlos und anonym).") +
    '</textarea>';

  const b = $("btn-aushang");
  if (b) b.addEventListener("click", () => aushangOeffnen(url, p));
}

function aushangOeffnen(url, p) {
  const w = window.open("", "_blank");
  if (!w) { toast("Das Fenster wurde blockiert. Bitte Pop-ups erlauben.", "fehler"); return; }
  // Der QR-Code wird bewusst NICHT von einem fremden Dienst geholt — die
  // Adresse steht groß daneben und lässt sich abtippen. Ein Aushang, der von
  // einem Bilddienst abhängt, ist beim Drucken im Verein regelmäßig leer.
  w.document.write(
    '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8" /><title>Aushang Kinderschutz</title>' +
    '<style>body{font-family:Segoe UI,system-ui,sans-serif;padding:40px;text-align:center;color:#1e2330;}' +
    'h1{font-size:34px;margin-bottom:6px;color:#1a56a0;}h2{font-size:22px;margin:24px 0 10px;}' +
    'p{font-size:17px;line-height:1.6;max-width:640px;margin:0 auto 14px;}' +
    '.adr{font-size:19px;font-weight:700;background:#e8f0fb;padding:14px;border-radius:10px;display:inline-block;margin:14px 0;word-break:break-all;}' +
    '.not{border:3px solid #c0392b;border-radius:12px;padding:16px;margin:26px auto;max-width:640px;}' +
    '.not strong{color:#c0392b;font-size:20px;}</style></head><body>' +
    '<h1>Kinder- und Jugendschutz</h1>' +
    '<p>1. SC 1911 Heiligenstadt e.V.</p>' +
    '<h2>Du hast eine Frage oder ein ungutes Gefühl?</h2>' +
    '<p>Dann sprich uns an. Du bekommst dafür keinen Ärger, und du musst nichts beweisen.</p>' +
    (p && p.name ? '<p><strong>' + esc(p.name) + '</strong><br />Kinder- und Jugendschutzbeauftragte' +
      (p.telefon ? '<br />Telefon ' + esc(p.telefon) : "") + (p.email ? '<br />' + esc(p.email) : "") + '</p>' : "") +
    '<h2>Alles zum Nachlesen und zum Melden</h2>' +
    '<div class="adr">' + esc(url) + '</div>' +
    '<div class="not"><strong>Bist du gerade in Gefahr? Ruf 110 an.</strong>' +
    '<p style="margin-top:8px;">Lieber mit jemand Fremdem reden?<br />Nummer gegen Kummer: <strong>116 111</strong> — kostenlos und anonym.</p></div>' +
    '</body></html>');
  w.document.close();
  w.print();
}

// Bild auf eine sinnvolle Kantenlänge bringen, bevor es hochgeladen wird.
// Ein 12-Megapixel-Handyfoto als Portrait wäre reine Verschwendung und würde am
// Größenlimit des Workers scheitern.
function bildVerkleinern(datei, maxKante) {
  return new Promise((ok, fehler) => {
    const leser = new FileReader();
    leser.onload = () => {
      const bild = new Image();
      bild.onload = () => {
        const skala = Math.min(1, maxKante / Math.max(bild.width, bild.height));
        const c = document.createElement("canvas");
        c.width = Math.round(bild.width * skala);
        c.height = Math.round(bild.height * skala);
        c.getContext("2d").drawImage(bild, 0, 0, c.width, c.height);
        ok(c.toDataURL("image/jpeg", 0.85).split(",")[1] || "");
      };
      bild.onerror = () => fehler(new Error("Das Bild konnte nicht gelesen werden"));
      bild.src = String(leser.result);
    };
    leser.onerror = () => fehler(new Error("Die Datei konnte nicht gelesen werden"));
    leser.readAsDataURL(datei);
  });
}

// ---------- Reste verdrahten ----------

document.addEventListener("DOMContentLoaded", () => {
  $("allgemein-schliessen").addEventListener("click", modalSchliessen);
  $("allgemein-modal").addEventListener("click", (e) => { if (e.target === $("allgemein-modal")) modalSchliessen(); });
  $("meldung-filter").addEventListener("change", meldungenZeichnen);
  $("btn-meldungen-neu-laden").addEventListener("click", meldungenLaden);
  $("btn-meldung-erfassen").addEventListener("click", meldungErfassenOeffnen);
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!$("allgemein-modal").classList.contains("hidden")) modalSchliessen();
  });
});
