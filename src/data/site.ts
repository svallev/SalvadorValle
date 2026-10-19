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
