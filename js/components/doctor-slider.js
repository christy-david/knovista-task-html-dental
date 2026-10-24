/**
 * <doctor-slider>
 * Zentore-style split slider: photo on one side (clip-path wipe between
 * doctors), details on the other, with arrows and a 01 / 02 / 03 pager.
 */
(() => {
  const { BaseComponent, css, doctors, html, icon, photo, shared } = App;

  const pad = (n) => String(n + 1).padStart(2, '0');

  class DoctorSlider extends BaseComponent {
    static styles = [shared.typography, shared.buttons, shared.card, css('components/doctor-slider.css')];

    #index = 0;

    content(d) {
      const first = d.name.split(' ').slice(0, 2).join(' ');
      return html`
        <div class="name">
          <h3>${d.name}</h3>
          <div class="role">${d.role}</div>
        </div>
        <div class="spec-label">Specialisation</div>
        <p class="spec">${d.spec}</p>
        <p class="bio">${d.bio}</p>
        <div class="facts">
          <span class="meta-chip">${icon('graduation-cap')} ${d.qual}</span>
          ${d.facts.map((f) => html`<span class="meta-chip">${f}</span>`)}
        </div>
        <div class="btn-row">
          <a href="contact.html#book" class="btn btn-primary" data-book="${d.service}">${icon('calendar')} Book with ${first}</a>
        </div>`;
    }

    render() {
      return html`
        <div class="wrap">
          <div class="photo">
            ${doctors.map((d, i) => html`<img src="${photo(d.img, 900)}" alt="${d.name}" class="${i === 0 ? 'active' : ''}" loading="lazy">`)}
          </div>
          <div class="info">
            <div class="content" aria-live="polite">${this.content(doctors[0])}</div>
            <div class="pager">
              <button class="arrow" data-step="-1" aria-label="Previous doctor">${icon('chevron-left')}</button>
              <button class="arrow" data-step="1" aria-label="Next doctor">${icon('chevron-right')}</button>
              <div class="dots">
                ${doctors.map((d, i) => html`
                  ${i ? '<span>/</span>' : ''}
                  <button data-go="${i}" aria-label="Show ${d.name}" aria-current="${i === 0}">${pad(i)}</button>
                `)}
              </div>
            </div>
          </div>
        </div>`;
    }

    afterRender() {
      this.$('.pager').addEventListener('click', (e) => {
        const step = e.target.closest('[data-step]');
        const go = e.target.closest('[data-go]');
        if (step) this.go(this.#index + Number(step.dataset.step));
        if (go) this.go(Number(go.dataset.go));
      });
      this.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') this.go(this.#index + 1);
        if (e.key === 'ArrowLeft') this.go(this.#index - 1);
      });
    }

    go(index) {
      const next = (index + doctors.length) % doctors.length;
      if (next === this.#index) return;
      this.#index = next;

      this.$$('.photo img').forEach((img, i) => img.classList.toggle('active', i === next));
      this.$$('[data-go]').forEach((b, i) => b.setAttribute('aria-current', String(i === next)));

      const content = this.$('.content');
      content.classList.add('out');
      setTimeout(() => {
        content.innerHTML = this.content(doctors[next]);
        App.rollButtons(content);
        content.classList.remove('out');
      }, 350);
    }
  }

  customElements.define('doctor-slider', DoctorSlider);

  Object.assign(App, { DoctorSlider });
})();
