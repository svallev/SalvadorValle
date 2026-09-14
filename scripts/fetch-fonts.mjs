/*
 * Descarga Satoshi desde Fontshare antes de `dev` y `build`.
 *
 * La licencia de Satoshi (ITF Free Font License) permite servirla desde la web
 * propia, pero no distribuir los archivos a través de un repositorio público.
 * Por eso no están en git: se piden aquí y quedan en public/fonts/, ignorados.
 * Son los mismos archivos que ofrece el paquete oficial, byte a byte.
 *
 * Si ya están en disco no hace nada. Si la descarga falla, sale con error: es
 * preferible un build roto a publicar la web con la tipografía de respaldo.
 */

import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';

const CSS_URL = 'https://api.fontshare.com/v2/css?f[]=satoshi@1,2&display=swap';

const targets = {
  normal: 'public/fonts/Satoshi-Variable.woff2',
  italic: 'public/fonts/Satoshi-VariableItalic.woff2',
};

if (Object.values(targets).every((path) => existsSync(path))) process.exit(0);

const get = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} al pedir ${url}`);
  return response;
};

const css = await (await get(CSS_URL)).text();
await mkdir('public/fonts', { recursive: true });

for (const [style, path] of Object.entries(targets)) {
  const face = css
    .split('@font-face')
    .find((block) => new RegExp(`font-style:\\s*${style}`).test(block));
  const url = face?.match(/url\('([^']+\.woff2)'\)/)?.[1];
  if (!url) throw new Error(`Fontshare no devolvió el woff2 de Satoshi ${style}`);

  const font = Buffer.from(await (await get(new URL(url, CSS_URL))).arrayBuffer());
  await writeFile(path, font);
  console.log(`Satoshi ${style}: ${path} (${Math.round(font.length / 1024)} KB)`);
}
