/*
 * Menú a pantalla completa del móvil, sobre <dialog> nativo.
 *
 * Se cierra al elegir una sección: el desplazamiento hasta ella lo hace
 * motion.js en el mismo clic, y el <dialog> tiene que haberse ido para que la
 * página pueda moverse. Si la ventana crece por encima de 720 (girar la
 * tablet), también se cierra: allí ya no hay botón para cerrarlo.
 */

const dialog = document.querySelector('#mobile-menu');
const opener = document.querySelector('[data-menu-open]');

if (dialog && opener) {
  opener.addEventListener('click', () => {
    dialog.showModal();
    opener.setAttribute('aria-expanded', 'true');
  });

  dialog.addEventListener('close', () => opener.setAttribute('aria-expanded', 'false'));

  dialog.querySelector('[data-menu-close]')?.addEventListener('click', () => dialog.close());

  dialog.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => dialog.close());
  });

  window.matchMedia('(min-width: 720px)').addEventListener('change', (event) => {
    if (event.matches && dialog.open) dialog.close();
  });
}
