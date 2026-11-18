import { useRef, useState } from 'react'
import { Mail } from 'lucide-react'
import type { PortfolioConfig } from '../content/site'
import { useSpotifyConsent } from '../hooks/useSpotifyConsent'
import { ExternalLink } from './ExternalLink'

type LegalConfig = PortfolioConfig['legal']

function ContactEmail({ config }: { config: LegalConfig['email'] }) {
  const local = config.local.join('.')
  const domain = config.domain.join('.')
  const address = `${local}@${domain}`
  return <a className="legal-email" href={`mailto:${address}`} aria-label={`${address} (opens your email app)`}>
    <Mail size={17} aria-hidden="true"/><span><span>{local}</span><span>@</span><span>{domain}</span></span>
  </a>
}

export function LegalNotice({ config, initialSection = 'imprint' }: { config: LegalConfig; initialSection?: 'imprint' | 'privacy' }) {
  const [section, setSection] = useState(initialSection)
  const { allowed, revoke } = useSpotifyConsent()
  const preferenceStatus = useRef<HTMLParagraphElement>(null)
  return <div className="legal-detail">
    <nav className="legal-sections" aria-label="Legal information">
      <button data-legal-tab aria-pressed={section === 'imprint'} onClick={() => setSection('imprint')}>Impressum</button>
      <button data-legal-tab aria-pressed={section === 'privacy'} onClick={() => setSection('privacy')}>Privacy / Datenschutz</button>
    </nav>
    {section === 'imprint' ? <section className="legal-imprint" aria-labelledby="legal-operator">
      <p className="legal-label">Website operator</p>
      <h3 id="legal-operator">{config.name}</h3>
      <address>{config.address.map((line) => <span key={line}>{line}</span>)}</address>
      <div className="legal-contact"><h4>Contact</h4><ContactEmail config={config.email}/></div>
    </section> : <article className="privacy-copy" aria-labelledby="privacy-title">
      <h3 id="privacy-title">Privacy policy</h3>
      <p className="legal-updated">Last updated: <time dateTime={config.updatedAt}>{new Date(`${config.updatedAt}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time></p>
      <p>This notice applies to timsen.me. There are no accounts, contact forms, newsletters, advertising pixels or visitor analytics. Fonts, photos, project images and the playlist cover are served with the website.</p>

      <section><h4>Who is responsible?</h4>
        <p>{config.name}, {config.address.join(', ')}, is responsible for the processing described here.</p>
        <ContactEmail config={config.email}/>
      </section>

      <section><h4>Hosting & GitHub activity</h4>
        <p>GitHub Pages hosts this site. GitHub, Inc. processes connection data, including your IP address, browser information, requested pages and request times, to deliver and secure it. GitHub records visitors’ IP addresses for security purposes. My legal basis is Article 6(1)(f) GDPR: my legitimate interest in a reliable, secure portfolio.</p>
        <p>The contribution calendar is a file served with this site. Opening the GitHub detail window additionally requests my public activity from GitHub’s API; GitHub receives your IP address and request metadata. This uses the same legal basis to provide the information you request.</p>
        <p>GitHub may process data in the US and other countries. It describes EU–US Data Privacy Framework participation and Standard Contractual Clauses as transfer safeguards. Retention depends on processing purposes and legal requirements; I do not control GitHub’s logs.</p>
        <ExternalLink href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub privacy statement and transfer safeguards</ExternalLink>
      </section>

      <section><h4>Spotify — only with your permission</h4>
        <p>The player connects to Spotify AB, Regeringsgatan 19, 111 53 Stockholm, Sweden, only after you select “Allow Spotify”. Spotify receives your IP address, browser and playback data and may use cookies or similar technologies. Activity may be associated with your Spotify account if you are signed in.</p>
        <p>Closing the playlist window keeps the player on this page so playback can continue. Open the mini player and choose “Stop and close player” to end the session.</p>
        <p>Loading the player relies on your consent under Article 6(1)(a) GDPR and Section 25(1) TDDDG. Spotify may process data outside the EU/EEA and describes Standard Contractual Clauses and other applicable safeguards. Its retention periods depend on the data and purpose.</p>
        <ExternalLink href="https://www.spotify.com/de/legal/privacy-policy/">Spotify privacy policy</ExternalLink>
        <div className="privacy-preference">
          <p ref={preferenceStatus} tabIndex={-1} role="status">{allowed ? 'Spotify player is enabled in this browser.' : 'Spotify player is disabled in this browser.'}</p>
          {allowed && <button className="button secondary" onClick={() => { revoke(); preferenceStatus.current?.focus() }}>Withdraw Spotify permission</button>}
        </div>
        <p>Withdrawal stops future player loads on this site and does not affect processing before withdrawal. It cannot delete data or cookies already held by Spotify; use Spotify’s controls or your browser settings for those.</p>
      </section>

      <section><h4>Storage in your browser</h4>
        <p>If you switch between light and dark mode, this browser remembers your choice for your next visit. You can change it in the dock or reset it by clearing this site’s browser data.</p>
        <p>Your Spotify permission and its date are stored locally. Permission is valid for 180 days, then requested again; withdrawal removes the saved choice. This storage is needed to remember and respect your choice (Section 25(2)(2) TDDDG). It is not sent to my own server.</p>
        <p>When you play Grip Happens, your personal best is saved in this browser so it remains available on your next visit. It contains only a score, no name or identifier, and is not transmitted. This supports the game you request under Section 25(2)(2) TDDDG. The score remains until you clear this site’s browser data.</p>
      </section>

      <section><h4>If you email me</h4>
        <p>I process your email address, message and any information you choose to send to answer your enquiry. My mailbox is provided by GMX / 1&1 Mail & Media GmbH, Elgendorfer Str. 57, 56410 Montabaur, Germany.</p>
        <p>The basis is Article 6(1)(f) GDPR, my legitimate interest in replying to enquiries, or Article 6(1)(b) for enquiries about a potential contract. I retain correspondence as long as needed to handle the matter and any applicable retention obligations or legal claims, then delete it.</p>
        <ExternalLink href="https://agb-server.gmx.net/datenschutz">GMX privacy information</ExternalLink>
      </section>

      <section><h4>External links</h4>
        <p>Links to LinkedIn, Strava, GitHub, Spotify and my products open their respective websites. These links do not embed their pages here. Once you follow a link, the destination’s privacy information applies.</p>
      </section>

      <section><h4>Your rights</h4>
        <p>Subject to the GDPR’s conditions, you can request access, correction, deletion, restriction and portability of your personal data. You may object to processing based on legitimate interests for reasons relating to your situation and withdraw consent at any time for the future. Contact me using the email above.</p>
        <p>You may complain to a data protection authority, including the Bayerisches Landesamt für Datenschutzaufsicht (BayLDA). Providing data is not a contractual or legal requirement for visiting this site, but connection data is necessary to deliver it. Spotify and email are optional. I do not use your data for automated decisions or profiling.</p>
        <ExternalLink href="https://www.lda.bayern.de/de/beschwerde.html">Contact BayLDA</ExternalLink>
      </section>
    </article>}
  </div>
}
