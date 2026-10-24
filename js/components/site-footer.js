/**
 * <site-footer>
 * Footer built from shared data (links, hours, contact details).
 */
(() => {
  const { BaseComponent, clinic, css, formatTime, hours, html, icon, mapLink, nav, services, shared, telLink } = App;

  class SiteFooter extends BaseComponent {
    static styles = [shared.typography, shared.layout, shared.buttons, css('components/site-footer.css')];

    render() {
      return html`
        <footer>
          <div class="container">
            <div class="big">
              <h2>Gentle care, <em class="accent">every</em> visit.</h2>
              <a href="contact.html#book" class="btn btn-accent" data-book>${icon('calendar')} Book an appointment</a>
            </div>

            <div class="top">
              <div>
                <a href="index.html" class="logo"><span class="logo-mark">${icon('tooth')}</span>${clinic.name}</a>
                <p>Specialist-led family dentistry in ${clinic.area}. Costs in writing, sterilisation you can see, and open seven days a week.</p>
              </div>
              <div>
                <h4>Explore</h4>
                <ul>${nav.map((l) => html`<li><a href="${l.href}">${l.label}</a></li>`)}</ul>
              </div>
              <div>
                <h4>Popular treatments</h4>
                <ul>${services.slice(2, 8).map((s) => html`<li><a href="services.html#${s.id}">${s.name}</a></li>`)}</ul>
              </div>
              <div>
                <h4>Visit</h4>
                <ul>
                  <li>${icon('map-pin')}<a href="${mapLink()}" target="_blank" rel="noopener">${clinic.address.join(', ')}</a></li>
                  <li>${icon('phone')}<a href="${telLink()}">${clinic.phoneDisplay}</a></li>
                  <li>${icon('mail')}<a href="mailto:${clinic.email}">${clinic.email}</a></li>
                  ${hours.map((h) => html`<li>${icon('clock')}<span>${h.label}: ${formatTime(h.open)} – ${formatTime(h.close)}</span></li>`)}
                </ul>
              </div>
            </div>

            <div class="bottom">
              <span>© ${new Date().getFullYear()} ${clinic.name} ${clinic.tagline}, Kochi</span>
              <span>Dental emergencies: call anytime</span>
            </div>
          </div>
        </footer>`;
    }
  }

  customElements.define('site-footer', SiteFooter);

  Object.assign(App, { SiteFooter });
})();
