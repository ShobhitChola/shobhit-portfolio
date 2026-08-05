// ─────────────────────────────────────────────────────────────
// Single source of truth for everything written on the site.
// Edit this file to update the portfolio content.
// ─────────────────────────────────────────────────────────────

export const LINKS = {
  github: 'https://github.com/ShobhitChola',
  leetcode: 'https://leetcode.com/u/crabhunters/',
  linkedin: 'https://www.linkedin.com/in/shobhitchola/',
  email: 'shobhit.chola.ug23@nsut.ac.in',
  phone: '+91 92054 71016',
  phoneHref: 'tel:+919205471016',
  resume: '/resume.pdf',
  aayulink: 'https://github.com/ShobhitChola/SIH-2025',
  salescode: 'https://salescode.ai',
}

export const NAV = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Work', href: '#work' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contact', href: '#contact' },
]

// * word *  → accent (lime)
// ~ word ~  → serif italic
export const ABOUT_STATEMENT =
  'I engineer *GenAI products* end-to-end: FastAPI backends, Kafka pipelines, ~real-time~ voice, and interfaces that feel ~alive.~ At *Salescode.ai,* I helped ship an AI sales coach used by field reps behind *60+ global brands.*'

export const SNAPSHOT = [
  { k: 'EDU', v: "B.Tech CSE (AI), NSUT '27" },
  { k: 'BASE', v: 'New Delhi, India' },
  { k: 'FOCUS', v: 'GenAI · Realtime · Full-stack' },
  { k: 'STATUS', v: 'Open to SDE / GenAI roles' },
]

export const STATS = [
  { value: 3, suffix: '+', label: 'years of building software', decimals: 0 },
  { value: 4, suffix: '', label: 'products built end-to-end', decimals: 0 },
  { value: 700, suffix: '+', label: 'DSA problems solved', decimals: 0 },
  { value: 20, suffix: '+', label: 'technologies in the arsenal', decimals: 0 },
]

export const OFFSTAGE = {
  band: 'RUDRADHWANI · FUSION ROCK',
  podiums: [
    { place: '2ND PLACE', event: 'Battle of the Bands', host: 'IIT Bombay', year: '2025' },
    { place: '3RD PLACE', event: 'Battle of the Bands', host: 'IIT Bombay', year: '2024' },
    { place: '2ND PLACE', event: 'Battle of the Bands', host: 'Ashoka University', year: '' },
  ],
}

export const EXPERIENCE = [
  {
    period: 'MAY 2026 → JUL 2026',
    role: 'GenAI Intern',
    org: 'Salescode.ai',
    orgLink: 'https://salescode.ai',
    loc: 'Gurugram, IN',
    points: [
      'Built for Sensei, the AI Sales Coach used to train and evaluate field sales reps on a live, multi-tenant production system.',
      'Shipped across backend, data pipelines and frontend: features used by real enterprise customers.',
      'Platform serves 60+ brands including Coca-Cola, ITC, Mars and Emami.',
    ],
    tech: ['FastAPI', 'PostgreSQL', 'Kafka', 'LiveKit', 'Langflow', 'Redis'],
  },
  {
    period: 'MAR 2025 → JUN 2025',
    role: 'MERN Stack Developer',
    org: 'Freelance',
    orgLink: null,
    loc: 'Remote',
    points: [
      'Built frontend + backend architecture for sKrapy, a startup digitizing the scrap management ecosystem with vendor verification and order processing.',
      'Independently shipped a digital marketing platform for a US-based client, collaborating with a creative team on branding, logos and video.',
    ],
    tech: ['MongoDB', 'Express', 'React', 'Node.js'],
  },
]

export const PROJECTS = [
  {
    id: 'sensei',
    index: '01',
    title: 'SENSEI',
    subtitle: 'AI Sales Coach · Salescode.ai',
    year: '2026',
    desc: 'AI-generated courses, real-time voice practice over LiveKit, and Kafka-driven post-call scoring with scorecards & leaderboards. Multi-tenant RLS, RBAC, push + in-app notifications.',
    tags: ['FastAPI', 'PostgreSQL', 'LiveKit', 'Kafka', 'Langflow', 'Redis'],
    link: 'https://salescode.ai',
    linkLabel: 'In production',
    monogram: 'S',
    gradient: 'linear-gradient(135deg, #14101f 0%, #7c5cff 55%, #56e1ff 100%)',
  },
  {
    id: 'aayulink',
    index: '02',
    title: 'AAYULINK',
    subtitle: 'Digital medical identity · SIH',
    year: '2025',
    desc: 'Real-time MDR pathogen tracing, infection control and record sync across hospitals. Fault-tolerant ingestion at 99.8% reliability with 60% lower media latency.',
    tags: ['Node.js', 'MongoDB', 'Cloudinary', 'React'],
    link: 'https://github.com/ShobhitChola/SIH-2025',
    linkLabel: 'GitHub',
    monogram: 'A',
    gradient: 'linear-gradient(135deg, #06201f 0%, #0f766e 55%, #56e1ff 100%)',
  },
  {
    id: 'skrapy',
    index: '03',
    title: 'SKRAPY',
    subtitle: 'Scrap-tech startup platform',
    year: '2025',
    desc: 'Digitizing the scrap management ecosystem: robust vendor verification flows and order processing, built with a small remote team.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
    link: null,
    linkLabel: 'Startup build',
    monogram: 'K',
    gradient: 'linear-gradient(135deg, #0a1c0f 0%, #3f6212 55%, #d4ff4f 100%)',
  },
  {
    id: 'digitizeom',
    index: '04',
    title: 'digitizeOM',
    subtitle: 'Marketing platform · US client',
    year: '2025',
    desc: 'Independently developed and deployed a digital marketing platform, working alongside animators on brand identity, logos and video.',
    tags: ['MERN', 'Deployment', 'Branding'],
    link: null,
    linkLabel: 'Client work',
    monogram: 'D',
    gradient: 'linear-gradient(135deg, #200a18 0%, #c026d3 55%, #fb7185 100%)',
  },
]

export const STACK = [
  {
    group: 'LANGUAGES',
    items: ['TypeScript', 'JavaScript', 'Python', 'C++', 'Java', 'SQL'],
  },
  {
    group: 'BACKEND',
    items: ['Node.js', 'Express', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Redis', 'Kafka'],
  },
  {
    group: 'FRONTEND',
    items: ['React', 'Next.js', 'Three.js', 'GSAP', 'Tailwind CSS'],
  },
  {
    group: 'AI × REALTIME',
    items: ['Langflow', 'LiveKit', 'SSE', 'Redis Pub/Sub', 'FCM', 'Cloudinary', 'RLS / RBAC'],
  },
]

export const MARQUEE_ITEMS = [
  'GENAI ENGINEERING',
  'FULL-STACK',
  'REAL-TIME VOICE AI',
  'KAFKA PIPELINES',
  '700+ DSA SOLVED',
]
