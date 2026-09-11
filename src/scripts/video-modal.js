/*
 * Lightbox de YouTube sobre <dialog> nativo.
 *
 * El <dialog> aporta de serie el atrapado del foco, el cierre con Esc, el fondo
 * inerte y la devolución del foco al elemento que lo abrió. Nada de eso hay que
 * escribirlo a mano, y escrito a mano casi siempre sale peor.
 *
 * El <iframe> se crea al abrir y se destruye al cerrar: si estuviera en el HTML
 * desde el principio, cada visita cargaría cuatro reproductores de YouTube —más
 * peso que el resto del sitio junto— y al cerrar el vídeo seguiría sonando.
 */

const dialog = document.querySelector('#video-modal');

if (dialog) {
  const player = dialog.querySelector('[data-modal-player]');
  const title = dialog.querySelector('#video-modal-title');

  const open = (videoId, videoTitle) => {
    title.textContent = videoTitle ?? '';

    const iframe = document.createElement('iframe');
    // youtube-nocookie: coherente con no tener banner de consentimiento.
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
    iframe.title = videoTitle ?? 'Video';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;

    player.replaceChildren(iframe);
    dialog.showModal();
  };

  const close = () => {
    // Vaciar el contenedor destruye el iframe, y con él el audio.
    player.replaceChildren();
    title.textContent = '';
  };

  document.querySelectorAll('[data-talk-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const { talkId, talkTitle } = button.dataset;
      if (talkId) open(talkId, talkTitle);
    });
  });

  dialog.querySelector('[data-modal-close]')?.addEventListener('click', () => dialog.close());

  // `close` se dispara tanto con el botón como con Esc: un único punto de limpieza.
  dialog.addEventListener('close', close);

  // Clic en el backdrop. El <dialog> ocupa solo la caja del modal, así que un
  // clic cuyo punto cae fuera de su rectángulo es un clic en el fondo.
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    const outside =
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom;
    if (outside) dialog.close();
  });
}
