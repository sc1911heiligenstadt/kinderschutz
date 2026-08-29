// Die Entwurfsfassung ALLER Inhalte dieser App.
//
// ⚠️ Was hier steht, ist ein ENTWURF und keine freigegebene Vereinsfassung.
// Solange in Nextcloud nichts gespeichert ist, zeigt die App diese Texte und
// setzt einen deutlich sichtbaren Hinweis darüber. Sobald im Verwaltungsbereich
// einmal gespeichert wurde, gilt die gespeicherte Fassung — der Notbehelf wird
// nicht stillschweigend zum Bestand.
//
// Grundlage des Konzepttextes ist der bisherige Wortlaut aus
// E:\Trainerdaten\jugendschutz-text.js (Fassung 1.1, Auszug aus dem Konzeptpapier
// Nachwuchsförderung, C. Preiß). Fassung 2.0 zieht die Zuständigkeit nach: die
// Kinder- und Jugendschutzbeauftragte ist seit 2026-08-27 eine Person IM Verein,
// die Villa Lampe ist externe Fachstelle. Das ist eine inhaltliche Änderung am
// Kern des Konzepts — deshalb 2.0 und nicht 1.2, und deshalb müssen alle
// Trainerinnen und Trainer neu bestätigen.
//
// ⚠️ Vor der Veröffentlichung müssen Juliane Müller und der Vorstand diesen Text
// freigeben, und die Villa Lampe sollte fachlich darübersehen. Diese App ist
// keine Fachstelle.

const VORGABE_KONZEPT_VERSION = "2.0";

const VORGABE_KONZEPT_HTML = `
  <p class="muted">1. SC 1911 Heiligenstadt e.V. — Kinder- und Jugendschutzkonzept, Fassung 2.0</p>

  <h3>1. Unser Bekenntnis</h3>
  <p>Der 1. SC 1911 Heiligenstadt e.V. bekennt sich klar zum Schutz von Kindern, Jugendlichen
  und jungen Erwachsenen vor jeder Form von Gewalt, Missbrauch, Diskriminierung und
  Vernachlässigung. Ziel ist ein sicheres, respektvolles und vertrauensvolles Umfeld, in dem
  sich alle Spielerinnen und Spieler frei entwickeln können.</p>
  <p>Dieses Konzept gilt für alle, die im Verein mit Kindern und Jugendlichen zu tun haben:
  Trainerinnen und Trainer, Betreuerinnen und Betreuer, Funktionärinnen und Funktionäre,
  Helferinnen und Helfer.</p>

  <h3>2. Rechte von Kindern und Jugendlichen</h3>
  <p>Jedes Kind hat das Recht auf Schutz, Beteiligung und Förderung. Im Sportbetrieb heißt
  das ganz praktisch:</p>
  <ul>
    <li>Das Recht, Nein zu sagen — auch zu Erwachsenen, auch im Training.</li>
    <li>Das Recht auf den eigenen Körper und auf Privatsphäre, besonders in Umkleide und Dusche.</li>
    <li>Das Recht, ernst genommen zu werden, wenn etwas nicht in Ordnung ist.</li>
    <li>Das Recht, sich zu beschweren, ohne dafür Nachteile zu haben.</li>
    <li>Das Recht, in Entscheidungen einbezogen zu werden, die einen selbst betreffen.</li>
  </ul>

  <h3>3. Zuständigkeit im Verein</h3>
  <p>Der Verein hat eine <strong>Kinder- und Jugendschutzbeauftragte</strong> benannt. Sie ist
  die zentrale Anlaufstelle für Fragen, Sorgen, Hinweise und Verdachtsfälle. Sie nimmt
  Meldungen entgegen, begleitet die weiteren Schritte und stellt, soweit erforderlich, die
  Verbindung zu externen fachlichen Stellen her.</p>
  <p>Sie ist damit die <strong>Schnittstelle zwischen dem Verein und den externen Stellen</strong>:
  Beratungsstellen, Jugendamt, weitere Fachstellen und zuständige Behörden. Welche Stelle im
  Einzelfall die richtige ist, entscheidet sich fachlich — nicht im Verein.</p>
  <p><strong>Wichtig, damit es keine Missverständnisse gibt:</strong> Die Kinder- und
  Jugendschutzbeauftragte führt <strong>keine eigenen Ermittlungen</strong> durch. Sie ersetzt
  weder Polizei noch Jugendamt noch eine fachliche Beratungsstelle. Ihre Aufgabe ist,
  Hinweise aufzunehmen, den Meldeweg zu koordinieren, die betroffenen Personen zu
  unterstützen und bei Bedarf die zuständigen Fachstellen einzubeziehen.</p>
  <p>Zusätzlich steht der Nachwuchsleiter als vereinsinterner Ansprechpartner zur Verfügung.
  Als externe Fach- und Beratungsstelle arbeitet der Verein mit der Villa Lampe zusammen.</p>

  <h3>4. Verhaltensregeln — Nähe und Distanz</h3>
  <p>Im Sport ist körperliche Nähe normal: Hilfestellung, Jubel, Trost nach einer Niederlage.
  Genau deshalb braucht es klare Regeln, an denen sich alle orientieren können.</p>
  <ul>
    <li>Körperkontakt nur, soweit er für die Sache nötig ist — und nur, wenn das Kind ihn will.
    Ein abgewehrter Arm ist ein Nein und wird ohne Diskussion respektiert.</li>
    <li>Umkleide und Duschen sind Rückzugsräume der Kinder. Erwachsene betreten sie nicht,
    außer es ist wirklich nötig — dann angekündigt und möglichst nicht allein.</li>
    <li>Keine Einzelsituationen hinter verschlossenen Türen. Gespräche unter vier Augen finden
    an einem Ort statt, an dem andere in der Nähe sind.</li>
    <li>Keine Geheimnisse zwischen Erwachsenen und Kindern. Sätze wie „Das bleibt unter uns“
    gibt es im Verein nicht.</li>
    <li>Keine Bevorzugung Einzelner, keine Geschenke ohne Anlass, keine privaten Treffen
    ohne Wissen der Eltern.</li>
    <li>Fahrten: möglichst nicht allein mit einem Kind im Auto. Lässt es sich nicht vermeiden,
    wissen die Eltern vorher Bescheid.</li>
    <li>Bilder und Videos nur mit Einwilligung, nie in Umkleide oder Dusche, nie auf privaten
    Kanälen.</li>
    <li>Nachrichten an Kinder laufen über die Gruppe oder die Eltern, nicht über private
    Einzelchats.</li>
    <li>Keine abwertenden Worte, keine Bloßstellung, keine körperliche Strafe — auch nicht
    als Scherz und auch nicht als „Motivation“.</li>
    <li>Kein Alkohol und keine Zigaretten im Umgang mit Kindern und Jugendlichen.</li>
  </ul>

  <h3>5. Grenzverletzungen, Übergriffe und Gewalt</h3>
  <p>Es hilft, drei Stufen zu unterscheiden — nicht um zu bewerten, sondern um sprachfähig zu
  sein:</p>
  <ul>
    <li><strong>Grenzverletzung:</strong> passiert oft unabsichtlich, aus Unachtsamkeit oder
    fehlendem Wissen. Sie lässt sich ansprechen und korrigieren.</li>
    <li><strong>Übergriff:</strong> geschieht nicht zufällig. Warnungen werden übergangen,
    Grenzen werden trotz Widerspruch überschritten.</li>
    <li><strong>Strafrechtlich relevante Tat:</strong> geplantes Vorgehen. Hier ist immer
    fachliche und meist behördliche Hilfe nötig.</li>
  </ul>
  <p>Gewalt hat viele Formen: körperliche Gewalt, seelische Gewalt und Herabwürdigung,
  sexualisierte Gewalt, Vernachlässigung, Mobbing und Ausgrenzung — auch digital.</p>

  <h3>6. Prävention</h3>
  <ul>
    <li>Verbindlicher Verhaltenskodex, unterschrieben von allen Trainerinnen, Trainern und
    Funktionären.</li>
    <li>Erweitertes Führungszeugnis von allen, die regelmäßig mit Kindern arbeiten. Es wird
    eingesehen und der Nachweis dokumentiert, nicht aufbewahrt.</li>
    <li>Regelmäßige Schulung und Sensibilisierung — unter anderem über die digitale Schulung
    in dieser App.</li>
    <li>Klar benannte Zuständigkeiten und ein Meldeweg, den jeder kennt.</li>
    <li>Beteiligung der Kinder: Sie erfahren, welche Rechte sie haben und an wen sie sich
    wenden können.</li>
    <li>Enge Zusammenarbeit mit der Villa Lampe zur Weiterentwicklung der Schutzmaßnahmen.</li>
  </ul>

  <h3>7. Intervention — was im Verdachtsfall gilt</h3>
  <p>Der Ablauf ist verbindlich. Er soll niemanden zum Ermittler machen, sondern das Gegenteil:
  er nimmt die Last von der einzelnen Person.</p>
  <p><strong>Schritt 1 — Wahrnehmen und ernst nehmen.</strong> Auffälligkeiten, Aussagen oder
  Verhaltensänderungen werden ernst genommen. Keine vorschnellen Bewertungen, keine eigenen
  Ermittlungen, keine Befragung des Kindes und erst recht keine Konfrontation der
  beschuldigten Person.</p>
  <p><strong>Schritt 2 — Sachlich dokumentieren.</strong> Was war wann, wo, wer war dabei, was
  wurde wörtlich gesagt. Nur eigene Wahrnehmung, keine Deutung, keine Vermutung.</p>
  <p><strong>Schritt 3 — Melden.</strong> Zeitnah an die Kinder- und Jugendschutzbeauftragte,
  über diese App, telefonisch oder persönlich. Wer sie nicht erreicht oder wer sich mit ihr
  nicht wenden mag, kann sich an den Nachwuchsleiter oder direkt an eine externe Stelle
  wenden.</p>
  <p><strong>Schritt 4 — Fachlich einordnen und koordinieren.</strong> Die Beauftragte ordnet
  ein, welche Unterstützung nötig ist, und koordiniert die nächsten Schritte. Sie bewertet
  nicht selbst, ob ein Verdacht zutrifft.</p>
  <p><strong>Schritt 5 — Externe Stellen einbeziehen.</strong> Je nach Lage Beratungsstelle,
  insoweit erfahrene Fachkraft, Jugendamt, Polizei. Bei akuter Gefahr gilt immer und sofort
  die 110.</p>
  <p><strong>Schritt 6 — Schutz und Unterstützung sicherstellen.</strong> Das Wohl des Kindes
  hat Vorrang vor allem anderen, auch vor dem Ruf des Vereins. Betroffene und meldende
  Personen werden begleitet.</p>
  <p><strong>Wichtiger Hinweis:</strong> Trainerinnen, Trainer und Funktionäre übernehmen keine
  eigenständige Aufklärung, sondern handeln ausschließlich im Rahmen dieses Meldewegs.</p>

  <h3>8. Vertraulichkeit und Datenschutz</h3>
  <p>Meldungen werden vertraulich behandelt. Sie sind nur den ausdrücklich benannten
  Beauftragten zugänglich und werden nicht in Mannschafts- oder Vereinsgruppen besprochen.
  Wer eine Meldung erhält, gibt nur weiter, was zum Schutz des Kindes erforderlich ist.</p>
  <p>Welche Daten wie lange gespeichert werden, steht in der Datenschutz-Information dieser
  App.</p>

  <h3>9. Überprüfung und Weiterentwicklung</h3>
  <p>Dieses Konzept wird regelmäßig überprüft und weiterentwickelt. Erfahrungen und
  Rückmeldungen von Trainerinnen, Trainern, Eltern und Spielerinnen und Spielern werden dabei
  aktiv berücksichtigt.</p>
`;

// Die Kacheln unter dem Konzept — für alle, die nicht den ganzen Text lesen.
const VORGABE_ZUSAMMENFASSUNG = [
  { id: "z-ziel", icon: "🎯", titel: "Worum es geht",
    text: "Jedes Kind soll bei uns sicher Fußball spielen können. Ohne Angst, ohne Herabwürdigung, ohne Übergriffe." },
  { id: "z-rechte", icon: "✋", titel: "Rechte der Kinder",
    text: "Nein sagen dürfen. Privatsphäre in der Umkleide. Ernst genommen werden. Sich beschweren dürfen, ohne Nachteile." },
  { id: "z-naehe", icon: "↔️", titel: "Nähe und Distanz",
    text: "Körperkontakt nur, wenn er nötig ist und das Kind ihn will. Keine Einzelsituationen hinter verschlossenen Türen. Keine Geheimnisse zwischen Erwachsenen und Kindern." },
  { id: "z-grenzen", icon: "🚧", titel: "Grenzverletzung, Übergriff, Straftat",
    text: "Drei Stufen, drei Antworten. Die erste lässt sich ansprechen. Bei der dritten ist immer fachliche Hilfe nötig." },
  { id: "z-praevention", icon: "🛡️", titel: "Prävention",
    text: "Verhaltenskodex, erweitertes Führungszeugnis, regelmäßige Schulung, klarer Meldeweg, beteiligte Kinder." },
  { id: "z-intervention", icon: "🧭", titel: "Wenn etwas passiert ist",
    text: "Wahrnehmen, sachlich aufschreiben, melden. Nicht selbst ermitteln, nicht befragen, niemanden zur Rede stellen." },
  { id: "z-wer", icon: "👤", titel: "Wer zuständig ist",
    text: "Die Kinder- und Jugendschutzbeauftragte des Vereins. Sie nimmt auf, begleitet und bindet die richtigen Fachstellen ein." },
  { id: "z-vertraulich", icon: "🔒", titel: "Vertraulichkeit",
    text: "Meldungen lesen nur die Beauftragten. Nichts landet in Mannschafts- oder Vereinsgruppen." }
];

// Der Meldeweg als sechs Schritte. Die Beauftragte steht in der Mitte.
const VORGABE_MELDEWEG = [
  { id: "w1", nr: 1, titel: "Wahrnehmen", text: "Dir fällt etwas auf. Ein Kind verhält sich anders, sagt etwas, oder du siehst eine Situation, die nicht in Ordnung ist. Nimm es ernst — auch wenn du unsicher bist." },
  { id: "w2", nr: 2, titel: "Sachlich aufschreiben", text: "Was war wann und wo, wer war dabei, was wurde wörtlich gesagt. Nur deine eigene Wahrnehmung. Keine Deutung, keine Vermutung. Nicht nachfragen, nicht ausfragen." },
  { id: "w3", nr: 3, titel: "An die Beauftragte melden", text: "Über diese App, telefonisch oder persönlich. Das ist der Punkt, an dem du die Sache abgeben darfst. Ab hier bist du nicht mehr allein damit." },
  { id: "w4", nr: 4, titel: "Fachlich einordnen", text: "Die Beauftragte ordnet ein, was jetzt gebraucht wird, und koordiniert die nächsten Schritte. Sie bewertet nicht selbst, ob ein Verdacht zutrifft." },
  { id: "w5", nr: 5, titel: "Externe Stellen einbinden", text: "Je nach Lage Beratungsstelle, insoweit erfahrene Fachkraft, Jugendamt oder Polizei. Die Beauftragte ist die Schnittstelle dorthin. Bei akuter Gefahr gilt sofort die 110." },
  { id: "w6", nr: 6, titel: "Schutz sicherstellen", text: "Das Wohl des Kindes geht vor — auch vor dem Ruf des Vereins. Betroffene und meldende Personen werden begleitet." }
];

// Was die Beauftragte tut — und was ausdrücklich nicht.
const VORGABE_ROLLE = {
  macht: [
    "Sie ist erste Anlaufstelle bei Fragen, Sorgen und Unsicherheiten.",
    "Sie nimmt Hinweise und Meldungen entgegen.",
    "Sie unterstützt Betroffene und die Menschen, die eine Meldung machen.",
    "Sie koordiniert den vereinsinternen Meldeweg.",
    "Sie stellt bei Bedarf den Kontakt zu externen Beratungs- und Fachstellen her.",
    "Sie ist die Schnittstelle zwischen Verein, Beratungsstellen, Jugendamt und weiteren zuständigen Behörden.",
    "Sie begleitet den weiteren Prozess und sorgt dafür, dass Hinweise die zuständige Stelle erreichen.",
    "Sie wahrt die Vertraulichkeit und beachtet die Anforderungen des Datenschutzes."
  ],
  machtNicht: [
    "Sie ermittelt nicht selbst und befragt keine Kinder.",
    "Sie entscheidet nicht, ob ein Verdacht zutrifft — das tun Fachstellen und Behörden.",
    "Sie ersetzt weder Polizei noch Jugendamt noch eine Beratungsstelle.",
    "Sie stellt niemanden zur Rede und konfrontiert keine beschuldigte Person."
  ]
};

// Sechs Kapitel, je eine Frage am Ende.
const VORGABE_SCHULUNG = [
  {
    id: "k1", titel: "Grundlagen", dauer: "3 Min.",
    html: `<p>Kinderschutz ist keine Zusatzaufgabe, sondern Teil guter Trainingsarbeit. Der Verein ist für die Kinder ein Ort, an dem sie viel Zeit verbringen — und an dem Erwachsene ihnen sehr nahe kommen, körperlich wie im Vertrauen.</p>
      <p>Drei Dinge machen einen Verein sicher:</p>
      <ul>
        <li><strong>Klare Regeln</strong>, die alle kennen und an denen sich alle messen lassen.</li>
        <li><strong>Ein bekannter Meldeweg</strong>, damit niemand überlegen muss, wohin mit einer Beobachtung.</li>
        <li><strong>Eine Kultur des Hinsehens</strong>: Es ist erwünscht, etwas anzusprechen. Wer meldet, ist kein Nestbeschmutzer.</li>
      </ul>
      <p>Der wichtigste Satz für dich als Trainer oder Betreuer: <strong>Du musst nichts beweisen und nichts aufklären.</strong> Du musst nur weitergeben, was dir aufgefallen ist.</p>`,
    frage: {
      id: "k1f", text: "Du beobachtest etwas, das dich beunruhigt. Was ist deine Aufgabe?",
      antworten: [
        "Erst herausfinden, ob wirklich etwas dran ist, und dann melden.",
        "Sachlich aufschreiben und an die Kinder- und Jugendschutzbeauftragte weitergeben.",
        "Das Kind unter vier Augen befragen, damit die Meldung Hand und Fuß hat."
      ],
      richtig: 1,
      erklaerung: "Aufschreiben und weitergeben. Prüfen, ob etwas dran ist, ist Aufgabe der Fachstellen — nicht deine. Eine eigene Befragung kann einem späteren Verfahren sogar schaden."
    }
  },
  {
    id: "k2", titel: "Grenzen und Grenzverletzungen", dauer: "4 Min.",
    html: `<p>Im Sport ist Nähe normal. Deshalb braucht es Regeln, die auch dann tragen, wenn es hektisch ist.</p>
      <p><strong>Die Grenze zieht das Kind, nicht der Erwachsene.</strong> Was für den einen ein freundschaftlicher Klaps ist, ist für den anderen ein Übergriff. Beides kann stimmen — maßgeblich ist das Empfinden des Kindes.</p>
      <p>Drei Stufen helfen beim Einordnen:</p>
      <ul>
        <li><strong>Grenzverletzung</strong> — meist unabsichtlich. Ansprechen, korrigieren, weitermachen.</li>
        <li><strong>Übergriff</strong> — nicht zufällig. Widerspruch wurde übergangen. Melden.</li>
        <li><strong>Straftat</strong> — geplant. Immer fachliche und meist behördliche Hilfe.</li>
      </ul>
      <p>Praktische Regeln aus dem Konzept: keine Einzelsituationen hinter verschlossenen Türen, keine Geheimnisse mit Kindern, keine privaten Einzelchats, keine Fotos in Umkleide oder Dusche, kein Alleinfahren ohne Wissen der Eltern.</p>`,
    frage: {
      id: "k2f", text: "Ein Kind weicht deiner Hilfestellung immer wieder aus. Was folgt daraus?",
      antworten: [
        "Nichts. Hilfestellung gehört zum Training.",
        "Ich erkläre ihm, dass das nötig ist, und mache weiter.",
        "Ich respektiere das ohne Diskussion und suche einen anderen Weg."
      ],
      richtig: 2,
      erklaerung: "Ein abgewehrter Arm ist ein Nein. Es zu übergehen, macht aus einer Grenzverletzung einen Übergriff — auch wenn es fachlich gut gemeint war."
    }
  },
  {
    id: "k3", titel: "Warnsignale", dauer: "4 Min.",
    html: `<p>Es gibt kein Signal, das für sich allein etwas beweist. Auffällig ist die <strong>Veränderung</strong>: ein Kind ist plötzlich anders als vorher.</p>
      <ul>
        <li>Rückzug, Schweigen, plötzliche Angst vor Trainings- oder Umkleidesituationen.</li>
        <li>Auffällige Aggressivität oder das Gegenteil: übertriebene Angepasstheit.</li>
        <li>Ungewöhnliches Vermeiden bestimmter Personen oder Orte.</li>
        <li>Aussagen, die nicht zum Alter passen, besonders zu Sexualität.</li>
        <li>Verletzungen mit wechselnden oder unstimmigen Erklärungen.</li>
        <li>Andeutungen wie „Ich darf das nicht erzählen“.</li>
      </ul>
      <p><strong>Vorsicht vor dem Umkehrschluss.</strong> Jedes dieser Zeichen kann harmlose Gründe haben — Schule, Trennung der Eltern, Pubertät. Deine Aufgabe ist nicht, das auseinanderzuhalten. Deine Aufgabe ist, es nicht zu übergehen.</p>`,
    frage: {
      id: "k3f", text: "Was macht eine Beobachtung meldenswert?",
      antworten: [
        "Wenn mindestens drei Warnsignale gleichzeitig auftreten.",
        "Wenn ich sicher bin, dass es kein harmloser Grund ist.",
        "Wenn ich ein ungutes Gefühl habe — Sicherheit ist keine Voraussetzung."
      ],
      richtig: 2,
      erklaerung: "Ein ungutes Gefühl reicht. Der Meldeweg ist genau dafür da, dass niemand allein entscheiden muss, ob etwas dran ist."
    }
  },
  {
    id: "k4", titel: "Wenn ein Kind sich anvertraut", dauer: "4 Min.",
    html: `<p>Das ist der schwierigste Moment. Was du in den ersten Minuten tust, entscheidet viel.</p>
      <p><strong>Was hilft:</strong></p>
      <ul>
        <li>Ruhig bleiben und zuhören. Auch wenn dich das Gehörte erschüttert.</li>
        <li>Glauben und ernst nehmen. Sag: „Gut, dass du es mir erzählst.“</li>
        <li>Klarstellen, dass es nicht die Schuld des Kindes ist.</li>
        <li>Ehrlich sein: „Ich hole mir Hilfe, damit dir geholfen wird.“</li>
      </ul>
      <p><strong>Was schadet:</strong></p>
      <ul>
        <li>Nachbohren, ausfragen, Details verlangen. Eine Befragung kann eine spätere Aussage unbrauchbar machen.</li>
        <li>Absolute Verschwiegenheit versprechen. Dieses Versprechen kannst du nicht halten.</li>
        <li>Vorschnell handeln: die beschuldigte Person ansprechen, die Eltern anrufen, es im Trainerkreis erzählen.</li>
        <li>Das Kind mit deiner eigenen Erschütterung belasten.</li>
      </ul>`,
    frage: {
      id: "k4f", text: "Ein Kind sagt: „Du darfst es aber niemandem erzählen.“ Was antwortest du?",
      antworten: [
        "„Versprochen, das bleibt unter uns.“",
        "„Ich erzähle es nur einer Person, die uns helfen kann. Und ich sage dir, wem.“",
        "„Dann kann ich dir leider nicht helfen.“"
      ],
      richtig: 1,
      erklaerung: "Verschwiegenheit versprechen darfst du nicht — du müsstest es brechen. Ehrlich und in kleinem Kreis bleiben ist der Weg, der das Vertrauen hält."
    }
  },
  {
    id: "k5", titel: "Richtig dokumentieren", dauer: "3 Min.",
    html: `<p>Eine gute Notiz ist langweilig. Sie enthält nur, was du selbst wahrgenommen hast.</p>
      <p><strong>Hinein gehören:</strong> Datum und Uhrzeit, Ort, wer war dabei, was ist beobachtbar passiert, wörtliche Aussagen in Anführungszeichen, wann du sie aufgeschrieben hast.</p>
      <p><strong>Nicht hinein gehören:</strong> Vermutungen, Deutungen, Diagnosen, Schuldzuweisungen, Hörensagen als Tatsache.</p>
      <p>Beispiel für gut: „14.09., nach dem Training, Kabine. L. sagte: Ich will da nicht mehr allein rein. Auf meine Frage, was los sei, hat er nichts gesagt und ist gegangen.“</p>
      <p>Beispiel für schlecht: „L. hat offensichtlich Angst vor X, wahrscheinlich ist da schon länger etwas.“</p>
      <p><strong>Und wichtig:</strong> Notizen gehören nicht in den Mannschaftschat und nicht auf einen Zettel in der Tasche. Gib sie über den Meldeweg weiter.</p>`,
    frage: {
      id: "k5f", text: "Welcher Satz gehört in eine Dokumentation?",
      antworten: [
        "„Das Kind wirkt traumatisiert.“",
        "„L. sagte wörtlich: Ich will da nicht mehr allein rein.“",
        "„Vermutlich hat der Betreuer damit zu tun.“"
      ],
      richtig: 1,
      erklaerung: "Nur die eigene Wahrnehmung und wörtliche Aussagen. Deutungen wie traumatisiert oder vermutlich sind Bewertungen — die stehen dir nicht zu und schwächen die Notiz."
    }
  },
  {
    id: "k6", titel: "Meldeweg und Verantwortung", dauer: "3 Min.",
    html: `<p>Der Weg ist immer derselbe: <strong>Wahrnehmen → Aufschreiben → Melden → Einordnen → Externe einbinden → Schutz sicherstellen.</strong></p>
      <p>Melden kannst du über diese App, telefonisch oder persönlich. Auch anonym.</p>
      <p><strong>Was du darfst:</strong> melden, auch bei Unsicherheit. Nachfragen, wie es weitergeht. Dir selbst Unterstützung holen.</p>
      <p><strong>Was du nicht tust:</strong> selbst ermitteln, das Kind ausfragen, die beschuldigte Person zur Rede stellen, die Sache im Trainerkreis oder in einer Gruppe besprechen, oder abwarten, bis du sicher bist.</p>
      <p><strong>Bei akuter Gefahr</strong> gilt immer und sofort die 110. Diese App wird nicht rund um die Uhr gelesen.</p>
      <p>Und wenn es dir selbst zu viel wird: Die Nummern der externen Stellen gelten auch für dich.</p>`,
    frage: {
      id: "k6f", text: "Ein Kind ist gerade jetzt in Gefahr. Was tust du?",
      antworten: [
        "Meldung über die App absenden und auf Antwort warten.",
        "Sofort 110 anrufen.",
        "Erst die Beauftragte anrufen, damit der Meldeweg eingehalten wird."
      ],
      richtig: 1,
      erklaerung: "Bei akuter Gefahr immer zuerst die 110. Der Meldeweg des Vereins ist wichtig, aber er ist kein Notruf — die App wird nicht rund um die Uhr gelesen."
    }
  }
];

const VORGABE_FAQ = [
  { id: "f1", frage: "Wann sollte ich etwas melden?",
    antwort: "Sobald dir etwas auffällt, das dich beunruhigt. Du musst nicht sicher sein. Lieber eine Meldung zu viel als eine zu wenig — und lieber früh als spät." },
  { id: "f2", frage: "Was mache ich, wenn ich mir nicht sicher bin?",
    antwort: "Genau dann melden. Unsicherheit ist der Normalfall, nicht die Ausnahme. Du kannst dich auch erst einmal nur beraten lassen, ohne dass daraus gleich ein Fall wird." },
  { id: "f3", frage: "Muss ich einen Verdacht beweisen können?",
    antwort: "Nein. Beweise sammeln ist ausdrücklich nicht deine Aufgabe und kann sogar schaden. Es reicht, sachlich aufzuschreiben, was du wahrgenommen hast." },
  { id: "f4", frage: "Was darf ich als Trainer oder Betreuer tun?",
    antwort: "Zuhören, ernst nehmen, sachlich aufschreiben, melden. Dem Kind sagen, dass es richtig war, sich zu melden. Dir selbst Unterstützung holen." },
  { id: "f5", frage: "Was darf ich nicht tun?",
    antwort: "Nicht selbst ermitteln. Das Kind nicht ausfragen. Die beschuldigte Person nicht zur Rede stellen. Die Sache nicht im Trainerkreis, in der Mannschaft oder in einer Chatgruppe besprechen. Und nicht abwarten, bis du sicher bist." },
  { id: "f6", frage: "Wer erhält meine Meldung?",
    antwort: "Nur die in dieser App benannten Beauftragten. Wer das ist, steht offen im Bereich Meldeweg. Der technische Administrator der Vereins-Tools sieht die Meldungen in der App nicht." },
  { id: "f7", frage: "Was passiert nach meiner Meldung?",
    antwort: "Die Beauftragte sieht sie an und meldet sich innerhalb von drei Werktagen. Sie ordnet ein, was gebraucht wird, und bindet bei Bedarf eine Beratungsstelle, das Jugendamt oder eine Behörde ein. Hast du anonym gemeldet, siehst du den Stand über deine Quittungsnummer." },
  { id: "f8", frage: "Wer ist unsere Kinder- und Jugendschutzbeauftragte?",
    antwort: "Sie steht mit Foto und Erreichbarkeit ganz oben auf der Startseite dieser App. Sie ist die zentrale Anlaufstelle des Vereins und die Schnittstelle zu den externen Fachstellen." },
  { id: "f9", frage: "Welche externen Stellen können hinzugezogen werden?",
    antwort: "Je nach Lage eine Beratungsstelle wie die Villa Lampe, eine insoweit erfahrene Fachkraft, das Jugendamt des Landkreises Eichsfeld oder die Polizei. Wer im Einzelfall die richtige Stelle ist, entscheidet sich fachlich." },
  { id: "f10", frage: "Kann ich mich auch anonym melden?",
    antwort: "Ja. Name und Kontakt sind freiwillig. Auch wenn du in den Vereins-Tools angemeldet bist, wird dein Name nicht mitgespeichert, wenn du anonym meldest. Der Preis: Bei einer anonymen Meldung kann niemand nachfragen. Über deine Quittungsnummer erfährst du trotzdem, was daraus geworden ist." },
  { id: "f11", frage: "Was ist, wenn es um die Beauftragte selbst geht?",
    antwort: "Dann wende dich an die zweite eingetragene Person, an den Nachwuchsleiter oder direkt an eine externe Stelle. Die Nummern stehen im Bereich Hilfe. Beide Beauftragten sehen alle Meldungen in der App — für einen Fall, der eine von ihnen betrifft, ist deshalb der Weg nach außen der sichere." },
  { id: "f12", frage: "Bekomme ich Ärger, wenn ich mich irre?",
    antwort: "Nein. Wer in gutem Glauben meldet, hat nichts zu befürchten. Das gilt auch dann, wenn sich am Ende herausstellt, dass alles harmlos war." }
];

const VORGABE_EXTERNE = [
  { id: "e1", name: "Polizei / Notruf", telefon: "110", email: "", web: "", notfall: true, sortierung: 0,
    beschreibung: "Bei akuter Gefahr. Rund um die Uhr erreichbar." },
  { id: "e2", name: "Nummer gegen Kummer — Kinder- und Jugendtelefon", telefon: "116111", email: "", web: "https://www.nummergegenkummer.de", notfall: true, sortierung: 1,
    beschreibung: "Für Kinder und Jugendliche. Kostenlos, anonym, ohne dass jemand davon erfährt. Mo bis Sa 14 bis 20 Uhr." },
  { id: "e3", name: "Hilfetelefon Sexueller Missbrauch", telefon: "0800 22 55 530", email: "", web: "https://www.hilfetelefon-missbrauch.de", notfall: true, sortierung: 2,
    beschreibung: "Kostenlos und anonym. Für Betroffene und für alle, die sich Sorgen um ein Kind machen." },
  { id: "e4", name: "Elterntelefon", telefon: "0800 111 0 550", email: "", web: "https://www.nummergegenkummer.de", notfall: false, sortierung: 3,
    beschreibung: "Für Eltern, die nicht weiterwissen. Kostenlos und anonym." },
  { id: "e5", name: "Villa Lampe Heilbad Heiligenstadt", telefon: "", email: "", web: "", notfall: false, sortierung: 4,
    beschreibung: "Unsere externe Fach- und Beratungsstelle. Fachliche Einschätzung und Beratung, auch anonym und ohne dass der Verein davon erfährt. ⚠️ Telefon und E-Mail müssen im Verwaltungsbereich noch eingetragen werden." },
  { id: "e6", name: "Jugendamt Landkreis Eichsfeld", telefon: "", email: "", web: "", notfall: false, sortierung: 5,
    beschreibung: "Zuständige Behörde für den Kinderschutz. ⚠️ Telefon und E-Mail müssen im Verwaltungsbereich noch eingetragen werden." },
  { id: "e7", name: "Telefonseelsorge", telefon: "0800 111 0 111", email: "", web: "https://www.telefonseelsorge.de", notfall: false, sortierung: 6,
    beschreibung: "Rund um die Uhr, kostenlos und anonym. Auch für Erwachsene, die eine Meldung belastet." }
];

// Die Fassung für Kinder und Jugendliche. Kurze Sätze, keine Fremdwörter.
const VORGABE_KINDERTEXT = {
  begruessung: "Du sollst dich beim Fußball wohlfühlen. Immer.",
  bloecke: [
    { id: "kt1", icon: "✋", titel: "Du darfst Nein sagen",
      text: "Auch zu Erwachsenen. Auch zu Trainern. Wenn dich jemand anfasst und du willst das nicht, dann darfst du das sagen. Immer." },
    { id: "kt2", icon: "🚪", titel: "Die Kabine gehört euch",
      text: "In der Umkleide und in der Dusche haben Erwachsene nichts verloren. Wenn doch mal jemand rein muss, sagt er vorher Bescheid." },
    { id: "kt3", icon: "🤫", titel: "Es gibt keine Geheimnisse",
      text: "Wenn ein Erwachsener sagt: Das bleibt unter uns — dann stimmt etwas nicht. Dann darfst du es trotzdem jemandem erzählen." },
    { id: "kt4", icon: "💬", titel: "Wenn dir etwas komisch vorkommt",
      text: "Erzähl es jemandem, dem du vertraust. Deinen Eltern. Einer Trainerin. Oder direkt unserer Kinderschutz-Beauftragten. Sie ist genau dafür da." },
    { id: "kt5", icon: "🙂", titel: "Du bekommst keinen Ärger",
      text: "Egal was du erzählst — du bist nicht schuld. Du bekommst dafür keinen Ärger. Auch dann nicht, wenn du dich geirrt hast." },
    { id: "kt6", icon: "📞", titel: "Wenn du lieber mit einem Fremden redest",
      text: "Ruf die 116 111 an. Das ist die Nummer gegen Kummer. Das kostet nichts, niemand erfährt davon, und da sitzen Leute, die zuhören können." }
  ]
};

// Datenschutz nach Art. 13 DSGVO.
//
// ⚠️ Rechtsgrundlage ist Art. 6 Abs. 1 lit. f und Art. 9 Abs. 2 lit. f DSGVO —
// AUSDRÜCKLICH KEINE Einwilligung. Eine Einwilligung wäre widerrufbar; im
// Kinderschutz wäre das die falsche Grundlage. Wer diesen Text ändert, ändert das
// bitte nicht mit.
const VORGABE_DATENSCHUTZ = `
  <h3>Wer verarbeitet deine Daten?</h3>
  <p>Der 1. SC 1911 Heiligenstadt e.V. Die Anschrift und die Kontaktdaten stehen im Impressum
  der Vereinsseite.</p>

  <h3>Wozu?</h3>
  <p>Damit die Kinder- und Jugendschutzbeauftragte deine Meldung bearbeiten, dich unterstützen
  und bei Bedarf die zuständigen Fachstellen einbinden kann.</p>

  <h3>Auf welcher Grundlage?</h3>
  <p>Auf dem berechtigten Interesse am Schutz von Kindern und Jugendlichen
  (Art. 6 Abs. 1 lit. f DSGVO). Enthält deine Meldung besondere Angaben, etwa zur Gesundheit
  oder zur Sexualität, stützt sich die Verarbeitung zusätzlich auf Art. 9 Abs. 2 lit. f DSGVO.
  Wir stützen uns bewusst <strong>nicht</strong> auf eine Einwilligung: Ein Widerruf mitten in
  einem laufenden Kinderschutzfall würde die Grundlage entziehen, auf der das Kind geschützt
  wird.</p>

  <h3>Wer liest deine Meldung?</h3>
  <p>Nur die in dieser App benannten Beauftragten. Wer das ist, steht offen im Bereich
  Meldeweg, und jede Änderung dieser Liste wird dort protokolliert. Der technische
  Administrator der Vereins-Tools sieht Meldungen in der App nicht.</p>
  <p><strong>Ehrlich gesagt gehört dazu:</strong> Die Meldungen liegen als Datei in der
  Vereins-Nextcloud. Wer dort administrativen Zugang hat, kommt technisch an die Datei —
  auch ohne die App. Das lässt sich mit den Mitteln eines Vereins nicht ausschließen. Es sind
  wenige Personen, und sie sind zur Verschwiegenheit verpflichtet.</p>

  <h3>Gibst du Daten weiter?</h3>
  <p>Nur so weit es zum Schutz des Kindes nötig ist — etwa an eine Beratungsstelle, das
  Jugendamt oder die Polizei. Die Benachrichtigung, dass eine neue Meldung vorliegt, wird per
  E-Mail über einen Dienstleister versandt; sie enthält <strong>keinen Inhalt</strong>, nur
  den Hinweis, dass etwas vorliegt.</p>

  <h3>Wie lange wird gespeichert?</h3>
  <p>So lange, wie es für die Bearbeitung nötig ist, längstens acht Wochen nach Abschluss der
  Bearbeitung. Läuft ein behördliches oder gerichtliches Verfahren, ruht diese Frist, bis es
  beendet ist. Gelöscht wird von Hand durch die Beauftragte; die App erinnert sie daran.</p>

  <h3>Muss ich meinen Namen angeben?</h3>
  <p>Nein. Du kannst anonym melden. Dann speichern wir keinen Namen — auch nicht, wenn du in
  den Vereins-Tools angemeldet bist.</p>
  <p><strong>Was „anonym“ dabei nicht leisten kann:</strong> Deine Meldung läuft wie jeder
  Aufruf einer Internetseite über die Adresse deines Anschlusses (IP-Adresse). Wir speichern
  sie nicht bei deiner Meldung, und die Beauftragte bekommt sie nie zu sehen. Der
  Serverdienst, über den die Seite läuft, verarbeitet sie aber kurzzeitig — auch, damit
  niemand die App mit Hunderten Meldungen lahmlegen kann. Wenn du ganz sicher gehen willst,
  dass keinerlei Spur bei uns entsteht: ruf bei der Nummer gegen Kummer <strong>116 111</strong>
  an, das ist kostenlos und anonym, oder sprich jemanden persönlich an.</p>

  <h3>Welche Rechte hast du?</h3>
  <p>Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Beschwerde beim
  Thüringer Landesbeauftragten für den Datenschutz.</p>
  <p><strong>Ein Punkt, den wir nicht verschweigen:</strong> Auch eine Person, über die
  gemeldet wurde, hat ein Auskunftsrecht. In Einzelfällen kann sich daraus ergeben, wer
  gemeldet hat. Wir schöpfen die Ausnahmen aus, die dem Schutz der meldenden Person dienen —
  aber wir können es nicht in jedem Fall ausschließen. Wenn dich das beunruhigt: Melde anonym,
  oder wende dich zuerst an eine externe Beratungsstelle.</p>
`;
