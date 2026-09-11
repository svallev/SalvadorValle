# Salvador Valle — Portfolio

Personal portfolio of Salvador Valle, Product Design Director.
A single static page, built from the Penpot/Figma design (`Desktop - 5`).

**Live:** _pendiente de dominio_

---

## Stack

| Qué | Con qué | Por qué |
|---|---|---|
| Framework | [Astro](https://astro.build) | HTML estático, cero JS por defecto |
| Estilos | CSS propio + tokens | Sin framework: el diseño ya tiene su sistema |
| Animación | [GSAP](https://gsap.com) + ScrollTrigger | Licencia gratuita, incluidos los plugins |
| Contenido | Markdown (content collections) | Se edita sin tocar código, versionado en git |
| Hosting | Vercel | Deploy automático por push |

No hay CMS ni base de datos, y es deliberado: el contenido cambia pocas veces al año
y un archivo de texto en el repositorio es más rápido de editar que un panel.

## Arrancar en local

Requiere **Node 20+** y **pnpm**.

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

Otros comandos:

```bash
pnpm build      # genera dist/
pnpm preview    # sirve dist/ como en producción
```

---

## Editar el contenido

Todo el texto vive en `src/content/`. **Para cambiar una frase no hace falta abrir
ni un solo archivo de código.** Cada archivo `.md` es una entrada; el campo `order`
decide en qué posición sale.

### Añadir un proyecto

Crea `src/content/projects/mi-proyecto.md`:

```markdown
---
title: "Nombre del proyecto"
order: 9
---

La descripción que se lee bajo el título.
```

### Añadir una charla

Crea `src/content/talks/mi-charla.md`. El `youtubeId` es **solo el identificador**
del vídeo, no la URL entera: en `https://www.youtube.com/watch?v=AbCdEf12345`
el id es `AbCdEf12345`.

```markdown
---
title: "Nombre de la charla"
order: 5
youtubeId: "AbCdEf12345"
---

De qué iba la charla.
```

Sin `youtubeId` la charla se muestra pero no abre reproductor. Al pulsarla, el
vídeo se abre en una ventana sobre la propia página.

### Añadir un escrito

Crea `src/content/writings/mi-post.md`. Los escritos abren en pestaña nueva.

```markdown
---
title: "Título del artículo"
order: 6
url: "https://medium.com/..."
---
```

### El resto

- `src/content/background/` — las etapas profesionales, con sus puestos
- `src/content/capabilities/` — los bloques de «What I actually run»
- `src/data/clients.json` — los nombres de clientes
- `src/data/site.ts` — navegación, hero, citas y pie

---

## Imágenes

Van en **`src/assets/`**, no en `public/`. Ahí Astro las convierte a WebP/AVIF y
genera varios tamaños en cada build. Los originales pesan varios MB; servidos tal
cual harían la página inusable.

`public/` es solo para lo que debe servirse sin tocar: tipografías y favicon.

## Tipografías

Las tres se sirven desde el propio dominio, sin llamadas a Google ni a nadie.

- **Satoshi** — Indian Type Foundry vía [Fontshare](https://www.fontshare.com/fonts/satoshi).
  Gratuita para uso comercial, pero **no se pueden redistribuir los archivos sueltos**.
- **Advent Pro** y **Libre Barcode 128 Text** — Google Fonts, licencia OFL.

## Despliegue

Push a `main` y Vercel publica. Cada rama genera su propia previsualización.

## Estructura

```
src/
  components/     una sección de la página cada uno
  content/        el contenido editable (Markdown)
  data/           textos sueltos y lista de clientes
  layouts/        <head>, metadatos, tipografías
  pages/          index.astro compone las secciones
  scripts/        motion.js (GSAP) y video-modal.js
  styles/         tokens.css (el design system) y global.css
public/fonts/     las tres tipografías en woff2
```

Los valores del diseño —color, tipografía, rejilla de 12 columnas— están en
`src/styles/tokens.css`. Si algo no cuadra con el Penpot, manda el Penpot.
