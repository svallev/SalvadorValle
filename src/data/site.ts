/*
 * Textos sueltos del artboard que no justifican una colección propia:
 * navegación, hero, citas de cierre y pie.
 */

export const site = {
  name: 'Salvador Valle',
  role: 'Product Design Director',
  description:
    'Product and UX Design Director. Designing global-scale products and leading high-performance teams for over 30 years.',
  email: 'salvador.valle@gmail.com',
  // País de residencia, para /agents/ y los datos estructurados.
  location: 'Spain',
};

export const nav = [
  { label: 'Hi', href: '#hi' },
  { label: 'Work', href: '#work' },
  { label: 'Talks & Writing', href: '#talks' },
  { label: 'Background', href: '#background' },
  { label: 'Contact', href: '#contact' },
];

export const hero = {
  // El titular se parte en tramos para colorear el punto final.
  headline: [
    { text: 'Salvador Valle', accent: false },
    { text: '.', accent: true },
  ],
  // El saludo abre la primera línea de la entradilla con peso y color propios.
  greeting: 'Hi!,',
  intro: [
    'nice to meet you I’m Salva,',
    'Product and UX Design Director at Harbiz, frog, Hamon, Isobar, BBVA,...',
    'Based (today) in a small town close to the mountains in Spain.',
  ],
  claim: 'Designing global-scale products and leading high-performance teams for over 30 years.',
  // Cifras clave bajo el claim. `value` es el valor final y lo que cuenta el
  // contador (con `decimals` decimales); `prefix` va en tinta y `unit` en
  // acento. La unidad lleva su espacio delante cuando hace falta. `fact` es la
  // misma cifra en tercera persona y con su contexto, para /agents/: un agente
  // cita frases sueltas y «60 people in 2 countries» no dice de quién habla.
  stats: [
    {
      value: 60,
      decimals: 0,
      prefix: '',
      unit: '',
      label: 'people in 2 countries — the largest design team I’ve managed.',
      fact: 'Has managed design teams of up to 60 people across 2 countries.',
    },
    {
      value: 85,
      decimals: 0,
      prefix: '',
      unit: '%',
      label: 'of BBVA employees actively used The Ninja Project. The target was 5%.',
      fact: 'Worked on The Ninja Project at BBVA, which 85% of BBVA employees actively used against a target of 5%.',
    },
    {
      value: 3.5,
      decimals: 1,
      prefix: '€',
      unit: 'M',
      label: 'the largest project budget I’ve had an impact on.',
      fact: 'Has had an impact on project budgets of up to €3.5M.',
    },
    {
      value: 10,
      decimals: 0,
      prefix: '',
      unit: ' yrs',
      label:
        'a feature I proposed and designed has gone unchanged; the only one in a catalog of 500+.',
      fact: 'Proposed and designed a feature that has stayed unchanged for 10 years, the only one in a catalog of 500+.',
    },
  ],
};

export const sections = {
  work: { label: 'Recent projects' },
  capabilities: {
    label: 'What I actually run',
    quote: '— Design Management is a job of decisions, not deliverables.',
  },
  clients: { label: 'Top tier clients' },
  talks: {
    label: 'Talks & Writing',
    talksLabel: 'Talks',
    writingsLabel: 'Writings',
    intro:
      "— For 30 years now, I’ve been fortunate to share knowledge and, above all, learn at numerous events — in design, product, and technology — covering everything from the small details of building a digital product to design and product strategy.",
    quote: '— I talk and write mostly about prototyping the future early.',
  },
  background: {
    label: 'Background',
    closing:
      '— I started in graphic arts and desktop publishing, taught it for three years, and moved into digital when the web was still an experiment. Since then: agencies, product companies and technology consultancies — as designer, art director, creative director, UX consultant and, for the last decade, as director. What I care about now is integrating product design with emerging technology and the methodologies that make a team fast without making it careless.',
    contact:
      "If you’d like to know more about any of these projects, collaborate, or just chat for a bit about design, product or innovation, don’t hesitate to reach out and let’s talk. —",
  },
};

export const footer = {
  // El año sale del build: se actualiza solo al volver a desplegar.
  copyright: `© ${new Date().getFullYear()} Salvador Valle`,
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/salvadorvalle/' },
    { label: 'GitHub', href: 'https://github.com/svallev' },
    { label: 'Linktree', href: 'https://linktr.ee/salvadorvalle' },
  ],
};
