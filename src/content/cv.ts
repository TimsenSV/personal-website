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
 * Descriptions are concise English paraphrases. Dates and titles retain the
 * profile's information, including overlapping roles. No runtime scraping.
 */
export const cvConfig: CvConfig = {
  name: 'Tim Hoffmann',
  headline: 'Chief Product Officer · showcase & shopvibes',
  location: 'Munich, Germany',
  summary: 'I bring together product development, design and an entrepreneurial mindset. My path has taken me from UX and business development through my own machine-learning startup to AI products for e-commerce.',
  source: { url: 'https://www.linkedin.com/in/timsenhoffmann/', checkedAt: '2026-11-17' },
  experience: [
    { title: 'Co-Founder & CPO', organization: 'get showcase', period: 'Mar 2026 – Present', location: 'Munich · Hybrid', description: 'AI-powered product photography for e-commerce, particularly home & living.' },
    { title: 'Chief Product Officer', organization: 'shopvibes', period: 'Mar 2023 – Present', location: 'Greater Munich area', description: 'Product development and strategy for an AI-powered SaaS platform for managing, validating and exchanging product data.' },
    { title: 'Venture Architect – Product & Engineering', organization: 'New Ventures', period: 'Apr 2022 – Apr 2023', location: 'Munich' },
    { title: 'Co-Founder & Product Lead @ lunary.ai', organization: 'Fraunhofer IGCV', period: 'Sep 2020 – Mar 2022', location: 'Augsburg', description: 'Built a machine-learning startup through the EXIST Research Transfer programme. Led the development team, user- and data-informed product design, backlog and roadmap. Also worked on business models, investor and customer conversations, sales materials and pitch decks.' },
    { title: 'Master’s thesis · Roadmap Development for B2B SaaS Startups', organization: 'Fraunhofer IGCV', period: 'Apr 2020 – Sep 2020', location: 'Augsburg', description: 'Developed Mona, an approach to organising agile work, adding a holistic planning component to Scrum.' },
    { title: 'Working student · Online Process Monitoring', organization: 'Fraunhofer IGCV', period: 'Mar 2019 – Sep 2020', location: 'Augsburg', description: 'Design and business development in the OPM team, working across engineering and computer science.' },
    { title: 'Bachelor’s thesis · Human-Machine Interface Design for Carbon Fibre Production', organization: 'Fraunhofer IGCV', period: 'Oct 2018 – Mar 2019', location: 'Augsburg', description: 'UX/UI design, usability engineering, rapid prototyping and brand development for carbon fibre production.' },
    { title: 'Student Consultant', organization: 'ponte consult e.V.', period: 'Jun 2016 – Mar 2019', location: 'Ulm', description: 'Student consulting, mainly on IT projects with German companies.' },
    { title: 'Managing Director Marketing', organization: 'ponte consult e.V.', period: 'Aug 2017 – Mar 2018', location: 'Ulm' },
    { title: 'Competitive Intelligence Intern', organization: 'HENSOLDT', period: 'Sep 2017 – Mar 2018', location: 'Ulm', description: 'Market analysis, support on M&A topics and opportunity reports for positioning products in international markets.' },
    { title: 'Freelancer', organization: 'stachederundsander', period: 'Jun 2016 – Jul 2017', location: 'Ulm', description: 'Web design, creative concepts for startups, value proposition workshops and technology research.' },
    { title: 'Team Leader & Co-Organizer', organization: 'Polar Bear Pitching', period: 'Jan 2017 – May 2017', location: 'Finland', description: 'Organised the semi-finals and supported the main event, including volunteer management, marketing and videography. Responsible for more than 44 volunteers.' },
    { title: 'Project Manager', organization: 'Demola', period: 'Sep 2016 – Jan 2017', location: 'Finland', description: 'Team leadership, UX/UI, concepts and research for a finance app with OP Palvelut Oy. The Pivo 2.0 concept won best Demola project and was licensed by the project partner for partial implementation.' },
    { title: 'Marketing intern', organization: 'stachederundsander', period: 'Mar 2015 – Oct 2015', location: 'Ulm', description: 'Managed client projects in social media, web design and business concepts.' },
  ],
  education: [
    { title: 'Leadership Talent Academy', organization: 'UnternehmerTUM', period: 'Oct 2021 – Mar 2022', description: 'Part of the first Academy for Innovators cohort. Scholarship from the Karl Schlecht Foundation.' },
    { title: 'Master Business Development', organization: 'Hochschule Aalen', period: '2019 – 2020', description: 'Business development, startup management and product management.' },
    { title: 'Bachelor of Arts · Information Management and Corporate Communication', organization: 'Hochschule Neu-Ulm', period: '2015 – 2019', description: 'Combining marketing, business, IT and design. Member of ponte consult e.V.' },
    { title: 'Bachelor of Business Administration · Business Information Technology', organization: 'Oulu University of Applied Sciences', period: '2015 – 2019', description: 'Double-degree programme alongside studies in Neu-Ulm. Presented a personal short film during an international exchange week.' },
  ],
  certifications: [
    { title: 'IBM AI Product Manager', organization: 'IBM', period: 'Feb 2025' },
    { title: 'Career Essentials in Generative AI by Microsoft and LinkedIn', organization: 'Microsoft', period: 'Aug 2023' },
    { title: 'Product-led Certification', organization: 'Mind the Product', period: 'Apr 2023' },
    { title: 'Leadership and Personality', organization: 'Institut für Philosophie und Leadership', period: 'Mar 2022' },
    { title: 'Information Visualization: Getting Dashboards Right', organization: 'Interaction Design Foundation', period: 'Jan 2019' },
    { title: 'Conducting Usability Testing', organization: 'Interaction Design Foundation', period: 'Jan 2019' },
    { title: 'Web Design for Usability', organization: 'Interaction Design Foundation', period: 'Jun 2018' },
    { title: "Design Thinking: The Beginner’s Guide", organization: 'Interaction Design Foundation', period: 'Apr 2018' },
    { title: "User Experience: The Beginner’s Guide", organization: 'Interaction Design Foundation', period: 'Apr 2018' },
    { title: 'Certificate of Membership', organization: 'Interaction Design Foundation', period: 'Apr 2018' },
  ],
  projects: [
    { title: 'EXIST Research Transfer', organization: 'Fraunhofer IGCV', period: 'Sep 2020 – Mar 2022', description: 'Bringing a machine-learning startup idea to market.' },
    { title: 'Fraunhofer AHEAD Program', organization: 'Fraunhofer Venture / Fraunhofer IGCV', period: 'Aug 2019 – Aug 2020', description: 'Joined the startup and technology transfer programme with colleagues from the OPM team.' },
    { title: 'Consulting · IT migration project support', organization: 'ponte consult e.V.', period: 'Jul 2017 – Sep 2017', description: 'Consulting for a financial institution: software testing, error analysis, data migration, business process analysis and work instructions.' },
    { title: 'Avanto Accelerator Programme', organization: 'BricKIT', period: 'Mar 2017 – Jun 2017', description: 'Developed the BricKIT startup idea in the accelerator, followed by two months in Palo Alto to exchange ideas, build connections and continue working on it.' },
    { title: 'Life Account / Pivo 2.0', organization: 'Demola · OP Palvelut Oy', period: 'Sep 2016 – Jan 2017', description: 'Mobile finance app concept, awarded best Demola project and licensed by the project partner for partial implementation.' },
    { title: 'Brandathon Oulu 2016', organization: '9solutions', period: 'Nov 2016', description: 'Won the two-day competition with audience research and a brand promise for a new personal safety product.' },
  ],
  volunteering: [
    { title: 'Co-Founder & Organizer', organization: 'InnoWeekend', period: 'Mar 2018 – Present', description: 'Annual three-day event bringing together students, mentors and local companies to learn startup methods and develop business ideas.' },
    { title: 'Marketing Volunteer · Filmmaking & Social Media', organization: 'Polar Bear Pitching', period: 'Nov 2016 – Feb 2017', description: 'Video and social media content, marketing concepts and startup outreach at Slush 2016 and other events.' },
  ],
  awards: [
    { title: 'Startup Weekend Oulu · Winner', organization: 'BricKIT', period: 'Feb 2017', description: 'Won the final pitch with an idea to turn images into 3D models and building instructions for construction brick sets.' },
    // LinkedIn's sections disagree on the month (Jan / Nov); use their common year.
    { title: 'Brandathon Oulu · Winner', organization: '9solutions', period: '2016', description: 'Awarded for audience analysis and developing a brand promise.' },
  ],
  skills: ['Product Management', 'Design', 'Filmmaking', 'Adobe Creative Suite', 'Teamwork', 'Public Presentations', 'Creative Conception', 'Social Media', 'Entrepreneurship', 'Marketing', 'Service Design', 'Team Leadership', 'Leadership', 'Artificial Intelligence (AI)', 'Computer Ethics', 'Generative AI'],
  languages: [
    { name: 'German', level: 'Native / bilingual proficiency' },
    { name: 'English', level: 'Professional working proficiency' },
    { name: 'French', level: 'Elementary proficiency' },
  ],
}
