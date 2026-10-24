/**
 * <stat-counter value="12000" suffix="+" decimals="0">
 * Counts up from zero the first time it scrolls into view.
 * Font and colour are inherited from wherever it's placed.
 */
(() => {
  const { BaseComponent } = App;

  class StatCounter extends BaseComponent {
    render() {
      return '<span></span>';
    }

    afterRender() {
      const output = this.$('span');
      const target = Number(this.getAttribute('value'));
      const suffix = this.getAttribute('suffix') ?? '';
      const decimals = Number(this.getAttribute('decimals') ?? 0);
      const show = (n) => {
        output.textContent = n.toLocaleString('en-IN', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }) + suffix;
      };

      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        show(target);
        return;
      }

      show(0);
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          show(target * (1 - Math.pow(1 - progress, 3))); // ease-out cubic
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      observer.observe(this);
    }
  }

  customElements.define('stat-counter', StatCounter);

  Object.assign(App, { StatCounter });
})();
