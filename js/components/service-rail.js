/**
 * <service-rail>
 *   <h2 slot="title">Our dental <span class="dim">treatments</span></h2>
 *   <a slot="action" href="services.html">View all</a>
 * </service-rail>
 *
 * Smilora-style treatments rail. On desktop it behaves like a GSAP
 * ScrollTrigger "pin + scrub": the section sticks while vertical scrolling
 * slides the cards sideways. On phones (or with reduced motion) it falls
 * back to a native swipeable scroll-snap row.
 */
(() => {
  const { BaseComponent, addScrubber, css, html, photo, services, shared } = App;

  class ServiceRail extends BaseComponent {
    static styles = [shared.typography, shared.buttons, css('components/service-rail.css')];

    render() {
      return html`
        <div class="pin">
          <div class="head">
            <slot name="title"></slot>
            <slot name="action"></slot>
          </div>
          <div class="track">
            ${services.map((s, i) => html`
              <a class="svc ${i % 2 ? 'flip' : ''}" href="services.html#${s.id}">
                <div class="media"><img src="${photo(s.img, 700)}" alt="${s.name}" loading="lazy"></div>
                <div class="meta">
                  <h3>${s.name}</h3>
                  <span class="price-meta">From <strong>${s.price}</strong></span>
                </div>
              </a>
            `)}
          </div>
          <div class="progress" aria-hidden="true"><i></i></div>
        </div>`;
    }

    afterRender() {
      this.track = this.$('.track');
      this.bar = this.$('.progress i');
      this.distance = 0;

      const pinnable = matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');

      const setup = () => {
        const pinned = pinnable.matches;
        this.toggleAttribute('static', !pinned);
        if (pinned) {
          this.distance = Math.max(0, this.track.scrollWidth - window.innerWidth);
          this.style.height = `calc(100vh + ${this.distance}px)`;
        } else {
          this.style.height = '';
          this.track.style.transform = '';
        }
        this.update();
      };

      pinnable.addEventListener('change', setup);
      window.addEventListener('resize', setup);
      addScrubber(() => this.update());
      setup();
    }

    /** Map vertical scroll progress through the section to horizontal travel. */
    update() {
      if (this.hasAttribute('static') || !this.distance) return;
      const scrollable = this.offsetHeight - window.innerHeight;
      const progress = Math.min(1, Math.max(0, -this.getBoundingClientRect().top / scrollable));
      this.track.style.transform = `translate3d(${(-progress * this.distance).toFixed(1)}px, 0, 0)`;
      this.bar.style.transform = `scaleX(${progress})`;
    }
  }

  customElements.define('service-rail', ServiceRail);

  Object.assign(App, { ServiceRail });
})();
