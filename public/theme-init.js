/*
 * Aplica el tema guardado antes del primer pintado, para que no se vea el
 * Original un instante y luego cambie. Va como archivo aparte y síncrono en el
 * <head> porque la CSP no admite scripts en línea.
 *
 * `?theme=<id>` gana a lo guardado (sirve para compartir un tema y para las
 * capturas con Chrome headless). La lista válida y los colores de la barra
 * llegan en atributos del propio <script>, generados desde src/data/themes.ts.
 */
(function () {
  var script = document.currentScript;
  var colors = {};
  try {
    colors = JSON.parse(script.dataset.colors);
  } catch (e) {}

  var theme = null;
  try {
    theme = new URLSearchParams(location.search).get('theme');
  } catch (e) {}
  if (!theme) {
    try {
      theme = localStorage.getItem('svv-theme');
    } catch (e) {}
  }
  if (!theme || !colors[theme] || theme === 'agents') return;

  document.documentElement.dataset.theme = theme;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', colors[theme]);
})();
