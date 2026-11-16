# Ein Raum für Ideen

Persönliche Bento-Canvas mit den drei Produkten shopvibes, showcase und Backlane, einem schwebenden Dock, nativen Detailfenstern und einem kleinen Boulder-Spiel.

React + TypeScript + Vite. Statische Website, ohne Backend, CMS, Zugangsdaten oder externe Schriftanbieter. Die Schriften werden lokal ausgeliefert.

Die Gestaltung verwendet neutrale weiße Flächen, fast schwarze serifenlose Typografie, feine graue Konturen und kräftige blaue sowie orange Akzente. Das dunkle Musik-Widget ergänzt die helle Canvas. Referenzen für Farbe und Klarheit: [ana.sh](https://ana.sh) und [chanhdai.com](https://chanhdai.com).

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
| GitHub | Nutzername und Links zu tatsächlich öffentlichen Repositories |
| Spotify | Playlist-Link oder Embed-URL, Titel, optional eigenes Cover und Begleittext |
| Produkte | Eigener Beitrag, je eine konkrete Entscheidung, Produktlinks, optional echte Screenshots |
| Laufen | Lieblingsstrecke oder persönliches Ziel, sofern gewünscht |

Für Bilder Dateien unter `public/images/` ablegen und z. B. `{ src: 'images/portrait.jpg', alt: '…' }` eintragen. Relative Pfade funktionieren auch in einem GitHub-Pages-Unterverzeichnis.

Der Vorname Tim stammt aus dem vorhandenen lokalen Projektkontext. Es sind keine Rollen, Resultate, Kundenzahlen, realen Aktivitäten oder Profiladressen ergänzt worden. Das Repository `personal-website` bezeichnet dieses tatsächlich angelegte lokale Projekt. Es hat noch keinen öffentlichen Link.

Die Produktdarstellungen sind eigenständige schematische Illustrationen, keine Screenshots oder Belege für tatsächliche Produktfunktionen. Das Backlane-Signet stammt aus dem bereits vorhandenen Markenasset `backlane/backlane_logo/backlane-signet.svg`. Die inhaltliche Klammer Information → Darstellung → Handlung ist keine Unternehmenschronologie oder technische Abhängigkeitskette.

## Verhalten

- Fehlende externe Dock-Aktionen werden vollständig ausgeblendet. Interne und konfigurierte externe Aktionen sind optisch getrennt.
- Produktfenster nutzen native HTML-Dialoge mit Escape, Fokusbindung und Rückkehr zum Auslöser. Auf Mobilgeräten werden sie bildschirmfüllend.
- Das Boulder-Spiel ist mit Maus, Touch und Tastatur spielbar. Umrandete Griffe sind erreichbar. Ziel: Top in maximal sieben Zügen. Rückwege verbrauchen ebenfalls Kraft. Es gibt Gewinn, Verlust und Neustart.
- GitHub wird erst beim Öffnen des Widgets und nur mit konfiguriertem Nutzernamen abgefragt. Die offizielle öffentliche Events-API benötigt hier keine Zugangsdaten. Die Ansicht behandelt Laden, fehlende Aktivität, Fehler, Timeout und manuelles Wiederholen. Sie ist kein Contribution- oder Echtzeit-Tracker.
- Spotify wird ausschließlich bei gültigem Playlist-Link und erst beim Öffnen geladen. Kein OAuth, kein Autoplay. Ein direkter Spotify-Link bleibt als Alternative verfügbar.
- Die Laufzeichnung ist als abstraktes Motiv gekennzeichnet. Sie behauptet weder einen realen Ort noch eine GPS-Aktivität.
- Titel, Beschreibung und Open-Graph-Text werden beim Build aus derselben Konfiguration eingesetzt. Eine echte kanonische URL und ein persönliches Social-Preview-Bild können nach Festlegung der Domain ergänzt werden.

## Projektstruktur

```text
src/content/site.ts       Persönliche Inhalte und Typen
src/components/           Canvas, Widgets, Dock, Dialoge und Spielansicht
src/services/github.ts   Offizielle GitHub-Abfrage und Antwortvalidierung
src/hooks/               Ladezustände und Abbruch/Timeout
src/game/boulder.ts      Unabhängige Spielregeln
src/lib/links.ts          Linkvalidierung und Asset-Pfade
src/test/                Spiel-, API-, Link- und Interaktionstests
src/styles.css           Gestaltung und responsive Regeln
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

- Produktionsbuild, TypeScript und ESLint erfolgreich; 19 automatisierte Tests für Spielregeln, Tastaturbedienung, Dialoge, externe Links und GitHub-Zustände.
- Browserprüfung bei 1440 × 1000, 768 × 1024, 390 × 844 und 320 × 740 Pixeln; kein horizontaler Seitenüberlauf.
- Dock-Navigation, alle drei Produktansichten, Fenstervergrößerung, Escape, Tab/Shift-Tab und Rückkehr zum Auslöser geprüft.
- Boulder-Route im mobilen Browser vollständig gespielt, Gewinn und Neustart geprüft; Verlust und Umwege zusätzlich automatisiert getestet.
- Sichtbare Begleittexte auf den farbigen Flächen nach einer Kontrastprüfung nachgedunkelt. Die reduzierte Bewegung ist als gültige CSS-Medienregel geprüft: Übergänge, Animationen, Hover-Bewegung und weiches Scrollen werden abgeschaltet. Eine Betriebssystem-Emulation dieser Einstellung wurde nicht durchgeführt.
- Externe Dienste sind noch nicht persönlich konfiguriert. GitHub-Lade-, Leer- und Fehlerzustände sowie Wiederholen sind mit ausdrücklich gekennzeichneten Testdaten geprüft. Ein echter persönlicher Spotify-Player und die später hinterlegten persönlichen Ziel-URLs sind nach ihrer Ergänzung nochmals zu prüfen.
