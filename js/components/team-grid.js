/**
 * <team-grid>
 * Cards for every doctor in data/site.js, each with a direct "Book" button.
 */
(() => {
  const { BaseComponent, css, doctors, from, html, icon, onEnter, photo, reducedMotion, shared } = App;

  class TeamGrid extends BaseComponent {
    static styles = [shared.typography, shared.layout, shared.buttons, shared.card, css('components/team-grid.css')];

    render() {
      return html`
        <div class="grid grid-4">
          ${doctors.map((d) => html`
            <article class="card member">
              <div class="media"><img src="${photo(d.img, 700)}" alt="${d.name}" loading="lazy"></div>
              <div class="card-body">
                <span class="role">${d.role}</span>
                <h3>${d.name}</h3>
                <p>${d.spec}</p>
                <div class="card-actions">
                  <span class="qual">${icon('graduation-cap')} ${d.qual.split(' (')[0]}</span>
                  <a href="contact.html#book" class="btn btn-primary btn-sm" data-book="${d.service}">Book</a>
                </div>
              </div>
            </article>
          `)}
        </div>`;
    }

    afterRender() {
      if (reducedMotion()) return;
      const cards = this.$$('.card');
      cards.forEach((c) => { c.style.opacity = 0; });
      onEnter(this, () => {
        cards.forEach((c) => { c.style.opacity = ''; });
        from(cards, { opacity: 0, transform: 'translateY(50px)' }, { stagger: 90 });
      });
    }
  }

  customElements.define('team-grid', TeamGrid);

  Object.assign(App, { TeamGrid });
})();
