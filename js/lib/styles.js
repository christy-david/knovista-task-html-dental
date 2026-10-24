/**
 * Stylesheet paths for components.
 * Each component lists the CSS files it needs in `static styles`; the base
 * class links them inside the component's Shadow DOM with <link> tags,
 * which (unlike fetch) also works when the site is opened from disk.
 */
(() => {
  /** Path to a file in /css, relative to the page (all pages live in the site root). */
  const css = (path) => `css/${path}`;

  /** Stylesheets most components share (see css/shared/). */
  const shared = {
    typography: css('shared/typography.css'),
    layout: css('shared/layout.css'),
    buttons: css('shared/buttons.css'),
    card: css('shared/card.css'),
    chips: css('shared/chips.css'),
  };

  Object.assign(App, { css, shared });
})();
