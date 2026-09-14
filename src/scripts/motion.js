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
  const spies = [];

  // Cada sección tiene dos enlaces, el del menú lateral y el del móvil: se
  // marcan por destino, no por elemento, para que ninguno le quite el estado
  // al otro.
  const setActive = (active) => {
    const href = active.getAttribute('href');
    links.forEach((link) => {
      // aria-current comunica el estado; la clase sola no lo haría.
      if (link.getAttribute('href') === href) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  // Contact es un párrafo corto dentro de Background y le siguen la firma y el
  // pie: nunca llega a cruzar la línea del 40 %. Por eso su tramo dura hasta el
  // final de la página, y al tocar fondo se marca siempre el último enlace.
  // Si hay varios tramos activos a la vez gana el último del menú, que es el
  // más concreto (Contact está dentro de Background).
  const update = () => {
    const root = document.documentElement;
    const atEnd = window.scrollY + window.innerHeight >= root.scrollHeight - 2;
    const active = atEnd ? spies.at(-1) : spies.findLast((spy) => spy.trigger.isActive);
    if (active) setActive(active.link);
  };

  links.forEach((link, index) => {
    const id = link.getAttribute('href')?.slice(1);
    const section = id && document.getElementById(id);
    if (!section) return;

    const isLast = index === links.length - 1;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',
      end: isLast ? 'max' : 'bottom 40%',
      onToggle: update,
    });
    spies.push({ link, trigger });
  });

  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update });
  // Los onToggle del arranque llegan antes de que `spies` esté completo.
  ScrollTrigger.addEventListener('refresh', update);
  update();
}

/* ---------- Anclajes ----------
   Lo que se alinea es el rótulo de la sección, no su borde: las secciones
   llevan relleno por arriba (120 px en Talks y Background) y el rótulo caería
   muy abajo. Queda a la altura de la cabecera, que coincide con el margen de
   la rejilla (--grid-margin, 40 px a 1440 y mayor en pantallas grandes: se
   lee del padding real de la cabecera en vez de asumir 40). En móvil la
   cabecera es opaca (64 px más 24 de degradado) y taparía el rótulo: ahí
   queda a 96 px, un valor fijo porque --k no cambia por debajo de 1920.
   «Hi» es el principio de la página y va arriba del todo. Con movimiento
   reducido el salto es instantáneo, pero al mismo sitio. */
function initAnchors() {
  const mobile = window.matchMedia('(max-width: 719.98px)');
  const header = document.querySelector('.header');

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href')?.slice(1);
      const target = id && document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      const desktopOffset = header ? parseFloat(getComputedStyle(header).paddingLeft) : 40;
      gsap.to(window, {
        duration: reduced.matches ? 0 : 0.9,
        ease: 'power3.inOut',
        scrollTo:
          id === 'hi'
            ? 0
            : {
                y: target.querySelector(':scope > h2') ?? target,
                offsetY: mobile.matches ? 96 : desktopOffset,
              },
        // Al anular el salto del navegador se pierde también lo que hacía por
        // debajo: llevar el foco a la sección y poner el ancla en la URL. Sin
        // lo primero, quien navega con teclado sigue en el menú tras pulsarlo.
        onComplete: () => {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          history.replaceState(null, '', `#${id}`);
        },
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

/* ---------- Collage de Work: parallax ----------
   El recorrido sale del relleno de la figura, no de su altura. El collage es
   más alto que ancho y crece con la pantalla: un porcentaje de su altura pasa
   de los 80 px de aire a partir de 1440 y a 2560 ya se montaba sobre los
   textos de arriba y de abajo. Quedándose dentro del relleno, nunca los toca. */
function initParallax() {
  document.querySelectorAll('[data-parallax]').forEach((element) => {
    const travel = () => parseFloat(getComputedStyle(element).paddingTop) * 0.75;

    gsap.fromTo(
      element,
      { y: () => -travel() },
      {
        y: travel,
        ease: 'none',
        scrollTrigger: {
          trigger: element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          // El relleno cambia en los cortes de 1024 y 720.
          invalidateOnRefresh: true,
        },
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
  initAnchors();

  // A partir de aquí es todo movimiento: hay gente que se marea de verdad con
  // parallax y entradas animadas, así que con el ajuste del sistema activado
  // no se registra ninguna de estas animaciones.
  if (reduced.matches) return;

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
