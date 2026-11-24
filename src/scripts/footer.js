/*
 * Botón flotante «Book 15 min» y copiar el correo del pie. No es animación GSAP, así
 * que no va en motion.js: debe funcionar igual con movimiento reducido.
 */

// El botón flotante se retira cuando empieza a verse el pie. El centinela es
// el último hijo de `main`: con el revelado, el pie asoma justo cuando el
// centinela entra en pantalla; con movimiento reducido, el pie va justo
// detrás en el flujo. `inert` lo saca del tabulador mientras no se ve.
function initBookCta() {
  const cta = document.querySelector('[data-book-cta]');
  const sentinel = document.querySelector('[data-footer-sentinel]');
  if (!cta || !sentinel) return;

  new IntersectionObserver(([entry]) => {
    const atFooter = entry.isIntersecting || entry.boundingClientRect.top < 0;
    cta.classList.toggle('is-hidden', atFooter);
    cta.inert = atFooter;
  }).observe(sentinel);
}

// Copiar el correo. Sin API de portapapeles el botón sigue oculto y queda el
// mailto. El botón es solo un icono: el aviso para lector de pantalla va por
// la región aria-live, y el icono cambia a una marca durante dos segundos.
function initCopyEmail() {
  const button = document.querySelector('[data-copy-email]');
  const status = document.querySelector('[data-copy-status]');
  if (!button || !navigator.clipboard) return;

  let timer;
  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copyEmail);
      button.classList.add('is-copied');
      if (status) status.textContent = 'Email address copied';
      clearTimeout(timer);
      timer = setTimeout(() => {
        button.classList.remove('is-copied');
        if (status) status.textContent = '';
      }, 2000);
    } catch {
      window.location.href = `mailto:${button.dataset.copyEmail}`;
    }
  });
}

initBookCta();
initCopyEmail();
