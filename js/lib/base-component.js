/**
 * Base class for every UI component on the site.
 *
 * - Attaches an open Shadow DOM so markup and CSS are encapsulated.
 * - Links the stylesheets listed in `static styles` inside that Shadow DOM.
 * - Calls `render()` (returns an HTML string), then — once the stylesheets
 *   have loaded — `afterRender()` for event listeners and measurements.
 * - `this.ready` is a promise that resolves after the first render.
 *
 * While its CSS loads the element carries [data-loading] (hidden by
 * base.css), so it never flashes unstyled.
 *
 * Usage:
 *   class MyThing extends App.BaseComponent {
 *     static styles = [App.css('components/my-thing.css')];
 *     render() { return App.html`<p>Hello</p>`; }
 *   }
 */
(() => {
  const loaded = (link) => new Promise((resolve) => {
    if (link.sheet) return resolve();
    link.addEventListener('load', resolve, { once: true });
    link.addEventListener('error', resolve, { once: true });
  });

  class BaseComponent extends HTMLElement {
    static styles = [];

    #rendered = false;
    #resolveReady;

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.ready = new Promise((resolve) => { this.#resolveReady = resolve; });
    }

    connectedCallback() {
      if (this.#rendered) return; // element was moved, keep existing DOM
      this.#rendered = true;

      const styles = this.constructor.styles;
      if (styles.length) this.setAttribute('data-loading', '');

      const links = styles.map((href) => `<link rel="stylesheet" href="${href}">`).join('');
      this.shadowRoot.innerHTML = links + this.render();
      App.rollButtons(this.shadowRoot);

      Promise.all([...this.shadowRoot.querySelectorAll('link')].map(loaded)).then(() => {
        this.removeAttribute('data-loading');
        this.afterRender?.();
        this.#resolveReady();
      });
    }

    render() {
      return '<slot></slot>';
    }

    /** Query inside this component's Shadow DOM. */
    $(selector) {
      return this.shadowRoot.querySelector(selector);
    }

    $$(selector) {
      return [...this.shadowRoot.querySelectorAll(selector)];
    }
  }

  Object.assign(App, { BaseComponent });
})();
