# Ein Raum für Ideen

Persönliche Bento-Canvas mit den drei Produkten shopvibes, showcase und Backlane, einem schwebenden Dock, nativen Detailfenstern und einem kleinen Boulder-Spiel.

React + TypeScript + Vite. Statische Website, ohne Backend, CMS, Zugangsdaten oder externe Schriftanbieter. Die Schriften werden lokal ausgeliefert.

Die Gestaltung verwendet neutrale weiße Flächen, fast schwarze serifenlose Typografie, feine graue Konturen und kräftige blaue sowie orange Akzente. Die Widgets sind als eigenständige Objekte gestaltet: eine echte GitHub-Heatmap mit ausrollenden Pull Requests, ein Plattencover mit Vinyl, gestaffelte Produktansichten, eine Boulderwand mit Pixel-Figur und einen Pixel-Runner mit Strava-Link. Referenzen für Farbe und Klarheit: [ana.sh](https://ana.sh) und [chanhdai.com](https://chanhdai.com).

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

Die typisierte Datei **`src/content/site.ts`** enthält alle persönlichen Texte und Verknüpfungen. `null` bedeutet bewusst „noch nicht hinterlegt“. Keine Platzhalter-URLs eintragen.

| Bereich | Noch zu ergänzen |
| --- | --- |
| Profil | Vollständiger öffentlicher Name, eigene Fotos für den Polaroid-Stapel, ggf. Feinschliff an Kurzvorstellung und Fokus |
| Kontakt | E-Mail-Adresse und LinkedIn-URL |
| GitHub | TimsenSV ist verbunden; Links zu ausgewählten öffentlichen Repositories können noch ergänzt werden |
| Spotify | Playlist-Link oder Embed-URL, Titel, optional eigenes Cover und Begleittext |
| Produkte | Eigener Beitrag, je eine konkrete Entscheidung, Produktlinks, optional echte Screenshots |
| Laufen | Strava und Halbmarathon-Ziel sind hinterlegt; Lieblingsstrecke optional |

Für Bilder Dateien unter `public/images/` ablegen und z. B. `{ src: 'images/portrait.jpg', alt: '…' }` eintragen. Relative Pfade funktionieren auch in einem GitHub-Pages-Unterverzeichnis.

Der Vorname Tim stammt aus dem vorhandenen lokalen Projektkontext. Es sind keine Rollen, Resultate, Kundenzahlen, realen Aktivitäten oder Profiladressen ergänzt worden. Das Repository `personal-website` bezeichnet dieses tatsächlich angelegte lokale Projekt. Es hat noch keinen öffentlichen Link.

Die Produktdarstellungen sind eigenständige schematische Illustrationen, keine Screenshots oder Belege für tatsächliche Produktfunktionen. Das Backlane-Signet stammt aus dem bereits vorhandenen Markenasset `backlane/backlane_logo/backlane-signet.svg`. Die inhaltliche Klammer Information → Darstellung → Handlung ist keine Unternehmenschronologie oder technische Abhängigkeitskette.

## Verhalten

- Fehlende externe Dock-Aktionen werden vollständig ausgeblendet. Interne und konfigurierte externe Aktionen sind optisch getrennt.
- Die größeren Profilfotos liegen als Polaroid-Stapel in der Einstiegskachel. Klick oder die seitlichen Pfeile blättern weiter; horizontales Ziehen folgt dem Zeiger und wechselt ab einer Schwelle das Foto. Kurze Gesten federn zurück, vertikales Scrollen und Pinch-Zoom bleiben auf Mobilgeräten möglich. Linke/rechte Pfeiltasten funktionieren bei Fokus in der Galerie. Es gibt kein Autoplay. Bei reduzierter Bewegung wechselt das Bild sofort. Leere und einzelne Galerien sowie fehlgeschlagene Bilder haben passende Zustände.
- Gedanken und Playlist haben kleine, nichtmodale Pop-outs. Sie öffnen per Klick, Touch oder Tastatur, schließen per Escape, Klick daneben oder beim Verlassen mit Tab. Ein weiterführendes Detailfenster stellt den Fokus anschließend am ursprünglichen Widget wieder her.
- Hover-Effekte bewegen gezielt die Objekte innerhalb der Widgets; Tastaturfokus bietet dieselben Hinweise. Die PR-Warteschlange läuft nur, solange sie geöffnet und der Browser-Tab sichtbar ist. `prefers-reduced-motion` unterbindet die Bewegung.
- Produktfenster nutzen native HTML-Dialoge mit Escape, Fokusbindung und Rückkehr zum Auslöser. Auf Mobilgeräten werden sie bildschirmfüllend.
- Die kleine Pixel-Figur chalkt bei Hover einmal die Hände, klopft sie ab und erzeugt eine kurze Kreidewolke. Klick, Touch und Tastaturfokus lösen die Szene ebenfalls aus. Unter reduzierter Bewegung bleibt die Figur ruhig. Es ist eine frei gestaltete Figur, kein Porträt; die Palette liegt unter `profile.pixelAvatar`.
- Das Boulder-Spiel ist mit Maus, Touch und Tastatur spielbar. Umrandete Griffe sind erreichbar. Ziel: Top in maximal sieben Zügen. Rückwege verbrauchen ebenfalls Kraft. Es gibt Gewinn, Verlust und Neustart.
- Die öffentlichen GitHub-Ereignisse werden erst beim Öffnen des Detailfensters und nur mit konfiguriertem Nutzernamen abgefragt. Die offizielle öffentliche Events-API benötigt hier keine Zugangsdaten. Die Ansicht behandelt Laden, fehlende Aktivität, Fehler, Timeout und manuelles Wiederholen. Sie ist kein Contribution- oder Echtzeit-Tracker.
- Die GitHub-Heatmap verwendet einen echten GraphQL-Snapshot für TimsenSV: das vollständige letzte Jahr im breiten Widget und im Detail, auf kleinen Bildschirmen in zwei Kalenderzeilen, jeweils mit Datenstand. Der Import speichert ausschließlich anonyme Tageszählungen und Intensitätsstufen, keine Repository-Namen oder Inhalte. Anonym gezählte private Beiträge sind enthalten, wie im GitHub-Kalender. Die humorvollen KI-Pull-Requests sind eine lokale Animation ohne Verbindung zur echten Aktivitätsliste: Bei Hover, Tastaturfokus oder Antippen rollen sie unterhalb der Kachel aus und wechseln nacheinander von Draft über Review zu Merged. Es sind immer höchstens drei PRs sichtbar: Der oberste wird bearbeitet, bleibt kurz als Merged stehen und löst sich auf; die übrigen rücken hoch und unten kommt der nächste aus dem Pool von zwölf Ideen hinzu. Nach der letzten Idee beginnt die Reihe erneut. Kachel und Pop-out behalten dabei ihre Höhe. Escape oder Antippen außerhalb schließt sie; ein erneutes Öffnen startet von vorn. Es gibt keine Fußleiste oder separaten PR-Schalter: Die Heatmap selbst lässt sich antippen oder per Tastatur aktivieren. Repository-Infos bleiben über den Pfeil im GitHub-Kopf erreichbar. Reduzierte Bewegung zeigt sofort den ruhigen Endzustand. Texte: `github.playfulPullRequests`.
- Spotify wird ausschließlich bei gültigem Playlist-Link und erst beim Öffnen geladen. Kein OAuth, kein Autoplay. Ein direkter Spotify-Link bleibt als Alternative verfügbar.
- Die Lauf-Kachel enthält den vom Nutzer gelieferten Halbmarathon-Satz und den Strava-Link `https://www.strava.com/athletes/137493657`, ohne Tracking-Parameter. Pixel-Runner und Boulder-Figur teilen sich Kopf und Farbpalette mit braunblondem Haar. Der Laufzyklus verwendet vier gezeichnete Pixel-Posen je Bein mit versetztem Bodenkontakt; die Füße bleiben in getrennten Bahnen, ohne gekreuzte oder rotierte starre Beine. Beim Hover oder Tastaturfokus laufen Beine, Arme und Boden; reduzierte Bewegung zeigt die ruhige Pose. Die abstrakte Zeichnung bleibt in der Detailansicht und behauptet keine GPS-Aktivität.
- Titel, Beschreibung und Open-Graph-Text werden beim Build aus derselben Konfiguration eingesetzt. Eine echte kanonische URL und ein persönliches Social-Preview-Bild können nach Festlegung der Domain ergänzt werden.

## Projektstruktur

```text
src/content/site.ts       Persönliche Inhalte und Typen
src/components/           Canvas, Widgets, Dock, Dialoge und Spielansicht
src/services/github.ts   Öffentliche GitHub-Ereignisse
src/services/contributions.ts  Snapshot-Validierung und Kalenderdarstellung
scripts/update-github-contributions.mjs  GitHub-GraphQL-Import (nur lokal / CI)
public/data/github-contributions.json    Anonyme Tageswerte mit Zeitstempel
src/hooks/               Ladezustände und Abbruch/Timeout
src/game/boulder.ts      Unabhängige Spielregeln
src/lib/links.ts          Linkvalidierung und Asset-Pfade
src/test/                Spiel-, API-, Link- und Interaktionstests
src/styles.css           Grundlayout, Details, Dock und responsive Regeln
src/widgets.css          Individuelle Widget-Objekte, Pop-outs und Hover-Verhalten
```

## Später auf GitHub Pages veröffentlichen

Der Build liegt in `dist/`. Vite verwendet relative Asset-Pfade; sowohl eine eigene Domain als auch `username.github.io/repository/` sind möglich. Es gibt keine clientseitigen Pfadrouten, die besondere Serverregeln verlangen.

1. Ein GitHub-Repository anlegen und das lokale Repository damit verbinden.
2. Unter **Settings → Pages → Source** die Option **GitHub Actions** wählen.
3. Den vorbereiteten Workflow **Publish portfolio to GitHub Pages** manuell ausführen.

Der Workflow prüft den Code vor der Veröffentlichung. Er wird absichtlich nur manuell ausgelöst; diese Umsetzung veröffentlicht noch nichts. Nach dem ersten Push gegebenenfalls den gewünschten Standardbranch festlegen (lokal aktuell `codex/setup`).

## Technische Referenzen

- [Vite: GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [GitHub: öffentliche Events](https://docs.github.com/en/rest/activity/events#list-public-events-for-a-user)
- [Spotify: Embeds](https://developer.spotify.com/documentation/embeds)

## Geprüfter Stand · 17. November 2026

- Produktionsbuild, TypeScript und ESLint erfolgreich; 43 automatisierte Tests für Spielregeln, Tastaturbedienung, Dialoge, Pop-outs, externe Links, Kalenderdaten und GitHub-Zustände.
- Browserprüfung bei 1440 × 1000, 768 × 1024, 390 × 844 und 320 × 740 Pixeln; kein horizontaler Seitenüberlauf.
- Dock-Navigation, alle drei Produktansichten, Fenstervergrößerung, Escape, Tab/Shift-Tab und Rückkehr zum Auslöser geprüft.
- Boulder-Route im mobilen Browser vollständig gespielt, Gewinn und Neustart geprüft; Verlust und Umwege zusätzlich automatisiert getestet.
- Sichtbare Begleittexte auf den farbigen Flächen nach einer Kontrastprüfung nachgedunkelt. Die reduzierte Bewegung ist als gültige CSS-Medienregel geprüft: Übergänge, Animationen, Hover-Bewegung und weiches Scrollen werden abgeschaltet. Eine Betriebssystem-Emulation dieser Einstellung wurde nicht durchgeführt.
- GitHub ist mit TimsenSV konfiguriert; Snapshot und öffentliche Ereignisse wurden im Browser geladen. Lade-, Leer- und Fehlerzustände sowie Wiederholen sind zusätzlich mit ausdrücklich gekennzeichneten Testdaten geprüft. Ein echter persönlicher Spotify-Player und die später hinterlegten persönlichen Ziel-URLs sind nach ihrer Ergänzung nochmals zu prüfen.

Die letzte Widget-Überarbeitung wurde zusätzlich bei 320 px, rund 768 px und 1280 px CSS-Breite im Browser geprüft. Die Pop-outs bleiben im sichtbaren Bereich; der schmale Seitenüberlauf durch die reservierte Scrollbar wurde behoben. Escape, Tab-Austritt und der Wechsel aus der Vorschau in ein Detailfenster wurden im Browser und automatisiert geprüft.

Die Jahresansicht und die ausrollenden PRs wurden bei 320, 767 und 1280 px CSS-Breite geprüft. Alle 366 vorhandenen Tageswerte sind enthalten. Öffnen und Schließen ändern weder die Höhe der GitHub-Kachel noch die des Rasters; auf Mobilgeräten wird das Jahr auf zwei Kalenderzeilen aufgeteilt. Die Statusfolge, vollständige Rotation durch den Ideen-Pool, kleine und leere Listen, Pausieren im Hintergrund, erneutes Abspielen, Escape, Außenklick und der ruhige Endzustand bei reduzierter Bewegung sind automatisiert geprüft.

## GitHub-Kalender aktualisieren

```sh
npm run github:sync
```

Der Import verwendet die offizielle GitHub-GraphQL-API über einen vorhandenen `gh`-Login oder `GH_TOKEN` / `GITHUB_TOKEN` im Build-Prozess. Niemals ein Token in die Inhaltskonfiguration oder eine `VITE_`-Variable schreiben. Bei einem Fehler bleibt der letzte gültige Snapshot unverändert. Die normale lokale Prüfung und der Build funktionieren offline mit diesem Snapshot.

Der vorbereitete GitHub-Pages-Workflow aktualisiert den Snapshot vor dem Build mit dem kurzlebigen GitHub-Actions-Token. Bei einem API-Fehler bleibt der mitgelieferte Datenstand verwendbar; die Oberfläche zeigt dessen Datum und kennzeichnet ältere Daten. Es wurde kein automatischer Zeitplan angelegt und nichts veröffentlicht. API-Referenz: [GitHub ContributionCalendar](https://docs.github.com/en/graphql/reference/users#contributioncalendar).

## Persönliche Polaroid-Fotos

Die Einträge liegen unter `profile.photos` in `src/content/site.ts`. Für eigene Fotos `src` und `alt` ersetzen und `placeholder` entfernen. Optional sind `caption`, `position` (CSS-Objektposition), `zoom` und `monochrome` möglich. Die Reihenfolge im Array entspricht dem Stapel. Eine beliebige Anzahl von Bildern wird unterstützt; sichtbar sind höchstens drei Karten.

Aktuell wird ein einziges KI-generiertes Musterfoto in drei Darstellungen verwendet: Farbe, Schwarz-Weiß und engerer Ausschnitt. Die Person ist fiktiv und **nicht Tim**. Das Bild ist zur Stilabnahme gedacht, jede Karte ist als Platzhalter markiert. Quelle: eingebautes Imagegen-Werkzeug, kein CLI/API-Fallback. Das unveränderte generierte Asset liegt unter `public/images/portrait-sample.png`.

Die Galerie wurde mit echten Maus-Ziehgesten im Browser geprüft. Automatisierte Prüfungen decken Klick, Pfeiltasten, Umlauf, doppelte Klicks nach Ziehen, kurze Gesten, vertikales Scrollen, Abbruch, Fokus, reduzierte Bewegung, leere/einzelne Galerien und Bildfehler ab.

Generierungs-Prompt:

Use case: photorealistic-natural. Asset type: one temporary sample portrait photo for a personal website polaroid carousel prototype, clearly a fictional model, not a portrait of the real user. Primary request: a relaxed candid editorial portrait of a fictional adult man with short brown-blond hair, wearing a simple cobalt blue overshirt and white T-shirt. Waist-up framing, centered, face in upper middle with generous breathing space around head. Natural warm daylight, soft pale neutral background, authentic analog 35mm film feeling with fine grain, friendly understated expression. Square photograph, high quality natural skin texture, contemporary personal editorial aesthetic. No lettering, no frame, no collage, no logos, no watermarks. The website supplies the polaroid frame and placeholder label separately.
