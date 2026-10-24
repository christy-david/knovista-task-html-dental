/**
 * <app-icon name="phone"></app-icon>
 * Renders an inline SVG from js/lib/icons.js. Sized by font-size (1em)
 * and coloured by `color`, so it adapts to whatever text it sits in.
 * Decorative by default; add label="…" to make it announce itself.
 */
(() => {
  const { svg } = App;

  const sheet = new CSSStyleSheet();
  sheet.replaceSync(`
    :host { display: inline-block; width: 1.15em; height: 1.15em; flex-shrink: 0; line-height: 0; }
    svg { width: 100%; height: 100%; display: block; }
  `);

  class AppIcon extends HTMLElement {
    static observedAttributes = ['name', 'label'];

    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).adoptedStyleSheets = [sheet];
    }

    attributeChangedCallback() {
      this.shadowRoot.innerHTML = svg(this.getAttribute('name'));
      const label = this.getAttribute('label');
      if (label) {
        this.setAttribute('role', 'img');
        this.setAttribute('aria-label', label);
      } else {
        this.setAttribute('aria-hidden', 'true');
      }
    }
  }

  customElements.define('app-icon', AppIcon);

  Object.assign(App, { AppIcon });
})();
