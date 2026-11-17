export interface CvEntry {
  title: string
  organization: string
  period: string
  location?: string
  description?: string
}

export interface CvConfig {
  name: string
  headline: string
  location: string
  summary: string
  source: { url: string; checkedAt: string }
  experience: CvEntry[]
  education: CvEntry[]
  certifications: CvEntry[]
  projects: CvEntry[]
  volunteering: CvEntry[]
  awards: CvEntry[]
  skills: string[]
  languages: { name: string; level: string }[]
}

/** Manually transcribed from Tim's LinkedIn profile on 2026-11-17.
 * Descriptions are concise German paraphrases. Dates and titles retain the
 * profile's information, including overlapping roles. No runtime scraping.
 */
export const cvConfig: CvConfig = {
  name: 'Tim Hoffmann',
  headline: 'Chief Product Officer · showcase & shopvibes',
  location: 'München, Deutschland',
  summary: 'Ich verbinde Produktentwicklung, Gestaltung und unternehmerisches Denken. Mein Weg führt von UX und Business Development über ein eigenes Machine-Learning-Startup zu KI-Produkten für den E-Commerce.',
  source: { url: 'https://www.linkedin.com/in/timsenhoffmann/', checkedAt: '2026-11-17' },
  experience: [
    { title: 'Co-Founder & CPO', organization: 'get showcase', period: 'März 2026 – heute', location: 'München · Hybrid', description: 'KI-gestützte Produktfotografie für E-Commerce, insbesondere Home & Living.' },
    { title: 'Chief Product Officer', organization: 'shopvibes', period: 'März 2023 – heute', location: 'Großraum München', description: 'Produktentwicklung und Strategie einer KI-basierten SaaS-Plattform für das Management, die Qualitätssicherung und den Austausch von Produktdaten.' },
    { title: 'Venture Architect – Product & Engineering', organization: 'New Ventures', period: 'April 2022 – April 2023', location: 'München' },
    { title: 'Co-Founder & Product Lead @ lunary.ai', organization: 'Fraunhofer IGCV', period: 'Sept. 2020 – März 2022', location: 'Augsburg', description: 'Aufbau eines Machine-Learning-Startups im EXIST-Forschungstransfer. Leitung des Entwicklungsteams, nutzer- und datenorientiertes Produktdesign sowie Backlog und Roadmap. Dazu Geschäftsmodelle, Austausch mit Investoren und Kunden sowie Vertriebs- und Pitch-Unterlagen.' },
    { title: 'Masterarbeit · Roadmap Development for B2B SaaS-Startups', organization: 'Fraunhofer IGCV', period: 'April 2020 – Sept. 2020', location: 'Augsburg', description: 'Entwicklung eines Ansatzes zur methodischen Organisation agiler Arbeitsweisen (Mona): eine ganzheitliche Planungskomponente als Ergänzung zu Scrum.' },
    { title: 'Werkstudent · Online Process Monitoring', organization: 'Fraunhofer IGCV', period: 'März 2019 – Sept. 2020', location: 'Augsburg', description: 'Design und Business Development im OPM-Team an der Schnittstelle zu Ingenieurwesen und Informatik.' },
    { title: 'Bachelorarbeit · Human-Machine-Interface Design for Carbon Fibre Production', organization: 'Fraunhofer IGCV', period: 'Okt. 2018 – März 2019', location: 'Augsburg', description: 'UX/UI-Design, Usability Engineering, Rapid Prototyping und Markenentwicklung für die Carbonfaserproduktion.' },
    { title: 'Student Consultant', organization: 'ponte consult e.V.', period: 'Juni 2016 – März 2019', location: 'Ulm', description: 'Studentische Unternehmensberatung, vor allem in IT-Projekten mit deutschen Unternehmen.' },
    { title: 'Managing Director Marketing', organization: 'ponte consult e.V.', period: 'Aug. 2017 – März 2018', location: 'Ulm' },
    { title: 'Competitive Intelligence Intern', organization: 'HENSOLDT', period: 'Sept. 2017 – März 2018', location: 'Ulm', description: 'Marktanalysen, Unterstützung bei M&A-Themen und Opportunity Reports zur Positionierung von Produkten in ausländischen Märkten.' },
    { title: 'Freelancer', organization: 'stachederundsander', period: 'Juni 2016 – Juli 2017', location: 'Ulm', description: 'Webdesign, kreative Konzeption für Startups, Workshops zur Entwicklung von Value Propositions sowie Technologierecherche.' },
    { title: 'Team Leader & Co-Organizer', organization: 'Polar Bear Pitching', period: 'Jan. 2017 – Mai 2017', location: 'Finnland', description: 'Organisation der Halbfinals und Unterstützung des Hauptevents, Volunteer Management, Marketing und Videografie. Verantwortung für über 44 Volunteers.' },
    { title: 'Project Manager', organization: 'Demola', period: 'Sept. 2016 – Jan. 2017', location: 'Finnland', description: 'Teamleitung, UX/UI, Konzeption und Research für eine Finanz-App mit OP Palvelut Oy. Das Konzept Pivo 2.0 wurde als bestes Demola-Projekt ausgezeichnet und vom Projektpartner zur teilweisen Umsetzung lizenziert.' },
    { title: 'Praktikum · Marketing', organization: 'stachederundsander', period: 'März 2015 – Okt. 2015', location: 'Ulm', description: 'Eigene Kundenprojekte in Social Media, Webdesign und Geschäftskonzeption.' },
  ],
  education: [
    { title: 'Leadership Talent Academy', organization: 'UnternehmerTUM', period: 'Okt. 2021 – März 2022', description: 'Teil des ersten Jahrgangs der Academy for Innovators. Stipendium der Karl-Schlecht-Stiftung.' },
    { title: 'Master Business Development', organization: 'Hochschule Aalen', period: '2019 – 2020', description: 'Business Development, Startup-Management und Product Management.' },
    { title: 'Bachelor of Arts · Information Management and Corporate Communication', organization: 'Hochschule Neu-Ulm', period: '2015 – 2019', description: 'Verbindung von Marketing, Wirtschaft, IT und Design. Mitglied bei ponte consult e.V.' },
    { title: 'Bachelor of Business Administration · Business Information Technology', organization: 'Oulu University of Applied Sciences', period: '2015 – 2019', description: 'Double-Degree-Programm parallel zum Studium in Neu-Ulm. Vortrag über einen eigenen Kurzfilm im Rahmen einer internationalen Austausch­woche.' },
  ],
  certifications: [
    { title: 'IBM AI Product Manager', organization: 'IBM', period: 'Feb. 2025' },
    { title: 'Career Essentials in Generative AI by Microsoft and LinkedIn', organization: 'Microsoft', period: 'Aug. 2023' },
    { title: 'Product-led Certification', organization: 'Mind the Product', period: 'April 2023' },
    { title: 'Führung und Persönlichkeit', organization: 'Institut für Philosophie und Leadership', period: 'März 2022' },
    { title: 'Information Visualization: Getting Dashboards Right', organization: 'Interaction Design Foundation', period: 'Jan. 2019' },
    { title: 'Conducting Usability Testing', organization: 'Interaction Design Foundation', period: 'Jan. 2019' },
    { title: 'Web Design for Usability', organization: 'Interaction Design Foundation', period: 'Juni 2018' },
    { title: "Design Thinking: The Beginner’s Guide", organization: 'Interaction Design Foundation', period: 'April 2018' },
    { title: "User Experience: The Beginner’s Guide", organization: 'Interaction Design Foundation', period: 'April 2018' },
    { title: 'Certificate of Membership', organization: 'Interaction Design Foundation', period: 'April 2018' },
  ],
  projects: [
    { title: 'EXIST-Forschungstransfer', organization: 'Fraunhofer IGCV', period: 'Sept. 2020 – März 2022', description: 'Transfer einer Startup-Idee im Bereich Machine Learning in den Markt.' },
    { title: 'Fraunhofer AHEAD Program', organization: 'Fraunhofer Venture / Fraunhofer IGCV', period: 'Aug. 2019 – Aug. 2020', description: 'Teilnahme am Startup- und Technologietransferprogramm mit Kollegen aus dem OPM-Team.' },
    { title: 'Consulting · Projektunterstützung IT-Austausch', organization: 'ponte consult e.V.', period: 'Juli 2017 – Sept. 2017', description: 'Beratung bei einem Finanzinstitut: Softwaretests, Fehleranalyse, Datenmigration, Geschäftsprozessanalyse und Arbeitsanweisungen.' },
    { title: 'Avanto Accelerator Programme', organization: 'BricKIT', period: 'März 2017 – Juni 2017', description: 'Weiterentwicklung der Startup-Idee BricKIT im Accelerator. Anschließend zwei Monate in Palo Alto für Austausch, Vernetzung und die weitere Arbeit an der Idee.' },
    { title: 'Life Account / Pivo 2.0', organization: 'Demola · OP Palvelut Oy', period: 'Sept. 2016 – Jan. 2017', description: 'Konzept einer mobilen Finanz-App; als bestes Demola-Projekt ausgezeichnet und zur teilweisen Implementierung durch den Projektpartner lizenziert.' },
    { title: 'Brandathon Oulu 2016', organization: '9solutions', period: 'Nov. 2016', description: 'Gewinn des zweitägigen Wettbewerbs: Zielgruppen und Markenversprechen für ein neues Produkt im Bereich persönlicher Sicherheit.' },
  ],
  volunteering: [
    { title: 'Co-Founder & Organizer', organization: 'InnoWeekend', period: 'März 2018 – heute', description: 'Dreitägiges jährliches Event, das Studierende, Mentoren und regionale Unternehmen zusammenbringt, um Startup-Methoden zu vermitteln und Geschäftsideen zu entwickeln.' },
    { title: 'Marketing Volunteer · Filmmaking & Social Media', organization: 'Polar Bear Pitching', period: 'Nov. 2016 – Feb. 2017', description: 'Video- und Social-Media-Inhalte, Marketingkonzeption sowie Startup-Akquise bei Slush 2016 und weiteren Events.' },
  ],
  awards: [
    { title: 'Startup Weekend Oulu · Winner', organization: 'BricKIT', period: 'Feb. 2017', description: 'Gewinn des Final Pitch mit der Idee, aus Bildern 3D-Modelle und Bauanleitungen für Baustein-Sets zu erstellen.' },
    // LinkedIn's sections disagree on the month (Jan / Nov); use their common year.
    { title: 'Brandathon Oulu · Winner', organization: '9solutions', period: '2016', description: 'Auszeichnung für Zielgruppenanalyse und die Entwicklung eines Markenversprechens.' },
  ],
  skills: ['Product Management', 'Design', 'Filmmaking', 'Adobe Creative Suite', 'Teamwork', 'Public Presentations', 'Creative Conception', 'Social Media', 'Entrepreneurship', 'Marketing', 'Service Design', 'Team Leadership', 'Leadership', 'Artificial Intelligence (AI)', 'Computer Ethics', 'Generative AI'],
  languages: [
    { name: 'Deutsch', level: 'Muttersprache / zweisprachig' },
    { name: 'Englisch', level: 'Berufliche Sprachkenntnisse' },
    { name: 'Französisch', level: 'Grundkenntnisse' },
  ],
}
