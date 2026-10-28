/*
 * Neobrutalist: lo que el CSS no puede hacer solo.
 *
 * - Monedas «SV» en el hero, como las de Gumroad: un disco con canto en 3D que
 *   gira y flota. Son decoración (aria-hidden), se crean al activar el tema y
 *   se quitan al salir de él: el HTML de la página no cambia.
 * - El collage de Work entra en bitono azul y recupera el color según llega
 *   al centro de la pantalla.
 *
 * Con movimiento reducido las monedas aparecen quietas e inclinadas y el
 * collage se queda en bitono: nada gira ni depende del scroll.
 *
 * `mount()` devuelve la función que lo deshace todo; la llama theme.js al
 * cambiar de tema.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Posición dentro del hero, tamaño, profundidad del canto e inclinación.
// Las de escritorio van en el hueco a la derecha del nombre y en el margen
// izquierdo bajo el menú; ninguna pisa texto.
const COINS = {
  desktop: [
    { top: '4%', right: '-7%', size: 200, tilt: 18 },
    { top: '46%', left: '3%', size: 130, tilt: -22 },
    { bottom: '6%', left: '12%', size: 90, tilt: 30 },
  ],
  mobile: [{ top: '4%', right: '-16%', size: 120, tilt: 16 }],
};

const EDGE_LAYERS = 10;

function makeCoin({ size, tilt, ...position }) {
  const depth = Math.round(size * 0.16);
  const coin = document.createElement('div');
  coin.className = 'nb-coin';
  coin.setAttribute('aria-hidden', 'true');
  coin.style.setProperty('--size', `${size}px`);
  coin.style.setProperty('--depth', `${depth}px`);
  coin.style.setProperty('--tilt', `${tilt}deg`);
  Object.entries(position).forEach(([key, value]) => (coin.style[key] = value));

  const body = document.createElement('div');
  body.className = 'nb-coin__body';

  for (let i = 0; i < EDGE_LAYERS; i++) {
    const edge = document.createElement('div');
    edge.className = 'nb-coin__edge';
    edge.style.transform = `translateZ(${-depth / 2 + (depth * i) / (EDGE_LAYERS - 1)}px)`;
    body.append(edge);
  }

  ['front', 'back'].forEach((side) => {
    const face = document.createElement('div');
    face.className = `nb-coin__face nb-coin__face--${side}`;
    face.textContent = 'SV';
    body.append(face);
  });

  coin.append(body);
  return coin;
}

export function mount() {
  const hero = document.querySelector('.hero');
  const collage = document.querySelector('.work__collage');
  if (!hero) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.matchMedia('(max-width: 719.98px)').matches;

  const coins = COINS[mobile ? 'mobile' : 'desktop'].map(makeCoin);
  hero.prepend(...coins);

  const ctx = gsap.context(() => {
    if (reduced) {
      coins.forEach((coin) => gsap.set(coin.firstChild, { rotationY: -28 }));
      return;
    }

    // Cada moneda gira a su ritmo y flota arriba y abajo, desfasadas.
    coins.forEach((coin, i) => {
      const body = coin.firstChild;
      gsap.fromTo(
        body,
        { rotationY: -40 + i * 50 },
        { rotationY: `+=360`, duration: 7 + i * 2, ease: 'none', repeat: -1 }
      );
      gsap.to(coin, {
        y: i % 2 ? 14 : -14,
        duration: 2.4 + i * 0.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    });

    // Las monedas se alejan un poco al bajar: el hero se queda atrás.
    gsap.to(coins, {
      yPercent: -60,
      ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });

    if (collage) {
      gsap.fromTo(
        collage,
        { '--nb-tint': 1, '--nb-gray': 1 },
        {
          '--nb-tint': 0,
          '--nb-gray': 0,
          ease: 'none',
          scrollTrigger: { trigger: collage, start: 'top 75%', end: 'center 50%', scrub: true },
        }
      );
    }
  });

  return () => {
    ctx.revert();
    coins.forEach((coin) => coin.remove());
    collage?.style.removeProperty('--nb-tint');
    collage?.style.removeProperty('--nb-gray');
  };
}
