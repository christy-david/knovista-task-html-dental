/**
 * <site-header>
 * Reference example of a fully encapsulated Web Component:
 *
 *   HTML  → render() returns the markup, built from shared data (nav, clinic).
 *   CSS   → static styles: shared modules + css/components/site-header.css,
 *           linked inside the Shadow DOM, so nothing leaks in or out.
 *   JS    → afterRender() wires up the mobile menu, Escape-to-close,
 *           and a "smart" header that hides on scroll down / shows on scroll up.
 *
 * Usage: <site-header></site-header>
 */
(() => {
  const { BaseComponent, clinic, css, html, icon, nav, openStatus, shared, telLink } = App;

  class SiteHeader extends BaseComponent {
    static styles = [shared.typography, shared.layout, shared.buttons, css('components/site-header.css')];

    render() {
      const page = location.pathname.split('/').pop() || 'index.html';
      const status = openStatus();

      return html`
        <header>
          <nav class="container" aria-label="Main">
            <a href="index.html" class="logo"><span class="logo-mark">${icon('tooth')}</span>${clinic.name}</a>

            <ul class="links" id="links">
              ${nav.map((link) => html`
                <li><a href="${link.href}" ${link.href === page ? 'aria-current="page"' : ''}>${link.label}</a></li>
              `)}
              <li class="mobile-only"><a href="contact.html#book" class="btn btn-accent btn-block" data-book>${icon('calendar')} Book an appointment</a></li>
            </ul>

            <div class="right">
              <div class="contact-mini">
                <a href="${telLink()}">${clinic.phoneDisplay}</a>
                <span class="status ${status.open ? 'is-open' : ''}"><i></i>${status.text}</span>
              </div>
              <a href="contact.html#book" class="btn btn-accent" data-book>${icon('calendar')} Book appointment</a>
              <button class="menu-btn" aria-expanded="false" aria-controls="links" aria-label="Menu">
                <app-icon name="menu" class="open-icon"></app-icon>
                <app-icon name="x" class="close-icon"></app-icon>
              </button>
            </div>
          </nav>
        </header>`;
    }

    afterRender() {
      this.menuButton = this.$('.menu-btn');
      this.links = this.$('.links');
      this.header = this.$('header');

      this.menuButton.addEventListener('click', () => this.toggleMenu());
      this.links.addEventListener('click', (e) => {
        if (e.target.closest('a')) this.toggleMenu(false);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.toggleMenu(false);
      });

      // Smart header: solid after scrolling, hides going down, returns going up
      let lastY = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        const menuOpen = this.links.classList.contains('open');
        this.header.classList.toggle('scrolled', y > 10);
        const hide = !menuOpen && y > 400 && y > lastY;
        this.header.classList.toggle('hidden', hide);
        // Let page-level sticky elements (e.g. .subnav) slide up when the header hides
        document.documentElement.classList.toggle('header-hidden', hide);
        lastY = y;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    toggleMenu(force) {
      const open = force ?? this.menuButton.getAttribute('aria-expanded') !== 'true';
      this.menuButton.setAttribute('aria-expanded', String(open));
      this.links.classList.toggle('open', open);
      if (open) this.header.classList.remove('hidden');
    }
  }

  customElements.define('site-header', SiteHeader);

  Object.assign(App, { SiteHeader });
})();
