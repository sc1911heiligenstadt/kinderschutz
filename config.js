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
    version: "1.4",
    groups: [
      {
        title: "Der schwebende Melde-Knopf verdeckt keine Notrufnummer mehr",
        items: [
          "In Fassung 1.3 erschien der Knopf sofort beim Öffnen der Seite — und lag damit auf dem Notfallkasten: quer gehalten mitten auf der 116111, hochkant auf dem Elterntelefon.",
          "Jetzt wartet er, bis der Notfallkasten durchgescrollt ist. Am Handy ist das nach etwa einem Daumenwisch (134 Pixel hochkant, 270 quer). Eine Nummer, die im Notfall gewählt wird, hat Vorrang.",
          "Damit stimmt der Satz aus 1.3 „erscheint gleich beim Öffnen der Seite“ nicht mehr — er erscheint jetzt kurz danach. Alles andere bleibt: nie zwei gleiche Knöpfe gleichzeitig, und während das Meldeformular offen ist, ist er weg."
        ]
      },
      {
        title: "Größere Tippziele und mehr Platz im Meldeformular",
        items: [
          "Das × zum Schließen eines Dialogs war 30 mal 29 Pixel groß und damit das kleinste Ziel der Seite — ausgerechnet der Knopf, mit dem man aus einem halb getippten Formular wieder herauskommt. Jetzt sind es 44 mal 44 Pixel. Das Kreuz selbst sieht gleich aus, nur die Fläche drumherum ist größer.",
          "Auf einem quer gehaltenen Handy ist der Bildschirm nur 375 Pixel hoch. Vom Meldeformular waren davon 228 Pixel sichtbar, also knapp zwei Eingabefelder. Jetzt sind es 290 Pixel — rund ein Viertel mehr, ohne dass etwas aus dem Bild fällt.",
          "Am Computer und am hochkant gehaltenen Handy ändert sich an der Größe der Dialoge nichts."
        ]
      }
    ]
  },
  {
    version: "1.3",
    groups: [
      {
        title: "Der Melde-Knopf ist am Handy jetzt immer erreichbar",
        items: [
          "Am Handy stand der große Melde-Knopf weit unterhalb des Bildschirms: auf der Startseite erst nach rund anderthalb Bildschirmen Wischen, quer gehaltenes Handy sogar nach zweieinhalb. Der mitschwebende Knopf am unteren Rand, der genau dafür da ist, blieb ausgerechnet dort weg.",
          "Jetzt erscheint er, sobald der große Knopf nicht im Bild ist — also gleich beim Öffnen der Seite. Wer melden will, muss dafür nicht mehr suchen.",
          "Im Kinderbereich heißt der schwebende Knopf jetzt „Ich möchte etwas erzählen“, genau wie der große Knopf darüber. Vorher stand dort die Erwachsenen-Formulierung „Verdacht oder Vorfall melden“.",
          "Unverändert: Zwei gleiche Knöpfe stehen nie gleichzeitig da, und solange das Meldeformular offen ist, verschwindet der schwebende Knopf."
        ]
      }
    ]
  },
  {
    version: "1.2",
    groups: [
      {
        title: "Was mit deinen Angaben passiert, steht jetzt direkt am Meldeformular",
        items: [
          "Über dem Absende-Knopf stand bisher nur, wozu wir deine Angaben verarbeiten. Jetzt stehen dort auch: wer verantwortlich ist (mit Anschrift und Telefonnummer), wie lange gespeichert wird und wo du dich beschweren kannst.",
          "Der vollständige Datenschutz-Text lässt sich direkt dort aufklappen. Vorher gab es nur den Satz „steht im Tab Info“ — und der war nicht einmal anklickbar. Deine schon getippte Meldung geht dabei nicht verloren.",
          "Der Text sagt außerdem ehrlich, was „anonym“ nicht leisten kann: Deine Meldung läuft wie jeder Seitenaufruf über die Adresse deines Anschlusses. Wir speichern sie nicht bei deiner Meldung, aber ganz spurlos ist es nicht. Wer das nicht will, findet dort den Hinweis auf die Nummer gegen Kummer."
        ]
      },
      {
        title: "Im Meldeweg stehen jetzt überall Klarnamen",
        items: [
          "Unter „Änderungen an dieser Liste“ standen bisher die Anmeldenamen der Konten — sichtbar für jeden Besucher, auch ohne Anmeldung. Jetzt stehen dort dieselben Klarnamen wie in der Liste darüber.",
          "Die Zusage bleibt unverändert: Jede Änderung an der Liste wird protokolliert und ist für alle sichtbar. Niemand kann sich still eintragen."
        ]
      },
      {
        title: "Die Schulungsliste zeigt nur noch, wen sie betrifft",
        items: [
          "In der Nachweisliste standen alle Vereinskonten, auch die der Spielerinnen und Spieler. Die machen keine Übungsleiter-Schulung und stehen dort jetzt nicht mehr.",
          "Wer bereits einen Schulungsstand hat, bleibt in jedem Fall in der Liste — ein erteilter Nachweis verschwindet nicht."
        ]
      }
    ]
  },
  {
    version: "1.1",
    groups: [
      {
        title: "Freie Texte werden jetzt geprüft, bevor sie auf der Seite landen",
        items: [
          "Der Wortlaut des Schutzkonzepts und der Datenschutztext dürfen Formatierungen enthalten — Überschriften, Absätze, Aufzählungen, Fettschrift und Links. Das bleibt so.",
          "Neu ist, dass alles andere entfernt wird, bevor der Text angezeigt wird. Wer die Texte pflegt, kann damit nichts mehr einbauen, was im Browser eines Besuchers etwas ausführt.",
          "Das ist wichtig, weil derselbe Konzepttext auch in Trainerdaten steht — genau dort, wo die Trainerinnen und Trainer unterschreiben.",
          "Links funktionieren weiter, aber nur noch zu Internetseiten, E-Mail-Adressen und Telefonnummern.",
          "Im Normalbetrieb ändert sich nichts: Die vorhandenen Texte sehen unverändert aus."
        ]
      },
      {
        title: "Aufgeräumt wird jetzt auch, was liegen geblieben ist",
        items: [
          "Wer eine Datei an eine Meldung hängt, das Formular dann aber nicht absendet, hinterließ bisher eine Datei, von der niemand mehr wusste.",
          "Solche Dateien werden jetzt nach zwei Tagen von allein entfernt — aber nur, wenn keine Meldung und kein Foto darauf verweist.",
          "An echten Meldungen ändert das nichts. Es wird weiterhin NICHTS automatisch gelöscht, was zu einer Meldung gehört."
        ]
      }
    ]
  },
  {
    version: "1.0",
    groups: [
      {
        title: "Die Kinderschutz-App ist da",
        items: [
          "Eine eigene Anlaufstelle für Kinder- und Jugendschutz im Verein. Ansprechpartner, Meldeweg, Konzept, Schulung, Fragen und Hilfsangebote an einem Ort.",
          "Der Info- und Meldeteil ist ohne Anmeldung erreichbar. Kinder, Jugendliche und Eltern haben keinen Vereins-Login — sie kämen sonst gar nicht hin.",
          "Ganz oben auf der Startseite steht die Kinder- und Jugendschutzbeauftragte mit Foto, Erreichbarkeit und je einem Knopf zum Anrufen und Mailschreiben."
        ]
      },
      {
        title: "Verdacht oder Vorfall melden",
        items: [
          "Ein großer Knopf auf jeder Seite. Davor steht in einfachen Worten, was passiert und was nicht passiert.",
          "Melden geht anonym — Name und Kontakt sind freiwillig. Wer angemeldet ist und trotzdem anonym meldet, wird auch anonym gespeichert. Die App hängt keinen Namen heimlich dran.",
          "Nach dem Absenden erscheint eine Quittungsnummer. Damit kann man später nachschauen, was aus der Meldung wurde, ohne sich zu erkennen zu geben.",
          "Bilder und PDF-Dateien können angehängt werden, höchstens drei. Der Dateityp wird am Inhalt geprüft, nicht am Namen.",
          "Zugesagt sind drei Werktage bis zur Rückmeldung. Bleibt eine Meldung länger liegen, mahnt die App die Beauftragte."
        ]
      },
      {
        title: "Wer die Meldungen lesen darf",
        items: [
          "Nur die eingetragenen Beauftragten. Der globale Administrator der Tools greift hier ausdrücklich NICHT durch.",
          "Wer in der Liste steht, ist in der App für jeden sichtbar. Jede Änderung an der Liste wird protokolliert und ebenfalls angezeigt.",
          "Push und E-Mail sagen nur, dass eine Meldung da ist. Kein Name, kein Ort, kein Inhalt — auch nicht im Betreff."
        ]
      },
      {
        title: "Schulung mit Nachweis",
        items: [
          "Sechs kurze Kapitel mit je einer Quizfrage am Ende. Lesen darf jeder, auch ohne Anmeldung.",
          "Wer angemeldet ist, sammelt Fortschritt und bekommt am Ende ein Abzeichen mit Datum.",
          "Die Beauftragte sieht, wer durch ist. Sie kann je Person „Schulung nötig“ setzen; wer nach vier Wochen nicht durch ist, bekommt eine freundliche Erinnerung."
        ]
      },
      {
        title: "Für Kinder und Jugendliche",
        items: [
          "Oben ein Umschalter auf eine eigene Fassung in einfacher Sprache: große Schrift, kurze Sätze, keine Fremdwörter.",
          "Eigener Meldeknopf und die Nummer gegen Kummer immer im Blick."
        ]
      },
      {
        title: "Alles pflegbar ohne Programmierung",
        items: [
          "Ansprechpartner, Konzepttext, Schulungskapitel, Quizfragen, Fragen und Antworten, externe Stellen und die Texte des Meldewegs stehen im Verwaltungsbereich.",
          "Solange nichts gespeichert wurde, zeigt die App die Entwurfsfassung — mit einem deutlichen Hinweis, dass sie noch nicht vom Verein freigegeben ist."
        ]
      }
    ]
  }
];
