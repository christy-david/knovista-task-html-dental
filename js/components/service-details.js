/**
 * <service-details>
 * One detail row per treatment, rendered from data/site.js.
 *
 * Unlike the other components, this one deliberately renders into the
 * LIGHT DOM (no Shadow DOM): each row's id (#rct, #implants…) must work as
 * a page anchor, <scroll-spy> must be able to observe it, and the page's
 * section CSS and motion hooks should apply.
 */
(() => {
  const { html, icon, photo, services } = App;

  class ServiceDetails extends HTMLElement {
    connectedCallback() {
      if (this.childElementCount) return;

      this.innerHTML = services.map((s) => html`
        <article class="service-row" id="${s.id}">
          <div class="service-img" data-animate="clip">
            <img src="${photo(s.img, 1100)}" alt="${s.name}" loading="lazy">
          </div>
          <div data-stagger>
            <div class="row-head">
              <span class="icon-chip">${icon(s.icon)}</span>
              <span class="price-meta">From <strong>${s.price}</strong> · ${s.duration}</span>
            </div>
            <h2>${s.name}</h2>
            <p class="lead">${s.summary}</p>
            <ul class="checklist">${s.points.map((p) => html`<li>${icon('check')}${p}</li>`)}</ul>
            <div class="btn-row">
              <a href="contact.html#book" class="btn btn-primary" data-book="${s.id}">${icon('calendar')} Book this treatment</a>
            </div>
          </div>
        </article>
      `).join('');
    }
  }

  customElements.define('service-details', ServiceDetails);

  Object.assign(App, { ServiceDetails });
})();
