// Konstanten und Änderungsprotokoll der Kinderschutz-App.
//
// ⚠️ APP_VERSION bleibt "1.0". Neue Funktionen bekommen einen neuen
// APP_CHANGELOG-Block darüber — die Nummer selbst wird nicht hochgezählt.
const APP_VERSION = "1.0";

// Die Notrufnummern. Stehen bewusst HIER im Code und nicht in der pflegbaren
// Liste der externen Stellen: sie sind der letzte Weg, wenn die Datei aus
// Nextcloud gar nicht kommt. Ein Kasten mit der 110 darf nie an einem
// Netzwerkfehler scheitern.
const NOTFALL_FEST = [
  { name: "Polizei / Notruf", nummer: "110", hinweis: "Bei akuter Gefahr. Rund um die Uhr." },
  { name: "Nummer gegen Kummer (für Kinder und Jugendliche)", nummer: "116111", hinweis: "Kostenlos und anonym. Mo–Sa 14–20 Uhr." },
  { name: "Hilfetelefon Sexueller Missbrauch", nummer: "0800 22 55 530", hinweis: "Kostenlos und anonym. Für Betroffene und alle, die sich Sorgen machen." },
  { name: "Elterntelefon", nummer: "0800 111 0 550", hinweis: "Kostenlos und anonym. Für Eltern, die nicht weiterwissen." }
];

// Wie lang eine Quittungsnummer aussieht: KS-XXXX-XXXX. Der Server erzeugt sie,
// hier steht nur die Form für die Eingabemaske.
const CODE_MUSTER = /^KS-[0-9A-HJ-NP-Z]{4}-[0-9A-HJ-NP-Z]{4}$/;

// Anhänge: was der Client vorprüft. Der Server prüft NOCH EINMAL, und zwar an
// den ersten Bytes der Datei statt an dieser Liste — eine Client-Angabe ist eine
// Behauptung, kein Nachweis.
const ANHANG_TYPEN = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const ANHANG_MAX_BYTES = 8 * 1024 * 1024;
const ANHANG_MAX_ANZAHL = 3;

// Die vier Stände einer Meldung. "extern" hält die Löschfrist an, solange etwas
// bei einer Behörde oder Fachstelle läuft; "abgeschlossen" startet sie.
// Es gibt bewusst KEIN "unbegründet" und KEIN "abgelehnt" — die App bewertet
// nicht, ob ein Verdacht zutrifft. Das ist Sache der Fachstellen.
const MELDE_STAENDE = [
  { id: "neu", label: "Neu", farbe: "rot", beschreibung: "Eingegangen, noch nicht angesehen." },
  { id: "bearbeitung", label: "In Bearbeitung", farbe: "gelb", beschreibung: "Die Beauftragte kümmert sich darum." },
  { id: "extern", label: "An externe Stelle gegeben", farbe: "blau", beschreibung: "Beratungsstelle, Jugendamt oder Behörde ist eingebunden. Die Löschfrist ruht." },
  { id: "abgeschlossen", label: "Abgeschlossen", farbe: "gruen", beschreibung: "Die Bearbeitung ist beendet. Ab hier läuft die Löschfrist." }
];

const APP_CHANGELOG = [
  {
    version: "1.0",
    groups: [
      {
        title: "Die Anlaufstelle für Kinder- und Jugendschutz",
        items: [
          "Eine eigene Anlaufstelle für den Kinder- und Jugendschutz im Verein. Ansprechpartner, Meldeweg, Konzept, Schulung, Fragen und Hilfsangebote an einem Ort.",
          "Der Info- und Meldeteil ist ohne Anmeldung erreichbar. Kinder, Jugendliche und Eltern haben keinen Vereins-Login — sie kämen sonst gar nicht hin.",
          "Ganz oben auf der Startseite steht die Kinder- und Jugendschutzbeauftragte mit Foto, Erreichbarkeit und je einem Knopf zum Anrufen und Mailschreiben. Darunter stehen weitere Ansprechpartner im Verein.",
          "Der Notfallkasten mit der 110, der Nummer gegen Kummer, dem Hilfetelefon Sexueller Missbrauch und dem Elterntelefon steht fest im Programm — er erscheint auch dann, wenn die App ihre Inhalte gerade nicht laden kann.",
          "Unter „Hilfe“ stehen Beratungsstellen, Jugendamt und weitere Anlaufstellen von außen."
        ]
      },
      {
        title: "Verdacht oder Vorfall melden",
        items: [
          "Ein großer Knopf auf jeder Seite. Davor steht in einfachen Worten, was passiert und was nicht passiert.",
          "Melden geht anonym — Name und Kontakt sind freiwillig. Wer angemeldet ist und trotzdem anonym meldet, wird auch anonym gespeichert. Die App hängt keinen Namen heimlich dran.",
          "Nach dem Absenden erscheint eine Quittungsnummer. Über „Schon gemeldet?“ auf der Startseite lässt sich damit jederzeit nachschauen, was aus der Meldung wurde — ohne sich zu erkennen zu geben. Angezeigt werden Eingangsdatum, Stand und die Antwort der Beauftragten, nie der eigene Meldetext.",
          "Bilder und PDF-Dateien können angehängt werden, höchstens drei. Der Dateityp wird am Inhalt geprüft, nicht am Namen.",
          "Zugesagt sind drei Werktage bis zur Rückmeldung. Bleibt eine Meldung länger liegen, mahnt die App die Beauftragte.",
          "Am Handy schwebt ein Melde-Knopf am unteren Rand mit, sobald der große Knopf nicht im Bild ist. Er wartet aber, bis der Notfallkasten durchgescrollt ist — eine Nummer, die im Notfall gewählt wird, hat Vorrang. Zwei gleiche Knöpfe stehen nie gleichzeitig da, und solange das Meldeformular offen ist, ist der schwebende Knopf weg."
        ]
      },
      {
        title: "Was mit den Angaben passiert",
        items: [
          "Direkt über dem Absende-Knopf steht, wozu die Angaben verarbeitet werden, wer verantwortlich ist — mit Anschrift und Telefonnummer —, wie lange gespeichert wird und wo man sich beschweren kann. Der vollständige Datenschutz-Text lässt sich dort aufklappen, ohne dass die schon getippte Meldung verloren geht.",
          "Der Text sagt außerdem ehrlich, was „anonym“ nicht leisten kann: Die Meldung läuft wie jeder Seitenaufruf über die Adresse des eigenen Anschlusses. Wir speichern sie nicht bei der Meldung, aber ganz spurlos ist es nicht. Wer das nicht will, findet dort den Hinweis auf die Nummer gegen Kummer.",
          "Eine Meldung wird aufbewahrt, solange sie gebraucht wird, längstens acht Wochen nach Abschluss. Gelöscht wird von Hand, nicht automatisch — und der Stand „An externe Stelle gegeben“ hält die Frist an, solange bei einer Behörde oder Fachstelle etwas läuft.",
          "Ein eigener Abschnitt behandelt Schulung und Bestätigung des Schutzkonzepts: was gespeichert wird (Name, Zeitpunkt, Fassungsnummer, Unterschriftsbild), wozu, auf welcher Grundlage, wo es liegt und wie lange. Die acht Wochen gelten nur für Meldungen — eine Bestätigung bleibt, solange man für den Verein tätig ist. Das betrifft nur Trainerinnen, Trainer und Betreuende mit Vereinskonto.",
          "Eine angehängte Datei, deren Formular nie abgeschickt wurde, verschwindet nach zwei Tagen von allein — aber nur, wenn keine Meldung und kein Foto darauf verweist. An echten Meldungen ändert das nichts."
        ]
      },
      {
        title: "Wer die Meldungen lesen darf",
        items: [
          "Nur die eingetragenen Beauftragten. Der globale Administrator der Tools greift hier ausdrücklich NICHT durch.",
          "Wer in der Liste steht, ist in der App für jeden sichtbar — auch für nicht angemeldete Besucher. Jede Änderung an der Liste wird protokolliert und mit Klarnamen angezeigt. Niemand kann sich still eintragen.",
          "Nachricht aufs Handy und E-Mail sagen nur, dass eine Meldung da ist. Kein Name, kein Ort, kein Inhalt — auch nicht im Betreff. Nur die Antwort an den Melder trägt den Antworttext, damit er sie ohne Anmeldung lesen kann."
        ]
      },
      {
        title: "Die Bearbeitung einer Meldung",
        items: [
          "Jede Meldung hat einen von vier Ständen: neu, in Bearbeitung, an externe Stelle gegeben, abgeschlossen. Es gibt bewusst kein „unbegründet“ und kein „abgelehnt“ — die App bewertet nicht, ob ein Verdacht zutrifft. Das ist Sache der Fachstellen.",
          "Die Liste lässt sich nach offenen, neuen, abgeschlossenen und nach abgelaufener Löschfrist filtern.",
          "Was am Telefon, im Gespräch oder auf einem Zettel ankommt, lässt sich über „Meldung nacherfassen“ eintragen, damit alles an einem Ort steht. Nacherfasste Meldungen sind in der Liste als solche gekennzeichnet.",
          "Ein deutlicher Hinweis steht über der Liste: Was hier steht, gehört nicht in eine Mannschaftsgruppe, nicht in den Trainerkreis und nicht in ein Gespräch am Spielfeldrand."
        ]
      },
      {
        title: "Schutzkonzept und Bestätigung",
        items: [
          "Das Kinder- und Jugendschutzkonzept steht im Wortlaut in der App, dazu eine Zusammenfassung in Kacheln. Über einen Knopf lässt es sich ausdrucken oder als PDF speichern.",
          "Bestätigt wird das Konzept ebenfalls hier, am Ende der Schulung: mit dem vollen Wortlaut zum Nachlesen und einem Feld für die Unterschrift. Erst die Schulung, dann die Unterschrift — der Abschnitt schaltet sich frei, sobald alle sechs Kapitel geschafft sind; vorher steht dort, wie viele noch fehlen.",
          "Gespeichert wird die Bestätigung in der Trainerakte, dort wo auch Vertrag und Verhaltenskodex liegen. In den Trainerdaten steht nur noch, ob und wann bestätigt wurde, mit einem Knopf hierher.",
          "Den Abschnitt sieht nur, wer im Verein einen Trainervertrag hat. Für Spieler, Eltern und alle anderen Angemeldeten bleibt er weg — das prüft der Server, nicht die Anzeige."
        ]
      },
      {
        title: "Schulung mit Nachweis",
        items: [
          "Sechs kurze Kapitel mit je einer Quizfrage am Ende. Lesen darf jeder, auch ohne Anmeldung.",
          "Wer angemeldet ist, sammelt Fortschritt und bekommt am Ende ein Abzeichen mit Datum.",
          "Die Beauftragte sieht, wer durch ist. Sie kann je Person „Schulung nötig“ setzen; wer nach vier Wochen nicht durch ist, bekommt eine freundliche Erinnerung.",
          "In der Nachweisliste stehen nur die Konten, die eine Übungsleiter-Schulung betrifft — Spielerinnen und Spieler nicht. Wer bereits einen Schulungsstand hat, bleibt in jedem Fall in der Liste: ein erteilter Nachweis verschwindet nicht."
        ]
      },
      {
        title: "Für Kinder und Jugendliche",
        items: [
          "Oben ein Umschalter auf eine eigene Fassung in einfacher Sprache: große Schrift, kurze Sätze, keine Fremdwörter.",
          "Eigener Meldeknopf — er heißt dort „Ich möchte etwas erzählen“ — und die Nummer gegen Kummer immer im Blick."
        ]
      },
      {
        title: "Alles pflegbar ohne Programmierung",
        items: [
          "Ansprechpartner, Konzepttext, Schulungskapitel, Quizfragen, Fragen und Antworten, externe Stellen und die Texte des Meldewegs stehen im Verwaltungsbereich. Nach dem Speichern ist eine Änderung sofort für alle sichtbar.",
          "Solange nichts gespeichert wurde, zeigt die App die Entwurfsfassung — mit einem deutlichen Hinweis, dass sie noch nicht vom Verein freigegeben ist.",
          "Für die Vereinsseite und den Aushang gibt es fertiges Werbematerial samt einer Druckseite mit der Adresse der App.",
          "Die frei geschriebenen Texte — der Wortlaut des Schutzkonzepts und der Datenschutztext — dürfen Überschriften, Absätze, Aufzählungen, Fettschrift und Links enthalten. Alles andere wird entfernt, bevor der Text angezeigt wird; Links führen nur zu Internetseiten, E-Mail-Adressen und Telefonnummern. Wer die Texte pflegt, kann damit nichts einbauen, was im Browser eines Besuchers etwas ausführt."
        ]
      },
      {
        title: "Bedienung am Handy",
        items: [
          "Die Ansicht ist für das Handy gebaut und funktioniert dort hochkant wie quer.",
          "Alle Bedienelemente im Meldeformular sind mindestens 44 Pixel groß — auch das Feld „Dateien anhängen“ und das × zum Schließen eines Dialogs. Ein Tipp irgendwo auf das Dateifeld öffnet die Auswahl.",
          "Auf einem quer gehaltenen Handy ist der Bildschirm nur 375 Pixel hoch. Vom Meldeformular sind davon 290 Pixel sichtbar, ohne dass etwas aus dem Bild fällt."
        ]
      }
    ]
  }
];
