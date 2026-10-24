/**
 * <concern-picker>
 * "How can we help you today?" — one tap opens the booking dialog
 * with the matching treatment already selected.
 */
(() => {
  const { BaseComponent, concerns, css, from, html, icon, onEnter, reducedMotion, shared } = App;

  class ConcernPicker extends BaseComponent {
    static styles = [shared.typography, css('components/concern-picker.css')];

    render() {
      return html`
        <div class="grid">
          ${concerns.map((c) => html`
            <button type="button" data-book="${c.service}">
              <span class="icon">${icon(c.icon)}</span>
              <app-icon name="arrow-up-right" class="arrow"></app-icon>
              <span class="label">${c.label}</span>
              <span class="hint">${c.hint}</span>
            </button>
          `)}
        </div>`;
    }

    afterRender() {
      if (reducedMotion()) return;
      const tiles = this.$$('button');
      tiles.forEach((t) => { t.style.opacity = 0; });
      onEnter(this, () => {
        tiles.forEach((t) => { t.style.opacity = ''; });
        from(tiles, { opacity: 0, transform: 'translateY(40px) scale(0.96)' }, { stagger: 60 });
      });
    }
  }

  customElements.define('concern-picker', ConcernPicker);

  Object.assign(App, { ConcernPicker });
})();
