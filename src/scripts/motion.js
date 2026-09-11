/*
 * Movimiento de la página. Todo en un único sitio, a propósito: buscar por qué
 * se mueve algo debería ser abrir un archivo, no rastrear seis componentes.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- Menú lateral: sección activa ----------
   Esto no es decoración, es orientación: marca dónde estás. Funciona también
   con el movimiento reducido, porque cambiar de color no marea a nadie. */
function initScrollSpy() {
  const links = [...document.querySelectorAll('[data-nav-link]')];

  const setActive = (id) => {
    links.forEach((link) => {
      const isCurrent = link.getAttribute('href') === `#${id}`;
      // aria-current comunica el estado; la clase sola no lo haría.
      if (isCurrent) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  links.forEach((link) => {
    const id = link.getAttribute('href')?.slice(1);
    const section = id && document.getElementById(id);
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      end: 'bottom 40%',
      onToggle: (self) => self.isActive && setActive(id),
    });
  });
}

/* ---------- Anclajes con desplazamiento suave ---------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href')?.slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      gsap.to(window, {
        duration: 0.9,
        ease: 'power3.inOut',
        scrollTo: { y: target, offsetY: 80 },
      });
    });
  });
}

/* ---------- Hero: el titular entra palabra a palabra ---------- */
function initHero() {
  const headline = document.querySelector('[data-hero-headline]');
  if (!headline) return;

  // SplitText necesita las fuentes ya cargadas: si mide antes, parte mal.
  const split = new SplitText(headline, { type: 'words', wordsClass: 'hero__word' });

  gsap.from(split.words, {
    yPercent: 120,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: 0.08,
  });

  gsap.from('.hero__body > *', {
    y: 24,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    stagger: 0.12,
    delay: 0.35,
  });
}

/* ---------- Entradas escalonadas ----------
   Los elementos que comparten fila entran juntos, no uno detrás de otro:
   agrupar por posición vertical evita la cascada en diagonal, que en una
   rejilla de dos columnas se lee como un error. */
function initReveals() {
  const items = [...document.querySelectorAll('[data-reveal]')];
  const rows = new Map();

  items.forEach((item) => {
    const top = Math.round(item.getBoundingClientRect().top + window.scrollY);
    const key = Math.round(top / 40);
    if (!rows.has(key)) rows.set(key, []);
    rows.get(key).push(item);
  });

  rows.forEach((group) => {
    gsap.from(group, {
      y: 28,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.06,
      scrollTrigger: { trigger: group[0], start: 'top 88%' },
    });
  });
}

/* ---------- Collage de Work: parallax ---------- */
function initParallax() {
  document.querySelectorAll('[data-parallax]').forEach((element) => {
    gsap.fromTo(
      element,
      { yPercent: -4 },
      {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: true },
      }
    );
  });
}

/* ---------- Cronología: las reglas se dibujan al bajar ---------- */
function initTimeline() {
  document.querySelectorAll('[data-rule]').forEach((rule) => {
    gsap.from(rule, {
      scaleX: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: rule, start: 'top 90%' },
    });
  });
}

function init() {
  initScrollSpy();

  // A partir de aquí es todo movimiento: hay gente que se marea de verdad con
  // parallax y entradas animadas, así que con el ajuste del sistema activado
  // no se registra ninguna de estas animaciones.
  if (reduced.matches) return;

  initSmoothAnchors();
  initHero();
  initReveals();
  initParallax();
  initTimeline();
}

// Esperar a las fuentes: SplitText mide el texto, y medir con la tipografía de
// respaldo deja las palabras cortadas donde no toca.
if (document.fonts?.ready) {
  document.fonts.ready.then(init);
} else {
  window.addEventListener('load', init);
}
