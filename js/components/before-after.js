/**
 * <before-after before="…" after="…" before-filter="sepia(.5)" caption="…">
 * Drag-to-compare image slider. A native <input type="range"> sits on top,
 * so it works with mouse, touch, keyboard and screen readers.
 * On first view the handle glides in like a GSAP teaser.
 */
(() => {
  const { BaseComponent, css, html, icon, onEnter, reducedMotion, shared } = App;

  class BeforeAfter extends BaseComponent {
    static styles = [shared.typography, css('components/before-after.css')];

    render() {
      const before = this.getAttribute('before');
      const after = this.getAttribute('after') ?? before;
      const filter = this.getAttribute('before-filter') ?? 'none';
      const caption = this.getAttribute('caption');

      return html`
        <div class="frame">
          <img class="after" src="${after}" alt="After treatment" loading="lazy">
          <img class="before" src="${before}" alt="Before treatment" style="filter: ${filter}" loading="lazy">
          <span class="label l">Before</span>
          <span class="label r">After</span>
          <div class="line"></div>
          <div class="handle">${icon('chevrons-left-right')}</div>
          <input type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after">
        </div>
        ${caption ? html`<p class="caption">${caption}</p>` : ''}`;
    }

    afterRender() {
      const input = this.$('input');
      const set = (value) => this.style.setProperty('--pos', `${value}%`);
      input.addEventListener('input', () => set(input.value));

      if (reducedMotion()) return;
      set(85);
      onEnter(this, () => {
        // Tween --pos 85 → 50 (CSS custom properties can't be animated by WAAPI
        // without @property, so drive it with an eased rAF tween)
        const start = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 4);
        const tick = (now) => {
          const t = Math.min(1, (now - start) / 1600);
          set(85 - 35 * ease(t));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }, { threshold: 0.5 });
    }
  }

  customElements.define('before-after', BeforeAfter);

  Object.assign(App, { BeforeAfter });
})();
