# 🛟 Kinder- und Jugendschutz

Die Anlaufstelle für den Kinder- und Jugendschutz beim 1. SC 1911 Heiligenstadt e.V.

**<https://sc1911heiligenstadt.github.io/kinderschutz/>**

## Was die App kann

- **Ansprechpartnerin ganz oben** — Foto, Erreichbarkeit, je ein Knopf zum Anrufen und
  zum Mailschreiben.
- **Verdacht oder Vorfall melden** — auf Wunsch anonym. Nach dem Absenden gibt es eine
  Quittungsnummer, mit der man später nachschauen kann, was daraus wurde.
- **Meldeweg in sechs Schritten** und ein eigener Bereich dazu, was die Beauftragte tut
  und was ausdrücklich nicht.
- **Schutzkonzept** im Wortlaut plus eine Zusammenfassung in Kacheln, zum Ausdrucken
  oder als PDF.
- **Kurze Schulung** mit sechs Kapiteln und je einer Quizfrage. Wer angemeldet ist,
  bekommt am Ende einen Nachweis.
- **Konzept bestätigen** — die Unterschrift unter das Schutzkonzept steht am Ende der
  Schulung und geht in die Trainerakte. Sichtbar nur für Konten mit Trainervertrag.
- **Häufige Fragen** und **Hilfe von außen** — Notrufnummern, Beratungsstellen,
  Jugendamt.
- **Eigene Fassung für Kinder und Jugendliche** in einfacher Sprache, über einen
  Umschalter oben.
- **Meldungen bearbeiten** (nur Beauftragte) — vier Stände von *neu* bis
  *abgeschlossen*, Filter, Antwort an den Melder und das Nacherfassen dessen, was am
  Telefon oder auf einem Zettel ankommt.
- **Verwaltungsbereich** — Ansprechpartner, Konzepttext, Schulungskapitel, Quizfragen,
  Fragen, externe Stellen, Kindertext und Datenschutztext lassen sich ohne
  Programmierkenntnisse pflegen. Dazu Werbematerial und ein Aushang zum Ausdrucken.

## Ohne Anmeldung nutzbar

Info, Ansprechpartnerin und Meldeformular gehen **ohne Vereinskonto**. Kinder,
Jugendliche und Eltern haben keins — mit einem Login davor käme genau die Zielgruppe
nicht hinein.

Nur der gespeicherte Schulungsfortschritt, die Konzept-Bestätigung, die
Meldungsverwaltung und die Inhaltspflege brauchen eine Anmeldung über die
[Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/).

## Wer die Meldungen liest

Nur die in der App eingetragenen Beauftragten. Der technische Administrator der
Vereins-Tools sieht sie **nicht** — ein Bearbeiten- oder Administrieren-Recht gibt
keinen Zugang zu Meldungen. Wer eingetragen ist, steht offen im Bereich *Meldeweg* —
mit Klarnamen und samt jeder Änderung an dieser Liste.

## Was gespeichert wird

Über dem Absende-Knopf des Meldeformulars stehen die Pflichtangaben nach Art. 13 DSGVO:
Verantwortlicher mit Anschrift, Zweck, Speicherfrist und Aufsichtsbehörde, dazu der
vollständige Datenschutztext zum Aufklappen. Er benennt auch, was „anonym“ nicht
leisten kann.

Eine Meldung wird aufbewahrt, solange sie gebraucht wird, längstens acht Wochen nach
Abschluss — gelöscht wird von Hand, nicht automatisch. Der Stand *An externe Stelle
gegeben* hält diese Frist an. Eine Konzept-Bestätigung bleibt dagegen, solange man für
den Verein tätig ist.

## Bei akuter Gefahr

**110.** Diese App wird nicht rund um die Uhr gelesen.

Lieber mit jemand Fremdem reden? **116 111** (Nummer gegen Kummer, kostenlos und
anonym) oder **0800 22 55 530** (Hilfetelefon Sexueller Missbrauch).

## Technisch

Vanilla JavaScript, kein Build-Schritt. Anbindung an den
ToolsUebersicht-Login-Worker und die Vereins-Nextcloud.
Einzelheiten, Fallen und die getroffenen Entscheidungen: `CLAUDE.md`.
