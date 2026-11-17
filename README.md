# Ein Raum für Ideen

Die gesamte Website ist auf Englisch: Canvas, Detailansichten, CV, Spiel, Statusmeldungen und zugängliche Beschriftungen. Datums- und Zahlenformate verwenden `en-GB`. Der Climber heißt „Grip Happens“. Die englische Fassung wurde bei 1280 und 320 Pixeln Breite im Browser geprüft, einschließlich CV, Projektansicht, PR-Vorschau und Tastaturstart des Spiels.

Persönliche Bento-Canvas mit den drei Produkten shopvibes, showcase und backlane, einem schwebenden Dock, nativen Detailfenstern und einem reaktionsbasierten Endless Climber.

React + TypeScript + Vite, mit Motion für die Dock-Vergrößerung. Statische Website, ohne Backend, CMS, Zugangsdaten oder externe Schriftanbieter. Die Schriften werden lokal ausgeliefert.

Die Gestaltung verwendet neutrale weiße Flächen, fast schwarze serifenlose Typografie, feine graue Konturen und kräftige blaue sowie orange Akzente. Die Widgets sind als eigenständige Objekte gestaltet: eine echte GitHub-Heatmap mit ausrollenden Pull Requests, ein Plattencover mit Vinyl, drei individuell gestaltete Projektbände auf einem Produktregal, eine Boulderwand mit Pixel-Figur und einen Pixel-Runner mit Strava-Link. Referenzen für Farbe und Klarheit: [ana.sh](https://ana.sh) und [chanhdai.com](https://chanhdai.com).

## Lokal starten

Node.js ab 22.12 verwenden.

```sh
npm ci
npm run dev
```

Vorschau: http://127.0.0.1:5173. `npm run preview` startet den fertigen Build auf Port 4173.

```sh
npm run check
```

Dieser Befehl führt ESLint, die Tests und den TypeScript-/Produktionsbuild aus. Einzelne Befehle: `npm run lint`, `npm test`, `npm run build`.

## Persönliche Inhalte ergänzen

Die typisierte Datei **`src/content/site.ts`** enthält die persönlichen Canvas-Texte und Verknüpfungen. Der vollständige Lebenslauf liegt in **`src/content/cv.ts`**. `null` bedeutet bewusst „noch nicht hinterlegt“. Keine Platzhalter-URLs eintragen.

| Bereich | Noch zu ergänzen |
| --- | --- |
| Profil | Sieben eigene Fotos sind hinterlegt; Kurzvorstellung und Fokus können noch verfeinert werden |
| Kontakt | E-Mail-Adresse; LinkedIn ist im Dock hinterlegt |
| GitHub | TimsenSV ist verbunden; Links zu ausgewählten öffentlichen Repositories können noch ergänzt werden |
| Spotify | Playlist „Timsen“ mit Link und Originalcover ist hinterlegt; Begleittext optional anpassen |
| Produkte | Eigener Beitrag und je eine konkrete Entscheidung; Logos, Produktlinks sowie echte Website- und App-Aufnahmen für alle drei Produkte sind hinterlegt |
| Laufen | Strava und Halbmarathon-Ziel sind hinterlegt; Lieblingsstrecke optional |

Für Bilder Dateien unter `public/images/` ablegen und z. B. `{ src: 'images/portrait.jpg', alt: '…' }` eintragen. Relative Pfade funktionieren auch in einem GitHub-Pages-Unterverzeichnis.

Der Lebenslauf wurde am 17.11.2026 aus dem vom Nutzer verlinkten LinkedIn-Profil von Tim Hoffmann übernommen. Er enthält alle 14 beruflichen Stationen, vier Ausbildungsstationen, zehn Zertifikate, sechs Projekte, zwei Engagements, zwei Auszeichnungen, 16 Kenntnisse und drei Sprachen. Beschreibungen sind auf Englisch verdichtet; Rollen und Zeiträume stammen aus dem Profil. LinkedIn nennt beim Brandathon 2016 unterschiedliche Monate, daher steht bei der Auszeichnung nur das Jahr. Die Daten werden lokal gepflegt, ohne Laufzeitabruf oder Scraping; der Quellenlink und Stand bleiben im CV sichtbar. Nicht belegte Angaben, insbesondere eine backlane-Rolle samt Zeitraum, wurden nicht ergänzt. Das Projekt liegt im privaten GitHub-Repository [TimsenSV/personal-website](https://github.com/TimsenSV/personal-website). Die Website ist noch nicht veröffentlicht. Der Repository-Link bleibt in der öffentlichen Canvas unkonfiguriert, solange das Repository privat ist.

Die Illustrationen auf den Projektbänden sind eigenständig gestaltet, keine Screenshots. Die Work-App und Projektansichten verwenden echte Logos und zeigen nur ausdrücklich konfigurierte Produktbilder. Das backlane-Signet stammt aus dem bereits vorhandenen Markenasset `backlane/backlane_logo/backlane-signet.svg`. Die inhaltliche Klammer Information → Darstellung → Handlung ist keine Unternehmenschronologie oder technische Abhängigkeitskette.

## Verhalten

- Fehlende externe Dock-Aktionen werden vollständig ausgeblendet. Interne und konfigurierte externe Aktionen sind optisch getrennt.
- Das Dock nutzt eine abstandsabhängige Vergrößerung mit Motion-Federn: Das Icon unter der Maus wächst von 50 auf bis zu 78 Pixel, seine Nachbarn abgestuft mit. Die Leiste wird breiter, behält ihre Höhe und lässt die Icons nach oben wachsen. Tastaturfokus unterstützt dieselbe Hervorhebung; Tooltips und Fokusrahmen folgen dem Icon. Auf kleinen Bildschirmen bleiben alle Ziele 44 Pixel groß, bei Touch und reduzierter Bewegung bleibt die Vergrößerung aus. Kräftiges Blau, Violett und Orange verbinden das Dock mit den Widgets. Einstellungen: `src/lib/dock.ts`, `src/components/Dock.tsx`, `src/dock.css`.
- Die größeren Profilfotos liegen als Polaroid-Stapel in der Einstiegskachel. Klick oder die seitlichen Pfeile blättern weiter; horizontales Ziehen folgt dem Zeiger und wechselt ab einer Schwelle das Foto. Kurze Gesten federn zurück, vertikales Scrollen und Pinch-Zoom bleiben auf Mobilgeräten möglich. Linke/rechte Pfeiltasten funktionieren bei Fokus in der Galerie. Es gibt kein Autoplay. Bei reduzierter Bewegung wechselt das Bild sofort. Leere und einzelne Galerien sowie fehlgeschlagene Bilder haben passende Zustände.
- Gedanken und Playlist haben kleine, nichtmodale Pop-outs. Sie öffnen per Klick, Touch oder Tastatur, schließen per Escape, Klick daneben oder beim Verlassen mit Tab. Ein weiterführendes Detailfenster stellt den Fokus anschließend am ursprünglichen Widget wieder her.
- Die Canvas-Kacheln folgen dem Mauszeiger mit maximal 2,4 Grad Neigung. Die Bewegung wird pro Bild gebündelt, erzeugt keine React-Neudarstellung pro Zeigerbewegung und wird bei Touch, Ziehen, geöffneten Dialogen sowie reduzierter Bewegung deaktiviert. Vor Klicks und Tastaturaktionen wird die Neigung synchron zurückgesetzt, damit Fototransitionen und Pop-outs ihre richtige Ausgangsposition behalten.
- Hover-Effekte bewegen gezielt die Objekte innerhalb der Widgets; Tastaturfokus bietet dieselben Hinweise. Die PR-Warteschlange läuft nur, solange sie geöffnet und der Browser-Tab sichtbar ist. `prefers-reduced-motion` unterbindet die Bewegung.
- Über den kompakten CV-Button in der aufgeräumten Ich-Kachel öffnet sich ein Lebenslauf-Fenster. Die aktuellen Rollen und Ausbildung sind direkt sichtbar; frühere Stationen, Zertifikate, Projekte, Engagement und Auszeichnungen lassen sich per Maus oder Tastatur aufklappen. Die Canvas selbst bleibt frei von einer chronologischen Timeline.
- „Work“ im Dock öffnet eine Portfolio-Ansicht mit den drei Original-Logos, jeweils einem konkreten Nutzenversprechen, den belegten Rollen und horizontalen Screenshot-Reihen. „Explore project“ öffnet die Details im selben Fenster; „All projects“ führt zur Übersicht zurück. Beim Schließen kehrt der Fokus zum Dock bzw. zum ursprünglichen Band zurück. Die Projektbände auf der Canvas lassen sich weiterhin direkt öffnen.
- Produkt- und CV-Fenster nutzen native HTML-Dialoge mit Escape, Fokusbindung und Rückkehr zum Auslöser. Auf Mobilgeräten werden sie bildschirmfüllend.
- Die kleine Pixel-Figur chalkt bei Hover einmal die Hände, klopft sie ab und erzeugt eine kurze Kreidewolke. Klick, Touch und Tastaturfokus lösen die Szene ebenfalls aus. Unter reduzierter Bewegung bleibt die Figur ruhig. Es ist eine frei gestaltete Figur, kein Porträt; die Palette liegt unter `profile.pixelAvatar`.
- „Grip Happens“ ersetzt das frühere Routenrätsel. Pfeiltasten oder A/D sowie die beiden antippbaren Wandhälften steuern Pixel-Tim. Der umkreiste nächste Griff gibt die Richtung vor. Der Zeitzeiger startet nach jedem Zug neu; in der markierten Zone entstehen Combos. Die Trefferzone wandert zwischen Griffen leicht, bleibt während eines Zugs aber fest. Saubere Treffer verbreitern sie, unsaubere Treffer und Fehlgriffe verkleinern sie; die Breite bleibt zwischen 20 und 42 Prozent. Zu frühes Greifen, eine falsche Richtung oder ablaufender Halt kosten zunächst die einmalige Rettung, danach endet der Run. Zwei große Handsymbole zeigen die verbleibenden Leben, das letzte wird orange hervorgehoben. Normale Griffe, große Ruhegriffe und bröselige Griffe haben unterschiedliche Zeitbudgets. Ab dem zehnten Zug bieten regelmäßige Verzweigungen die Wahl zwischen mehr Höhe und mehr Zeit. Die Schwierigkeit steigt begrenzt; Ruhegriffe bleiben erhalten. Die nächsten Griffe werden aus einem Seed vorab erzeugt und stimmen mit der spielbaren Route überein.
- Enter und Leertaste starten auf dem Start- und Ergebnisbildschirm direkt einen Run. Beim Öffnen liegt der Fokus auf „Start climbing“. Das Desktop-Spielfenster passt sich seinem Inhalt an und hat keinen Vergrößern-Schalter; mobil füllt die Kletterwand den verfügbaren Bildschirm.
- P, Leertaste und die Pause-Schaltfläche pausieren das Spiel. Tab, Verlassen des Spiels, ein unsichtbarer Browser-Tab, Fensterwechsel und größere Unterbrechungen der Bildausgabe pausieren ebenfalls; Fortsetzen ist ausdrücklich. Pfeiltasten halten löst keine Zugfolge aus. Schließen beendet die Animationsschleife. Der persönliche Höhenrekord liegt ausschließlich im Browser (`tim:endless-climber:best:v1`); blockierter Speicher verhindert das Spielen nicht. Eine Markierung an der Wand zeigt den Rekord zu Beginn des Runs. Reduzierte Bewegung deaktiviert Sprünge, Kamerafahrten, Zittern und Partikel; die Spielregeln bleiben gleich.
- Die öffentlichen GitHub-Ereignisse werden erst beim Öffnen des Detailfensters und nur mit konfiguriertem Nutzernamen abgefragt. Die offizielle öffentliche Events-API benötigt hier keine Zugangsdaten. Die Ansicht behandelt Laden, fehlende Aktivität, Fehler, Timeout und manuelles Wiederholen. Sie ist kein Contribution- oder Echtzeit-Tracker.
- Die GitHub-Heatmap verwendet einen echten GraphQL-Snapshot für TimsenSV: das vollständige letzte Jahr im breiten Widget und im Detail, auf kleinen Bildschirmen in zwei Kalenderzeilen, jeweils mit Datenstand. Der Import speichert ausschließlich anonyme Tageszählungen und Intensitätsstufen, keine Repository-Namen oder Inhalte. Anonym gezählte private Beiträge sind enthalten, wie im GitHub-Kalender. Die humorvollen KI-Pull-Requests sind eine lokale Animation ohne Verbindung zur echten Aktivitätsliste: Bei Hover, Tastaturfokus oder Antippen rollen sie unterhalb der Kachel aus und wechseln nacheinander von Draft über Review zu Merged. Es sind immer höchstens drei PRs sichtbar: Beim Review klappt das Status-Badge um, das Icon dreht kurz ein und eine grüne Fortschrittslinie läuft durch. Beim Merge zeichnet sich ein weißes Häkchen in einem violetten Feld ein; ein kurzer Impuls und Ring markieren den Abschluss. Der oberste bleibt kurz als Merged stehen und löst sich auf; die übrigen rücken hoch und unten kommt der nächste aus dem Pool von zwölf Ideen hinzu. Nach der letzten Idee beginnt die Reihe erneut. Kachel und Pop-out behalten dabei ihre Höhe. Escape oder Antippen außerhalb schließt sie; ein erneutes Öffnen startet von vorn. Es gibt keine Fußleiste oder separaten PR-Schalter: Die Heatmap selbst lässt sich antippen oder per Tastatur aktivieren. Repository-Infos bleiben über den Pfeil im GitHub-Kopf erreichbar. Reduzierte Bewegung zeigt sofort den ruhigen Endzustand. Texte: `github.playfulPullRequests`.
- Spotify wird ausschließlich bei gültigem Playlist-Link und erst beim Öffnen geladen. Kein OAuth, kein Autoplay. Ein direkter Spotify-Link bleibt als Alternative verfügbar.
- Die Lauf-Kachel enthält den vom Nutzer gelieferten Halbmarathon-Satz und den Strava-Link `https://www.strava.com/athletes/137493657`, ohne Tracking-Parameter. Pixel-Runner und Boulder-Figur teilen sich Kopf und Farbpalette mit braunblondem Haar. Der Laufzyklus verwendet vier gezeichnete Pixel-Posen je Bein mit versetztem Bodenkontakt; die Füße bleiben in getrennten Bahnen, ohne gekreuzte oder rotierte starre Beine. Beim Hover oder Tastaturfokus laufen Beine, Arme und Boden; reduzierte Bewegung zeigt die ruhige Pose. Die abstrakte Zeichnung bleibt in der Detailansicht und behauptet keine GPS-Aktivität.
- Titel, Beschreibung und Open-Graph-Text werden beim Build aus derselben Konfiguration eingesetzt. Eine echte kanonische URL und ein persönliches Social-Preview-Bild können nach Festlegung der Domain ergänzt werden.

## Projektstruktur

```text
src/content/site.ts       Persönliche Canvas-Inhalte und Typen
src/content/cv.ts         Verifizierte LinkedIn-Stationen, Quelle und Stand
src/components/           Canvas, Widgets, Dock, Dialoge und Spielansicht
src/services/github.ts   Öffentliche GitHub-Ereignisse
src/services/contributions.ts  Snapshot-Validierung und Kalenderdarstellung
scripts/update-github-contributions.mjs  GitHub-GraphQL-Import (nur lokal / CI)
public/data/github-contributions.json    Anonyme Tageswerte mit Zeitstempel
src/hooks/               Ladezustände und Abbruch/Timeout
src/game/climber.ts      Endless-Climber-Regeln, Routen und lokaler Rekord
src/game/boulder.ts      Griffpositionen der statischen Canvas-Vorschau
src/climber.css          Spielfeld, Pixel-Bewegungen und mobile Vollbildansicht
src/lib/links.ts          Linkvalidierung und Asset-Pfade
src/test/                Spiel-, API-, Link- und Interaktionstests
src/styles.css           Grundlayout, Details, Dock und responsive Regeln
src/widgets.css          Individuelle Widget-Objekte, Pop-outs und Hover-Verhalten
```

## Später auf GitHub Pages veröffentlichen

Der Build liegt in `dist/`. Vite verwendet relative Asset-Pfade; sowohl eine eigene Domain als auch `username.github.io/repository/` sind möglich. Es gibt keine clientseitigen Pfadrouten, die besondere Serverregeln verlangen.

1. Die gewünschte Sichtbarkeit und GitHub-Pages-Verfügbarkeit des privaten Repositorys festlegen.
2. Unter **Settings → Pages → Source** die Option **GitHub Actions** wählen.
3. Den vorbereiteten Workflow **Publish portfolio to GitHub Pages** manuell ausführen.

Der Workflow prüft den Code vor der Veröffentlichung. Er wird absichtlich nur manuell ausgelöst; diese Umsetzung veröffentlicht noch nichts. Lokaler Arbeitsbranch und aktueller GitHub-Standardbranch sind `codex/setup`; `origin` verweist auf `TimsenSV/personal-website`.

## Technische Referenzen

- [Magic UI: Dock-Referenz](https://magicui.design/docs/components/dock) · eigenes angepasstes Dock, ohne Tailwind oder weitere UI-Komponenten
- [Ana Howard: öffentliches Referenzprojekt](https://github.com/AnaArsonist/anahoward.me) · älterer Stand mit Motion-Hover-Effekten; die zeigerabhängige Canvas-Neigung ist eigenständig umgesetzt
- [Motion: Spring-Animationen](https://motion.dev/docs/react-use-spring)
- [Vite: GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [GitHub: öffentliche Events](https://docs.github.com/en/rest/activity/events#list-public-events-for-a-user)
- [Spotify: Embeds](https://developer.spotify.com/documentation/embeds)

## Geprüfter Stand · 17. November 2026

- Produktionsbuild, TypeScript und ESLint erfolgreich; 72 automatisierte Tests für Spielregeln, Tastaturbedienung, Dialoge, Pop-outs, externe Links, Kalenderdaten und GitHub-Zustände.
- Browserprüfung bei 1440 × 1000, 768 × 1024, 390 × 844 und 320 × 740 Pixeln; kein horizontaler Seitenüberlauf.
- Dock-Navigation, alle drei Produktansichten, Fenstervergrößerung, Escape, Tab/Shift-Tab und Rückkehr zum Auslöser geprüft.
- Endless Climber im Browser mit Pfeiltasten und mobilen Steuerflächen gespielt; Combos, Ruhegriffe und Verzweigungen geprüft. Spielregeln, begrenzte Schwierigkeit, 249 aufeinanderfolgende Züge je Test-Seed, Rettung, Verlust, Neustart, Pause und Speicherung sind automatisiert geprüft.
- Adaptive Trefferzonen, Vergrößern/Verkleinern nach Treffern, Lebensverlust und die kompakte Fensterhöhe im Browser geprüft. Bei 320 × 740 Pixeln passen Lebensanzeige und Steuerung ohne seitlichen Überlauf. Start mit Leertaste, Neustart mit Enter und Fokus-Rückkehr nach Escape ebenfalls geprüft; automatisierte Tests decken zusätzlich die Zonengrenzen und das Verhalten bei Pausen und wiederholten Tastendrücken ab.
- Sichtbare Begleittexte auf den farbigen Flächen nach einer Kontrastprüfung nachgedunkelt. Die reduzierte Bewegung ist als gültige CSS-Medienregel geprüft: Übergänge, Animationen, Hover-Bewegung und weiches Scrollen werden abgeschaltet. Eine Betriebssystem-Emulation dieser Einstellung wurde nicht durchgeführt.
- GitHub ist mit TimsenSV konfiguriert; Snapshot und öffentliche Ereignisse wurden im Browser geladen. Lade-, Leer- und Fehlerzustände sowie Wiederholen sind zusätzlich mit ausdrücklich gekennzeichneten Testdaten geprüft. Der persönliche Spotify-Player wurde nach Ergänzung der Playlist geprüft; später ergänzte persönliche Ziel-URLs sind erneut zu prüfen.

Die letzte Widget-Überarbeitung wurde zusätzlich bei 320 px, rund 768 px und 1280 px CSS-Breite im Browser geprüft. Die Pop-outs bleiben im sichtbaren Bereich; der schmale Seitenüberlauf durch die reservierte Scrollbar wurde behoben. Escape, Tab-Austritt und der Wechsel aus der Vorschau in ein Detailfenster wurden im Browser und automatisiert geprüft.

Die Canvas-Kacheln verzichten auf zusätzliche Rubrikzeilen, Produktnummern und die wiederholte Dreier-Klammer. Die bereinigte Anordnung wurde bei 1280, 768 und 390 px geprüft. Das aktive Polaroid hat auch bei Tastaturfokus keinen zusätzlichen Rahmen; stattdessen wird seine Bildunterschrift unterstrichen. Die Pfeil- und Schließen-Schaltflächen behalten ihre Tastaturmarkierung. Öffnen, Weiterblättern, Pfeiltasten und Schließen wurden im Browser geprüft.

Die Jahresansicht und die ausrollenden PRs wurden bei 320, 767 und 1280 px CSS-Breite geprüft. Alle 366 vorhandenen Tageswerte sind enthalten. Öffnen und Schließen ändern weder die Höhe der GitHub-Kachel noch die des Rasters; auf Mobilgeräten wird das Jahr auf zwei Kalenderzeilen aufgeteilt. Die Statusfolge, vollständige Rotation durch den Ideen-Pool, kleine und leere Listen, Pausieren im Hintergrund, erneutes Abspielen, Escape, Außenklick und der ruhige Endzustand bei reduzierter Bewegung sind automatisiert geprüft.

## GitHub-Kalender aktualisieren

```sh
npm run github:sync
```

Der Import verwendet die offizielle GitHub-GraphQL-API über einen vorhandenen `gh`-Login oder `GH_TOKEN` / `GITHUB_TOKEN` im Build-Prozess. Niemals ein Token in die Inhaltskonfiguration oder eine `VITE_`-Variable schreiben. Bei einem Fehler bleibt der letzte gültige Snapshot unverändert. Die normale lokale Prüfung und der Build funktionieren offline mit diesem Snapshot.

Der vorbereitete GitHub-Pages-Workflow aktualisiert den Snapshot vor dem Build mit dem kurzlebigen GitHub-Actions-Token. Bei einem API-Fehler bleibt der mitgelieferte Datenstand verwendbar; die Oberfläche zeigt dessen Datum und kennzeichnet ältere Daten. Es wurde kein automatischer Zeitplan angelegt und nichts veröffentlicht. API-Referenz: [GitHub ContributionCalendar](https://docs.github.com/en/graphql/reference/users#contributioncalendar).

## Persönliche Polaroid-Fotos

Die Einträge liegen unter `profile.photos` in `src/content/site.ts`. Für neue Fotos `src`, `alt`, `width` und `height` eintragen. `preview: { src, width }` ergänzt eine kleine Version für responsive Bildauswahl. Optional sind `caption`, `position` (CSS-Objektposition), `zoom` und `monochrome` möglich. Ohne Bildunterschrift bleibt nur der Bildzähler sichtbar. Die Reihenfolge im Array entspricht dem Stapel. Eine beliebige Anzahl von Bildern wird unterstützt; sichtbar sind höchstens drei Karten.

Seit dem 17.11.2026 enthält der Stapel sieben von Tim bereitgestellte Fotos: IMG_1247, IMG_2460, IMG_2721, IMG_2725, IMG_6695, IMG_9989 und ef42442b-27aa-4d2a-908e-f8c3c53486ca – in dieser Reihenfolge. Die Platzhalter wurden ersetzt. Die WebP-Dateien unter `public/images/photos/` sind korrekt ausgerichtet, nach sRGB konvertiert und von Metadaten befreit. Große Varianten sind maximal 1600 Pixel lang, Vorschauen maximal 640 Pixel. Das bereits 640 × 640 Pixel große zweite Foto wird nicht hochskaliert und braucht keine zusätzliche Vorschau. Die Originale bleiben unverändert außerhalb des Repos. Alle Web-Dateien einschließlich Vorschauen zusammen sind ca. 1,53 MB groß (Originale: 8,95 MB); die ersten drei sichtbaren Bilder benötigen bei Nutzung der kleinen Varianten ca. 92 KB.

Der Browser wählt über `srcset` und `sizes` passend zur Bildschirmdichte und Galeriegröße. Nur das aktuelle Bild wird priorisiert; die zwei sichtbaren Stapelrückseiten verwenden kleine Vorschauen. Weitere Fotos werden erst beim Blättern eingebunden. Beim Aufklappen lädt das aktive Foto bei Bedarf in höherer Auflösung, ohne das bestehende Bild-Element zu ersetzen.

Ein Klick auf den kleinen Stapel bewegt denselben, bereits geladenen Stapel mit einer kurzen 3D-Drehung aus seiner exakten Position in die große Ansicht. Es wird keine zweite Galerie eingeblendet; Bildausschnitt und Proportionen bleiben während der Bewegung erhalten. In der großen Ansicht blättert ein Klick weiter. Ziehen, Navigationsknöpfe und Pfeiltasten funktionieren in beiden Größen; das ausgewählte Foto bleibt beim Schließen erhalten. Escape, Schließen oder ein Klick neben den Stapel schließen die native modale Galerie und geben den Fokus zurück. Reduzierte Bewegung deaktiviert die räumlichen Übergänge.

Die Galerie wurde auf Desktop und Mobilgröße mit echten Maus-Ziehgesten im Browser geprüft. Automatisierte Prüfungen decken Vergrößern, Klick, Pfeiltasten, Umlauf, doppelte Klicks nach Ziehen, kurze Gesten, vertikales Scrollen, Abbruch, Fokusbegrenzung und -rückkehr, Schließen, reduzierte Bewegung, leere/einzelne Galerien und Bildfehler ab.

## Projektbilder und Produktregal

Das Produktregal zeigt shopvibes, showcase und backlane als drei eigene Bände. Hover oder Tastaturfokus zieht den jeweiligen Band leicht heraus. Auf kleinen Bildschirmen stehen die Bände untereinander, mit Produktname und Kurzbeschreibung daneben. Gestaltung: `src/components/ProjectBook.tsx` und `src/work-shelf.css`.

Mehrere Screenshots lassen sich je Produkt unter `products[].screenshots` in `src/content/site.ts` hinterlegen. Dateien beispielsweise unter `public/images/projects/` ablegen:

```ts
screenshots: [
  {
    src: 'images/projects/shopvibes/overview.png',
    alt: 'Product data overview in shopvibes',
    caption: 'A single place for product information.',
    width: 1600,
    height: 1000,
  },
]
```

Das ist ein Konfigurationsbeispiel, kein bereits vorhandenes Asset. Pro Screenshot sind `src` und ein sinnvoller `alt`-Text erforderlich; Bildmaße und Bildunterschrift sind optional. Bilder werden vollständig dargestellt, nicht beschnitten. Die Work-Übersicht und Projektansichten zeigen die Bilder in horizontalen Reihen wie in der [Portfolio-Referenz](https://ana.sh/portfolio). Auf Touch-Geräten lässt sich die Reihe horizontal scrollen. Tab sowie linke/rechte Pfeiltaste erreichen jedes Bild; ein Klick oder Enter öffnet genau dieses Bild in der großen Galerie. Dort wechseln Vor-/Zurück-Schaltflächen und Pfeiltasten das aktive Bild; Escape schließt nur diese und führt zurück ins Projekt. Fehlgeschlagene Bilder zeigen einen ruhigen Fehlerzustand. Ohne Bilder erscheint ein zurückhaltender leerer Bildbereich. Es werden keine App-Oberflächen erfunden. Ungefüllte Angaben zu Beitrag und Designentscheidung bleiben ausgeblendet, bis sie konfiguriert sind. Das bisherige einzelne `image` wird ebenfalls weiter unterstützt.

Die neue Galerie wurde mit ausdrücklich markierten lokalen Testmotiven auf Desktop und Mobilgröße geprüft. Es wurden keine Produktscreenshots erfunden. Automatisiert geprüft sind Bildwechsel, Umlauf, leere/einzelne Galerien, Bildfehler, verschachtelte Dialoge und Fokus-Rückkehr. Die Canvas-Neigung wurde auf ihre Grenzen, Abschaltung für Touch/reduzierte Bewegung/offene Dialoge und Zurücksetzen vor Interaktionen geprüft.

Produktregal und Work-App wurden bei 1280, 680, 390 und 320 Pixeln CSS-Breite geprüft: keine seitlichen Überläufe. Die App öffnet vom Dock, wechselt zwischen Übersicht und Detail und gibt beim Schließen den Fokus zurück. Herausziehen der Bände, bestehende Polaroid-Galerie und Gedanken-Pop-out wurden im Browser kontrolliert. Die Screenshot-Galerie wurde mit lokalen Testmotiven bei Desktop- und Mobilgröße geöffnet, durchgeblättert und per Escape in das weiterhin offene Projekt zurückgeführt.

Die Spotify-Playlist [Timsen](https://open.spotify.com/playlist/7crg0zzkXhWfEMMetYnd6O) ist hinterlegt, ohne den Freigabeparameter `si`. Titel und Originalcover wurden über Spotifys öffentliche [oEmbed-Schnittstelle](https://developer.spotify.com/documentation/embeds/reference/oembed) übernommen und lokal konfiguriert. Das Cover wird direkt vom Spotify-CDN geladen; bei einem Bildfehler bleibt die gestaltete Plattenhülle sichtbar. Der Player lädt erst beim Öffnen der Detailansicht und startet nicht automatisch. Ein direkter Spotify-Link bleibt zusätzlich verfügbar.

Bei der Browserprüfung am 17.11.2026 wurden Cover und Titel korrekt geladen, die eingebettete Spotify-Vorschau lieferte in dieser Sitzung jedoch keine Titelliste. Die Ursache ist nicht geklärt; der direkte Spotify-Link ist unabhängig davon hinterlegt.

## Logos und konkrete Produktversprechen

Die Logos liegen unverändert als SVG unter `public/images/projects/<produkt>/logo.svg` und sind unter `products[].logo` konfiguriert. Quellen sind die bereits vorhandenen Originaldateien: `shopvibes-frontend/public/logo_black.svg`, `shopvibes-imagestudio-website/src/assets/showcase-logo.svg` und `backlane_logo/backlane-logo.svg`. Die dunklen Buchcover verwenden eine weiße Darstellung derselben Konturen.

Die Produktlinks und Aussagen wurden anhand der offiziellen Seiten geprüft: [shopvibes](https://www.shop-vibes.de/), [showcase](https://getshowcase.ai/en/) und [backlane](https://getbacklane.com/en/). `headline` enthält das klare Nutzenversprechen für die Work-App und Details; `shortDescription` die knappe Version unter dem Projektband. `summary` konkretisiert Zielgruppe und Funktion. Nicht belegte Rollen oder Ergebnisse wurden nicht ergänzt.

Für neue Screenshots sind die drei Ordner `public/images/projects/shopvibes/`, `showcase/` und `backlane/` vorbereitet. Dateien dort ablegen und in `products[].screenshots` eintragen. Bildreihen sind mit markierten lokalen Testmotiven auf Desktop und bei 320 Pixeln geprüft: horizontales Scrollen, Tastaturauswahl, Vergrößern des gewählten Bildes, Umlauf, Escape und Fokus-Rückkehr funktionieren. Die Testmotive sind kein Bestandteil des Portfolios. Der Fensterkopf bleibt beim Tastaturscrollen stehen.

shopvibes und showcase enthalten seit dem 17.11.2026 jeweils drei echte Chrome-Aufnahmen. Den Einstieg bildet der obere Abschnitt der jeweiligen englischen Produktwebsite (`shop-vibes.de` bzw. `getshowcase.ai/en/`). Darauf folgen der shopvibes-Demokatalog und die Kanalverwaltung bzw. das showcase-Demostudio und vorhandene Sofa-Varianten in der Bibliothek. Es wurden keine neuen Bilder generiert oder Produktdaten verändert. Die App-Aufnahmen sind auf 2000 Pixel Breite optimiert; die fotoreiche Variantenansicht verwendet JPEG.

backlane zeigt ebenfalls drei Bilder: zuerst den englischen Website-Einstieg von `getbacklane.com/en/`, danach Tims bereitgestellte Screenshots vom 17.11.2026 (Anmeldung um 16:40:44 und Integrationen um 16:42:03). Die beiden gelieferten Aufnahmen wurden nur auf 2000 Pixel Breite verkleinert; Inhalt und Sprache bleiben unverändert.

Die echten Bildreihen wurden bei 1280 und 390 Pixeln im Browser geprüft: Einstieg und Reihenfolge stimmen, alle neun Bilder laden, Vergrößern und Bildwechsel funktionieren. Escape schließt nur die Galerie und setzt den Fokus auf das auslösende Bild zurück; mobil entsteht kein seitlicher Seitenüberlauf. Lint, alle 72 Tests und der Produktionsbuild sind erfolgreich.

Die Projekt-Navigation sitzt als kompakte, feststehende Leiste direkt unter dem Fensterkopf. „All projects“ und die drei farblich zum Regal passenden Projektbände bilden eine Zeile; mobil bleibt der Zurück-Pfeil mit zugänglicher Beschriftung erhalten. Der Markenname backlane wird durchgängig kleingeschrieben.

Beim Hover oder Tastaturfokus erscheinen hinter den Büchern gestaffelte Ebenen: shopvibes-Datenkarten, showcase-Fotoabzüge und backlane-Chat/Verbindungssymbole. Die echten Produktausschnitte nutzen kleine lokale JPEG-Vorschauen (je 640 Pixel breit); die beiden Fotoabzüge sind CSS-Ausschnitte aus der vorhandenen showcase-Bibliothek. Die Elemente sind rein dekorativ, fangen keine Klicks ab und werden auf Touch-Geräten, unter 621 Pixeln sowie bei reduzierter Bewegung ausgeblendet. Gestaltung: `src/book-artifacts.css`. Desktop-Hover und Tastaturfokus sowie die Projektnavigation bei 1280, 390 und 320 Pixeln wurden im Browser geprüft.

## CV als PDF herunterladen

Im CV-Pop-up bietet „Download CV“ die am 17.11.2026 bereitgestellte `Profile.pdf` unverändert als `Tim-Hoffmann-CV.pdf` an. Die Datei liegt unter `public/documents/`; Pfad und Downloadname sind in `src/content/cv.ts` unter `download` konfiguriert. Bei `download: null` wird der Link ausgeblendet. Der Download nutzt die eigene Website und berücksichtigt deren Basispfad für GitHub Pages. Desktop und 320-Pixel-Mobilansicht sind geprüft; die tatsächlich heruntergeladene Datei ist bytegleich zum Original.
