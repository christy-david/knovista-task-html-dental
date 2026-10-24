/**
 * <scroll-spy>
 * Wrap in-page links (href="#section"). The link for the section currently
 * on screen gets aria-current="true" and is scrolled into view.
 * The links stay in light DOM (styled by the page) and are slotted in.
 */
(() => {
  const { BaseComponent, css } = App;

  class ScrollSpy extends BaseComponent {
    static styles = [css('components/scroll-spy.css')];

    afterRender() {
      const links = [...this.querySelectorAll('a[href^="#"]')];
      const sections = links
        .map((link) => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

      const setActive = (id) => {
        links.forEach((link) => {
          const active = link.getAttribute('href') === `#${id}`;
          link.setAttribute('aria-current', String(active));
          if (active) {
            // Scroll only the chip row horizontally, never the page
            this.scrollTo({ left: link.offsetLeft - this.offsetWidth / 2 + link.offsetWidth / 2, behavior: 'smooth' });
          }
        });
      };

      const observer = new IntersectionObserver((entries) => {
        entries.filter((e) => e.isIntersecting).forEach((e) => setActive(e.target.id));
      }, { rootMargin: '-45% 0px -50% 0px' });

      sections.forEach((section) => observer.observe(section));
    }
  }

  customElements.define('scroll-spy', ScrollSpy);

  Object.assign(App, { ScrollSpy });
})();
