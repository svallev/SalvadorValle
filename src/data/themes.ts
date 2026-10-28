/*
 * Temas del selector de la cabecera, en el orden del menú (Figma, nodo 1093:305).
 *
 * Añadir uno: una entrada aquí y su archivo en src/styles/themes/<id>.css,
 * importado desde global.css. Un tema solo cambia el aspecto: nunca el
 * contenido, el orden ni la estructura de la página.
 *
 * `swatch` son los tres colores del icono del menú (fondo, franja y esquina),
 * tal y como vienen en el Figma. `themeColor` tiñe la barra del navegador
 * (Safari en iOS) y debe ser el fondo de página del tema.
 *
 * `agents` no es un estilo sino otra página (/agents/): no se guarda como
 * tema de la home, para que una persona no acabe rebotada allí en su
 * siguiente visita.
 */

export interface Theme {
  id: string;
  label: string;
  swatch: [string, string, string];
  themeColor: string;
  href?: string;
}

export const themes: Theme[] = [
  { id: 'original', label: 'Original', swatch: ['#FBFAF9', '#FF4F00', '#111111'], themeColor: '#fbfaf9' },
  { id: 'neobrutalist', label: 'Neobrutalist', swatch: ['#1F3DFF', '#FF4F00', '#F28FC4'], themeColor: '#f7efe4' },
  { id: 'night', label: 'Night', swatch: ['#0E0E10', '#FF6A2B', '#F2F0EC'], themeColor: '#0e0e10' },
  {
    id: 'agents',
    label: 'Just for Agents',
    // Los colores de /agents/: papel blanco, enlaces azules y texto negro.
    swatch: ['#FFFFFF', '#0B57D0', '#111111'],
    themeColor: '#ffffff',
    href: '/agents/',
  },
];

export const defaultTheme = themes[0];
