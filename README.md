# Salvador Valle — Portfolio

Personal portfolio of Salvador Valle, Product Design Director.
A single static page, built from the Penpot/Figma design (`Desktop - 5`).

**Live:** https://salvadorvalle.vercel.app/

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

Requiere **Node 24** (Astro 7 pide 22.12 o superior) y **pnpm 11**. La versión de
pnpm está fijada en `packageManager` de `package.json`; con Corepack activado
(`corepack enable`) se usa sola.

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

Otros comandos:

```bash
pnpm build      # genera dist/
pnpm preview    # sirve dist/ como en producción
pnpm check      # comprobación de tipos (astro check)
```

La primera vez, `dev` y `build` descargan la tipografía Satoshi (ver
[Tipografías](#tipografías)), así que hace falta conexión.

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

Crea `src/content/talks/mi-charla.md`. En `youtubeId` vale tanto el enlace copiado
de YouTube (`watch?v=`, `youtu.be/`, `shorts/`…) como el identificador suelto
(`AbCdEf12345`): al construir se queda solo con el identificador.

```markdown
---
title: "Nombre de la charla"
order: 5
youtubeId: "AbCdEf12345"
---

De qué iba la charla.
```

Si el título no está en inglés, añade `lang: "es"` (o el idioma que sea) para que
los lectores de pantalla lo pronuncien bien. Vale también para los escritos.

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
  Su licencia (ITF Free Font License) permite servirla desde la web propia, pero
  **no distribuir los archivos a través de un repositorio público**. Por eso no está
  en git: `scripts/fetch-fonts.mjs` la descarga de Fontshare antes de `dev` y
  `build` y la deja en `public/fonts/`, que la ignora. Si ya está en disco, no hace
  nada.
- **Advent Pro** y **Libre Barcode 128 Text** — Google Fonts, licencia OFL. Sus
  licencias están en `licenses/`.

## Despliegue

Push a `main` y Vercel publica. Cada rama genera su propia previsualización.

Configuración del proyecto en Vercel:

- Variable de entorno `ENABLE_EXPERIMENTAL_COREPACK=1` en todos los entornos. Sin
  ella Vercel usa pnpm 10, que ignora `allowBuilds` de `pnpm-workspace.yaml`.
- Node sale de `engines` en `package.json`.
- Las cabeceras de seguridad (CSP incluida) y la caché de las tipografías están en
  `vercel.json`. Si se añade algo que cargue de otro dominio, hay que abrirlo ahí.

### Dominio

`site` sale de la variable de sistema `VERCEL_PROJECT_PRODUCTION_URL`: el dominio
propio si lo hay y, si no, el `*.vercel.app`. Hoy es `salvadorvalle.vercel.app`, y es
la URL definitiva: se indexa. Solo las previsualizaciones llevan `noindex`.

Si más adelante hay dominio propio:

1. Vercel → Settings → Domains: añadir el dominio raíz y `www`, con `www`
   redirigiendo al raíz.
2. **Redeploy** de producción. Sin él, canonical, Open Graph, `robots.txt` y el
   sitemap siguen apuntando al `vercel.app`.
3. Redirigir `salvadorvalle.vercel.app` al dominio nuevo (también en Domains), para
   no dejar la misma página indexada en dos URL.
4. Google Search Console: verificar el dominio y enviar `/sitemap.xml`.

## Estructura

```
src/
  components/     una sección de la página cada uno
  content/        el contenido editable (Markdown)
  data/           textos sueltos y lista de clientes
  layouts/        <head>, metadatos, tipografías
  pages/          index.astro compone las secciones; también 404, robots.txt y sitemap.xml
  scripts/        motion.js (GSAP), video-modal.js y mobile-menu.js
  styles/         tokens.css (el design system) y global.css
public/fonts/     las tipografías en woff2 (Satoshi se descarga, no está en git)
scripts/          fetch-fonts.mjs
licenses/         licencias OFL de las tipografías incluidas
vercel.json       cabeceras de seguridad y caché
```

Los valores del diseño —color, tipografía, rejilla de 12 columnas— están en
`src/styles/tokens.css`. Si algo no cuadra con el Penpot, manda el Penpot.
