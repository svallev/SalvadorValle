/*
 * Synthwave: lo que el CSS no puede hacer solo.
 *
 * - La escena del hero (cielo, estrellas, sol a franjas, cordillera y suelo de
 *   rejilla) es un fragment shader WebGL sin librerías, en un <canvas> detrás
 *   del contenido. El sol se coloca donde no hay texto: en las columnas vacías
 *   de la izquierda en escritorio y en la franja de cielo de arriba en móvil;
 *   el suelo empieza justo encima de las cifras. Se mide del DOM, así que
 *   sigue a la tipografía y al ancho.
 * - Invasores pixelados (dos fotogramas, animados en CSS) en los márgenes.
 * - Los rótulos de sección se encienden como un tubo de neón al entrar.
 * - El collage entra en bitono magenta/cian y recupera el color en el centro.
 *
 * Sin WebGL, o si se pierde el contexto, queda el respaldo CSS del tema. Con
 * movimiento reducido el shader pinta un solo fotograma y nada se mueve.
 *
 * `mount()` devuelve la función que lo deshace todo; la llama theme.js al
 * cambiar de tema.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LABELS = '.work__label, .caps__label, .clients__label, .talks__label, .bg__label';

/* ---------- Escena del hero ---------- */

const VERTEX = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

// Coordenadas: `uv` de 0 a 1 con y hacia arriba; `p` en alturas del lienzo,
// centrada, para que el sol sea redondo a cualquier proporción.
const FRAGMENT = `
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;
uniform float uHorizon;
uniform float uRidge;
uniform vec2 uSun;
uniform float uSunR;
uniform vec2 uPointer;
uniform float uScale;

const vec3 NIGHT = vec3(0.051, 0.008, 0.129);
const vec3 DEEP = vec3(0.082, 0.0, 0.188);
const vec3 PINK = vec3(1.0, 0.18, 0.59);
const vec3 CYAN = vec3(0.0, 0.9, 1.0);
const vec3 GOLD = vec3(1.0, 0.83, 0.1);

float hash(vec2 q) {
  return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  return mix(hash(vec2(i, 1.7)), hash(vec2(i + 1.0, 1.7)), f * f * (3.0 - 2.0 * f));
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y);
  float px = 1.0 / uRes.y;

  vec2 shift = uPointer * vec2(0.012, 0.006);
  vec2 sunC = uSun + shift - vec2(0.0, uScroll * uSunR * 0.7);

  // Cielo: magenta en el horizonte, violeta, noche arriba.
  float t = clamp((uv.y - uRidge) / (1.0 - uRidge), 0.0, 1.0);
  vec3 col = mix(vec3(0.45, 0.03, 0.34), vec3(0.17, 0.01, 0.33), smoothstep(0.0, 0.3, t));
  col = mix(col, NIGHT, smoothstep(0.25, 0.9, t));

  // Estrellas: una por celda de 34 px como mucho, con parpadeo propio.
  vec2 cell = floor(frag / 34.0);
  float r = hash(cell);
  if (r > 0.82) {
    vec2 at = (cell + 0.2 + 0.6 * vec2(hash(cell + 3.1), hash(cell + 7.7))) * 34.0;
    float d = length(frag - at);
    float tw = 0.55 + 0.45 * sin(uTime * (0.8 + r * 2.5) + r * 60.0);
    col += vec3(0.88, 0.82, 1.0) * smoothstep(1.6, 0.0, d) * tw * smoothstep(0.05, 0.5, t);
  }

  // Sol: degradado oro→rosa, franjas que se abren hacia abajo y bajan despacio.
  float sd = length(p - sunC);
  float sy = (p.y - sunC.y) / uSunR;
  vec3 sunCol = mix(PINK, mix(vec3(1.0, 0.42, 0.21), GOLD, smoothstep(0.35, 0.95, sy)), smoothstep(-0.3, 0.45, sy));
  float stripe = fract(sy * 7.0 + uTime * 0.12);
  float gap = clamp((0.6 - sy) * 0.55, 0.0, 0.7);
  float body = smoothstep(uSunR, uSunR - 1.5 * px, sd) * smoothstep(gap, gap + 0.06, stripe);
  float glow = exp(-max(sd - uSunR, 0.0) / (uSunR * 0.55));
  col += sunCol * glow * 0.42;
  col = mix(col, sunCol, body);

  // Cordillera: silueta con filo rosa por delante del sol.
  // En píxeles CSS (uScale): la misma sierra en un hero de 900 que de 1500.
  float hx = frag.x / uScale / 170.0 + 7.0;
  float ridgeH = (noise(hx) * 0.6 + noise(hx * 2.3) * 0.3 + noise(hx * 5.1) * 0.1);
  float lift = (26.0 + 30.0 * smoothstep(0.0, uSunR * 2.5, abs(p.x - sunC.x))) * uScale / uRes.y;
  ridgeH = uRidge + ridgeH * lift;
  float edge = uv.y - ridgeH;
  if (edge < 0.0) {
    float land = clamp((ridgeH - uv.y) / max(ridgeH - uHorizon, 0.001), 0.0, 1.0);
    col = mix(vec3(0.11, 0.0, 0.2), NIGHT, smoothstep(0.0, 0.6, land));
  }
  col += PINK * smoothstep(2.5 * px, 0.0, abs(edge)) * 0.9;
  col += PINK * exp(-abs(edge) / (14.0 * px)) * 0.18;

  // Suelo: rejilla en perspectiva que avanza hacia quien mira.
  if (uv.y < uHorizon) {
    float y = uHorizon - uv.y;
    float z = 0.09 / y;
    vec2 g = vec2((p.x - shift.x * 4.0) * z * 6.0, z * 6.0 + uTime * (0.9 + uScroll * 1.6));
    vec2 w = fwidth(g);
    vec2 a = abs(fract(g - 0.5) - 0.5) / max(w, 1e-4);
    float line = 1.0 - min(min(a.x, a.y), 1.0);
    float halo = 1.0 - min(min(a.x, a.y) / 5.0, 1.0);
    float near = smoothstep(0.0, uHorizon, y);
    vec3 lc = mix(PINK, CYAN, smoothstep(0.0, 0.7, near));
    float fade = smoothstep(0.0, 0.05, y);
    col = mix(DEEP * 0.7, NIGHT, near);
    col += lc * (line * 0.85 + halo * 0.18) * fade;
  }

  // Línea del horizonte encendida.
  col += PINK * exp(-abs(uv.y - uHorizon) / (5.0 * px)) * 0.6;

  // Al pie el hero se funde con la página, y unas scanlines muy suaves.
  col = mix(col, NIGHT, smoothstep(uHorizon * 0.3, 0.0, uv.y));
  col *= 0.95 + 0.05 * sin(frag.y * 3.14159);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function mountScene(hero, { reduced, mobile }) {
  const canvas = document.createElement('canvas');
  canvas.className = 'sw-scene';
  canvas.setAttribute('aria-hidden', 'true');

  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl || !gl.getExtension('OES_standard_derivatives')) return () => {};

  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vs || !fs) return () => {};

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return () => {};
  gl.useProgram(program);

  // Un triángulo que cubre todo el lienzo.
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const attr = gl.getAttribLocation(program, 'a');
  gl.enableVertexAttribArray(attr);
  gl.vertexAttribPointer(attr, 2, gl.FLOAT, false, 0, 0);

  const u = Object.fromEntries(
    ['uRes', 'uTime', 'uScroll', 'uHorizon', 'uRidge', 'uSun', 'uSunR', 'uPointer', 'uScale'].map((name) => [
      name,
      gl.getUniformLocation(program, name),
    ])
  );

  hero.prepend(canvas);
  hero.classList.add('sw-gl');

  const state = { scroll: 0, pointer: [0, 0], target: [0, 0] };
  const scale = mobile ? Math.min(devicePixelRatio, 2) * 0.6 : Math.min(devicePixelRatio, 1.5);

  // Dónde va cada cosa, medido del DOM y pasado a fracciones del lienzo.
  const layout = () => {
    const box = hero.getBoundingClientRect();
    const content = hero.querySelector('.hero__content')?.getBoundingClientRect();
    const stats = hero.querySelector('.hero__stats')?.getBoundingClientRect();
    const headline = hero.querySelector('.hero__headline')?.getBoundingClientRect();
    if (!box.height || !content || !stats || !headline) return;

    canvas.width = Math.round(box.width * scale);
    canvas.height = Math.round(box.height * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);

    const fromBottom = (y) => (box.bottom - y) / box.height;
    const toP = (x) => (x - box.left - box.width / 2) / box.height;
    const horizon = fromBottom(stats.top - 36);
    const gutter = content.left - box.left;

    let ridge;
    let sunX;
    let sunR;
    if (gutter > 160) {
      // Escritorio y 720-1024: el sol en las columnas vacías, sobre el horizonte.
      ridge = horizon;
      sunX = toP(box.left + gutter * 0.5);
      sunR = Math.min(gutter * 0.42, box.height * 0.2) / box.height;
    } else {
      // Móvil: franja de cielo encima del nombre, con la cordillera debajo.
      ridge = fromBottom(headline.top - 40);
      sunX = 0;
      sunR = Math.min(box.width * 0.3, (headline.top - box.top) * 0.75) / box.height;
    }

    gl.uniform2f(u.uRes, canvas.width, canvas.height);
    gl.uniform1f(u.uScale, canvas.width / box.width);
    gl.uniform1f(u.uHorizon, horizon);
    gl.uniform1f(u.uRidge, ridge);
    gl.uniform2f(u.uSun, sunX, ridge + sunR * 0.3);
    gl.uniform1f(u.uSunR, sunR);
  };

  const start = performance.now();
  const draw = () => {
    state.pointer[0] += (state.target[0] - state.pointer[0]) * 0.06;
    state.pointer[1] += (state.target[1] - state.pointer[1]) * 0.06;
    gl.uniform1f(u.uTime, reduced ? 6 : (performance.now() - start) / 1000);
    gl.uniform1f(u.uScroll, state.scroll);
    gl.uniform2f(u.uPointer, state.pointer[0], state.pointer[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  let frame;
  let visible = true;
  const loop = () => {
    draw();
    frame = requestAnimationFrame(loop);
  };
  const play = () => {
    if (reduced || frame || !visible || document.hidden) return;
    frame = requestAnimationFrame(loop);
  };
  const pause = () => {
    cancelAnimationFrame(frame);
    frame = undefined;
  };

  const resize = new ResizeObserver(() => {
    layout();
    draw();
  });
  resize.observe(hero);

  const seen = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? play() : pause();
  });
  seen.observe(hero);

  const onVisibility = () => (document.hidden ? pause() : play());
  document.addEventListener('visibilitychange', onVisibility);

  const onPointer = (event) => {
    state.target = [(event.clientX / innerWidth) * 2 - 1, (event.clientY / innerHeight) * 2 - 1];
  };
  const finePointer = matchMedia('(hover: hover)').matches && !reduced;
  if (finePointer) addEventListener('pointermove', onPointer, { passive: true });

  // El sol se hunde y la rejilla acelera mientras el hero sale de pantalla.
  const trigger = reduced
    ? null
    : ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => (state.scroll = self.progress),
      });

  const teardown = () => {
    pause();
    resize.disconnect();
    seen.disconnect();
    trigger?.kill();
    document.removeEventListener('visibilitychange', onVisibility);
    removeEventListener('pointermove', onPointer);
    canvas.remove();
    hero.classList.remove('sw-gl');
  };

  // Si el sistema reclama la GPU, se vuelve al respaldo CSS.
  canvas.addEventListener('webglcontextlost', teardown, { once: true });

  layout();
  draw();
  play();
  return teardown;
}

/* ---------- Invasores ----------
   Dos fotogramas de 11 × 8 píxeles; `#` es píxel encendido. Criaturas propias,
   no las de ningún juego. */

const SPRITES = [
  [
    ['...#...#...', '....###....', '..#######..', '.##.###.##.', '###########', '#.#######.#', '#.#.....#.#', '...##.##...'],
    ['...#...#...', '#...###...#', '#.#######.#', '###.###.###', '###########', '.#########.', '..#.....#..', '.#.......#.'],
  ],
  [
    ['....###....', '..#######..', '.#########.', '##..###..##', '###########', '..##...##..', '.##.###.##.', '##.......##'],
    ['....###....', '..#######..', '.#########.', '##..###..##', '###########', '...#...#...', '..#.###.#..', '.#.#...#.#.'],
  ],
];

const pixels = (rows) =>
  rows
    .flatMap((row, y) => [...row].map((c, x) => (c === '#' ? `M${x} ${y}h1v1h-1z` : '')))
    .join('');

function makeInvader(kind, { size, ...position }) {
  const [a, b] = SPRITES[kind];
  const el = document.createElement('div');
  el.className = 'sw-invader';
  el.setAttribute('aria-hidden', 'true');
  el.style.setProperty('--size', `${size}px`);
  Object.entries(position).forEach(([key, value]) => (el.style[key] = value));
  el.innerHTML = `<svg viewBox="0 0 11 8" shape-rendering="crispEdges"><path class="sw-invader__a" d="${pixels(a)}"/><path class="sw-invader__b" d="${pixels(b)}"/></svg>`;
  return el;
}

// Sección, criatura y sitio. En los márgenes, donde no hay texto.
const INVADERS = {
  desktop: [
    ['.caps', 0, { top: '14%', right: '3%', size: 44 }],
    ['.caps', 1, { bottom: '22%', left: '4%', size: 34 }],
    ['.talks', 1, { top: '6%', right: '6%', size: 38 }],
    ['.bg', 0, { top: '40%', left: '5%', size: 30 }],
  ],
  mobile: [
    ['.caps', 0, { top: '22px', right: '16px', size: 30 }],
    ['.talks', 1, { top: '20px', right: '16px', size: 28 }],
  ],
};

/* ---------- Montaje ---------- */

export function mount() {
  const hero = document.querySelector('.hero');
  if (!hero) return () => {};

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = matchMedia('(max-width: 719.98px)').matches;

  const unmountScene = mountScene(hero, { reduced, mobile });

  const invaders = INVADERS[mobile ? 'mobile' : 'desktop']
    .map(([selector, kind, spot]) => {
      const section = document.querySelector(selector);
      if (!section) return null;
      const invader = makeInvader(kind, spot);
      section.prepend(invader);
      return invader;
    })
    .filter(Boolean);

  // Rótulos: apagados hasta que entran en pantalla; luego parpadean y quedan
  // encendidos. Con movimiento reducido se quedan encendidos desde el principio.
  const labels = [...document.querySelectorAll(LABELS)];
  let lights;
  if (!reduced) {
    labels.forEach((label) => (label.dataset.swNeon = 'off'));
    lights = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dataset.swNeon = 'on';
          lights.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -15% 0px' }
    );
    labels.forEach((label) => lights.observe(label));
  }

  const collage = document.querySelector('.work__collage');
  const ctx = gsap.context(() => {
    if (reduced || !collage) return;
    gsap.fromTo(
      collage,
      { '--sw-tint': 1, '--sw-gray': 1 },
      {
        '--sw-tint': 0,
        '--sw-gray': 0,
        ease: 'none',
        scrollTrigger: { trigger: collage, start: 'top 75%', end: 'center 50%', scrub: true },
      }
    );
  });

  return () => {
    unmountScene();
    invaders.forEach((invader) => invader.remove());
    lights?.disconnect();
    labels.forEach((label) => delete label.dataset.swNeon);
    ctx.revert();
    collage?.style.removeProperty('--sw-tint');
    collage?.style.removeProperty('--sw-gray');
  };
}
