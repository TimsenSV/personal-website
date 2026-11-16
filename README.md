# Ein Raum für Ideen

Persönliche Bento-Canvas mit den drei Produkten shopvibes, showcase und Backlane, einem schwebenden Dock, nativen Detailfenstern und einem kleinen Boulder-Spiel.

React + TypeScript + Vite. Statische Website, ohne Backend, CMS, Zugangsdaten oder externe Schriftanbieter. Die Schriften werden lokal ausgeliefert.

Die Gestaltung verwendet neutrale weiße Flächen, fast schwarze serifenlose Typografie, feine graue Konturen und kräftige blaue sowie orange Akzente. Die Widgets sind als eigenständige Objekte gestaltet: eine echte GitHub-Heatmap mit einrollenden KI-Gedankenspielen, ein Plattencover mit Vinyl, gestaffelte Produktansichten, eine Boulderwand mit Routenetikett und eine abstrakte Laufzeichnung. Referenzen für Farbe und Klarheit: [ana.sh](https://ana.sh) und [chanhdai.com](https://chanhdai.com).

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
| Profil | Vollständiger öffentlicher Name, echtes Porträt, ggf. Feinschliff an Kurzvorstellung und Fokus |
| Kontakt | E-Mail-Adresse und LinkedIn-URL |
| GitHub | TimsenSV ist verbunden; Links zu ausgewählten öffentlichen Repositories können noch ergänzt werden |
| Spotify | Playlist-Link oder Embed-URL, Titel, optional eigenes Cover und Begleittext |
| Produkte | Eigener Beitrag, je eine konkrete Entscheidung, Produktlinks, optional echte Screenshots |
| Laufen | Lieblingsstrecke oder persönliches Ziel, sofern gewünscht |

Für Bilder Dateien unter `public/images/` ablegen und z. B. `{ src: 'images/portrait.jpg', alt: '…' }` eintragen. Relative Pfade funktionieren auch in einem GitHub-Pages-Unterverzeichnis.

Der Vorname Tim stammt aus dem vorhandenen lokalen Projektkontext. Es sind keine Rollen, Resultate, Kundenzahlen, realen Aktivitäten oder Profiladressen ergänzt worden. Das Repository `personal-website` bezeichnet dieses tatsächlich angelegte lokale Projekt. Es hat noch keinen öffentlichen Link.

Die Produktdarstellungen sind eigenständige schematische Illustrationen, keine Screenshots oder Belege für tatsächliche Produktfunktionen. Das Backlane-Signet stammt aus dem bereits vorhandenen Markenasset `backlane/backlane_logo/backlane-signet.svg`. Die inhaltliche Klammer Information → Darstellung → Handlung ist keine Unternehmenschronologie oder technische Abhängigkeitskette.

## Verhalten

- Fehlende externe Dock-Aktionen werden vollständig ausgeblendet. Interne und konfigurierte externe Aktionen sind optisch getrennt.
- Gedanken, Repository und Playlist haben kleine, nichtmodale Pop-outs. Sie öffnen per Klick, Touch oder Tastatur, schließen per Escape, Klick daneben oder beim Verlassen mit Tab. Ein weiterführendes Detailfenster stellt den Fokus anschließend am ursprünglichen Widget wieder her.
- Hover-Effekte bewegen gezielt die Objekte innerhalb der Widgets; Tastaturfokus bietet dieselben Hinweise. Es gibt keine dauerlaufenden Animationen. `prefers-reduced-motion` unterbindet die Bewegung.
- Produktfenster nutzen native HTML-Dialoge mit Escape, Fokusbindung und Rückkehr zum Auslöser. Auf Mobilgeräten werden sie bildschirmfüllend.
- Die kleine Pixel-Figur chalkt bei Hover einmal die Hände, klopft sie ab und erzeugt eine kurze Kreidewolke. Klick, Touch und Tastaturfokus lösen die Szene ebenfalls aus. Unter reduzierter Bewegung bleibt die Figur ruhig. Es ist eine frei gestaltete Figur, kein Porträt; die Palette liegt unter `profile.pixelAvatar`.
- Das Boulder-Spiel ist mit Maus, Touch und Tastatur spielbar. Umrandete Griffe sind erreichbar. Ziel: Top in maximal sieben Zügen. Rückwege verbrauchen ebenfalls Kraft. Es gibt Gewinn, Verlust und Neustart.
- Die öffentlichen GitHub-Ereignisse werden erst beim Öffnen des Detailfensters und nur mit konfiguriertem Nutzernamen abgefragt. Die offizielle öffentliche Events-API benötigt hier keine Zugangsdaten. Die Ansicht behandelt Laden, fehlende Aktivität, Fehler, Timeout und manuelles Wiederholen. Sie ist kein Contribution- oder Echtzeit-Tracker.
- Die GitHub-Heatmap verwendet einen echten GraphQL-Snapshot für TimsenSV: 26 Wochen im Widget, das vollständige Jahr im Detail, jeweils mit Datenstand. Der Import speichert ausschließlich anonyme Tageszählungen und Intensitätsstufen, keine Repository-Namen oder Inhalte. Anonym gezählte private Beiträge sind enthalten, wie im GitHub-Kalender. Fiktive KI-Pull-Requests sind getrennt als Gedankenspiele gekennzeichnet; sie rollen bei Hover, Tastaturfokus oder Antippen einmal ein. Texte: `github.playfulPullRequests`.
- Spotify wird ausschließlich bei gültigem Playlist-Link und erst beim Öffnen geladen. Kein OAuth, kein Autoplay. Ein direkter Spotify-Link bleibt als Alternative verfügbar.
- Die Laufzeichnung ist als abstraktes Motiv gekennzeichnet. Sie behauptet weder einen realen Ort noch eine GPS-Aktivität.
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

## Geprüfter Stand · 16. November 2026

- Produktionsbuild, TypeScript und ESLint erfolgreich; 32 automatisierte Tests für Spielregeln, Tastaturbedienung, Dialoge, Pop-outs, externe Links, Kalenderdaten und GitHub-Zustände.
- Browserprüfung bei 1440 × 1000, 768 × 1024, 390 × 844 und 320 × 740 Pixeln; kein horizontaler Seitenüberlauf.
- Dock-Navigation, alle drei Produktansichten, Fenstervergrößerung, Escape, Tab/Shift-Tab und Rückkehr zum Auslöser geprüft.
- Boulder-Route im mobilen Browser vollständig gespielt, Gewinn und Neustart geprüft; Verlust und Umwege zusätzlich automatisiert getestet.
- Sichtbare Begleittexte auf den farbigen Flächen nach einer Kontrastprüfung nachgedunkelt. Die reduzierte Bewegung ist als gültige CSS-Medienregel geprüft: Übergänge, Animationen, Hover-Bewegung und weiches Scrollen werden abgeschaltet. Eine Betriebssystem-Emulation dieser Einstellung wurde nicht durchgeführt.
- GitHub ist mit TimsenSV konfiguriert; Snapshot und öffentliche Ereignisse wurden im Browser geladen. Lade-, Leer- und Fehlerzustände sowie Wiederholen sind zusätzlich mit ausdrücklich gekennzeichneten Testdaten geprüft. Ein echter persönlicher Spotify-Player und die später hinterlegten persönlichen Ziel-URLs sind nach ihrer Ergänzung nochmals zu prüfen.

Die letzte Widget-Überarbeitung wurde zusätzlich bei 320 px, rund 768 px und 1280 px CSS-Breite im Browser geprüft. Die Pop-outs bleiben im sichtbaren Bereich; der schmale Seitenüberlauf durch die reservierte Scrollbar wurde behoben. Escape, Tab-Austritt und der Wechsel aus der Vorschau in ein Detailfenster wurden im Browser und automatisiert geprüft.

## GitHub-Kalender aktualisieren

```sh
npm run github:sync
```

Der Import verwendet die offizielle GitHub-GraphQL-API über einen vorhandenen `gh`-Login oder `GH_TOKEN` / `GITHUB_TOKEN` im Build-Prozess. Niemals ein Token in die Inhaltskonfiguration oder eine `VITE_`-Variable schreiben. Bei einem Fehler bleibt der letzte gültige Snapshot unverändert. Die normale lokale Prüfung und der Build funktionieren offline mit diesem Snapshot.

Der vorbereitete GitHub-Pages-Workflow aktualisiert den Snapshot vor dem Build mit dem kurzlebigen GitHub-Actions-Token. Bei einem API-Fehler bleibt der mitgelieferte Datenstand verwendbar; die Oberfläche zeigt dessen Datum und kennzeichnet ältere Daten. Es wurde kein automatischer Zeitplan angelegt und nichts veröffentlicht. API-Referenz: [GitHub ContributionCalendar](https://docs.github.com/en/graphql/reference/users#contributioncalendar).
