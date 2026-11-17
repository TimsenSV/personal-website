import { ChevronDown, Download, MapPin } from 'lucide-react'
import type { CvConfig, CvEntry } from '../content/cv'
import { assetUrl } from '../lib/links'
import { ExternalLink } from './ExternalLink'

function Entries({ entries, compact = false }: { entries: CvEntry[]; compact?: boolean }) {
  return <ol className={`cv-entries${compact ? ' is-compact' : ''}`}>
    {entries.map((entry) => <li key={`${entry.organization}-${entry.title}`}>
      <div className="cv-entry-meta"><span>{entry.period}</span>{entry.location && <small>{entry.location}</small>}</div>
      <div className="cv-entry-copy"><h5>{entry.title}</h5><p className="cv-organization">{entry.organization}</p>{entry.description && <p className="cv-description">{entry.description}</p>}</div>
    </li>)}
  </ol>
}

function Collection({ title, entries }: { title: string; entries: CvEntry[] }) {
  return <details className="cv-collection"><summary><span>{title}</span><span className="cv-count">{entries.length}</span><ChevronDown size={17} aria-hidden="true"/></summary><Entries entries={entries} compact/></details>
}

export function CvDetail({ config }: { config: CvConfig }) {
  return <article className="cv-detail">
    <header className="cv-header">
      <div className="cv-heading-row"><span className="cv-label">Curriculum vitae</span><div className="cv-actions">
        <ExternalLink href={config.source.url}>LinkedIn</ExternalLink>
        {config.download && <a className="button primary cv-download" href={assetUrl(config.download.src)} download={config.download.filename} type="application/pdf" aria-label="Download CV (PDF)"><Download size={16} aria-hidden="true"/>Download CV</a>}
      </div></div>
      <h3>{config.name}<span>.</span></h3>
      <p className="cv-headline">{config.headline}</p>
      <p className="cv-location"><MapPin size={14} aria-hidden="true"/>{config.location}</p>
      <p className="cv-summary">{config.summary}</p>
    </header>
    <section className="cv-section" aria-labelledby="cv-experience"><h4 id="cv-experience"><span>01</span> Experience</h4>
      <Entries entries={config.experience.slice(0, 3)}/>
      {config.experience.length > 3 && <Collection title="Previous roles" entries={config.experience.slice(3)}/>}
    </section>
    <section className="cv-section" aria-labelledby="cv-education"><h4 id="cv-education"><span>02</span> Education</h4><Entries entries={config.education}/></section>
    <section className="cv-section cv-more" aria-labelledby="cv-more"><h4 id="cv-more"><span>03</span> Beyond work</h4>
      <Collection title="Certifications & learning" entries={config.certifications}/>
      <Collection title="Projects & programmes" entries={config.projects}/>
      <Collection title="Volunteering" entries={config.volunteering}/>
      <Collection title="Awards" entries={config.awards}/>
    </section>
    <section className="cv-section" aria-labelledby="cv-skills"><h4 id="cv-skills"><span>04</span> Skills & languages</h4>
      <ul className="cv-skills">{config.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
      <dl className="cv-languages">{config.languages.map((language) => <div key={language.name}><dt>{language.name}</dt><dd>{language.level}</dd></div>)}</dl>
    </section>
    <p className="cv-source">Based on my LinkedIn profile · Updated <time dateTime={config.source.checkedAt}>{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(new Date(config.source.checkedAt))}</time></p>
  </article>
}
