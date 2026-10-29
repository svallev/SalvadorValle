/*
 * Selector de tema de la cabecera.
 *
 * El tema es solo el atributo `data-theme` de <html>: cada archivo de
 * src/styles/themes/ cuelga de él. public/theme-init.js lo pone antes de
 * pintar; aquí se cambia al elegir, se guarda y se avisa con `themechange`
 * para que motion.js vuelva a medir (otra tipografía, otros tamaños).
 *
 * «Just for agents» no es un estilo, es otra página: elegirlo lleva a
 * /agents/, y desde allí elegir cualquier otro tema vuelve a la home.
 */

const KEY = 'svv-theme';
const root = document.documentElement;
const dialog = document.querySelector('#theme-menu');
const opener = document.querySelector('[data-theme-open]');
const options = [...document.querySelectorAll('[data-theme-option]')];
const onAgentsPage = root.dataset.theme === 'agents';
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Temas con decoración o animación propias, que el CSS no puede hacer solo.
   Cada módulo exporta `mount()`, que devuelve la función que lo deshace. Se
   cargan solo cuando hacen falta. */
const extras = {
  neobrutalist: () => import('./themes/neobrutalist.js'),
  synthwave: () => import('./themes/synthwave.js'),
};
let unmount;

const mountExtras = async (id) => {
  unmount?.();
  unmount = undefined;
  const load = extras[id];
  if (!load) return;
  const { mount } = await load();
  // Las monedas y el bitono miden la página: esperar a la tipografía del tema.
  await document.fonts.ready;
  if ((root.dataset.theme ?? 'original') === id) unmount = mount();
};

const save = (id) => {
  try {
    if (id === 'original') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, id);
  } catch {
    // Modo privado o almacenamiento bloqueado: el tema dura lo que la visita.
  }
};

const mark = (id) => {
  options.forEach((option) => {
    option.setAttribute('aria-pressed', String(option.dataset.themeOption === id));
  });
};

const apply = (id, color) => {
  if (id === 'original') delete root.dataset.theme;
  else root.dataset.theme = id;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color);
  mark(id);
  mountExtras(id);
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: id } }));
};

if (dialog && opener) {
  if (!onAgentsPage) {
    mark(root.dataset.theme ?? 'original');
    mountExtras(root.dataset.theme);
  }

  opener.addEventListener('click', () => {
    dialog.showModal();
    opener.setAttribute('aria-expanded', 'true');
  });

  dialog.addEventListener('close', () => opener.setAttribute('aria-expanded', 'false'));
  dialog.querySelector('[data-theme-close]')?.addEventListener('click', () => dialog.close());

  // El <dialog> ocupa toda la pantalla y es transparente: un clic que cae en
  // él y no en el panel es un clic fuera del menú.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  options.forEach((option) => {
    option.addEventListener('click', () => {
      const id = option.dataset.themeOption;
      const href = option.dataset.themeHref;

      if (href) {
        location.href = href;
        return;
      }

      save(id);
      if (onAgentsPage) {
        location.href = '/';
        return;
      }

      dialog.close();
      if (document.startViewTransition && !reduced.matches) {
        document.startViewTransition(() => apply(id, option.dataset.themeColor));
      } else {
        apply(id, option.dataset.themeColor);
      }
    });
  });
}
