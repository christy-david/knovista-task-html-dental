/**
 * <testimonial-slider>
 * Smilora-style big-quote slider: patient photo, quote, treating doctor.
 * Auto-advances every 8s; pauses while hovered or focused.
 */
(() => {
  const { BaseComponent, css, doctors, html, icon, photo, reducedMotion, shared, testimonials } = App;

  const pad = (n) => String(n).padStart(2, '0');

  class TestimonialSlider extends BaseComponent {
    static styles = [shared.typography, css('components/testimonial-slider.css')];

    #index = 0;
    #timer;

    render() {
      return html`
        <div class="wrap">
          <figure class="patient slide">
            <img alt="">
            <figcaption class="cap"><span>Happy patients</span><span>${new Date().getFullYear()}</span></figcaption>
          </figure>

          <div class="quote">
            <div class="slide body" aria-live="polite"></div>
            <div class="nav">
              <span class="count"></span>
              <button class="icon-btn" data-step="-1" aria-label="Previous review">${icon('chevron-left')}</button>
              <button class="icon-btn" data-step="1" aria-label="Next review">${icon('chevron-right')}</button>
            </div>
          </div>

          <figure class="doctor slide">
            <img alt="">
            <figcaption class="cap"><span class="dn"></span><span class="dr"></span></figcaption>
          </figure>
        </div>`;
    }

    afterRender() {
      this.show(0);
      this.$('.nav').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-step]');
        if (btn) this.go(this.#index + Number(btn.dataset.step));
      });

      if (reducedMotion()) return;
      const start = () => { this.#timer = setInterval(() => this.go(this.#index + 1), 8000); };
      const stop = () => clearInterval(this.#timer);
      this.addEventListener('pointerenter', stop);
      this.addEventListener('pointerleave', start);
      this.addEventListener('focusin', stop);
      this.addEventListener('focusout', start);
      start();
    }

    show(i) {
      const t = testimonials[i];
      const d = doctors[t.doctor];
      this.$('.patient img').src = photo(t.img, 500);
      this.$('.patient img').alt = t.name;
      this.$('.doctor img').src = photo(d.img, 400);
      this.$('.doctor img').alt = d.name;
      this.$('.dn').textContent = d.name;
      this.$('.dr').textContent = d.role;
      this.$('.count').textContent = `${pad(i + 1)} / ${pad(testimonials.length)}`;
      this.$('.body').innerHTML = html`
        <div class="stars" aria-label="5 out of 5 stars">${[1, 2, 3, 4, 5].map(() => icon('star'))}</div>
        <blockquote><app-icon name="quote" class="quote-icon"></app-icon>${t.quote}</blockquote>
        <div class="who"><strong>${t.name}</strong><span>${t.treatment} patient</span></div>`;
    }

    go(index) {
      this.#index = (index + testimonials.length) % testimonials.length;
      const slides = this.$$('.slide');
      slides.forEach((s) => s.classList.add('out'));
      setTimeout(() => {
        this.show(this.#index);
        slides.forEach((s) => s.classList.remove('out'));
      }, 400);
    }
  }

  customElements.define('testimonial-slider', TestimonialSlider);

  Object.assign(App, { TestimonialSlider });
})();
