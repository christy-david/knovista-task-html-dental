/**
 * <booking-dialog>
 * A native <dialog> wrapping <booking-form>. Opens whenever a
 * `booking:open` event reaches the document (see js/main.js, which turns
 * clicks on any [data-book] element into that event).
 *
 * Desktop: two panels — blue info panel + form (fits without scrolling).
 * Phones: a bottom sheet with a compact header and a sticky send button.
 */
(() => {
  const { BOOKING_OPEN, BaseComponent, clinic, css, html, icon, openStatus, shared, telLink } = App;

  class BookingDialog extends BaseComponent {
    static styles = [shared.typography, css('components/modal.css')];

    render() {
      const status = openStatus();

      return html`
        <dialog class="booking" aria-labelledby="title">
          <div class="layout">
            <button type="button" class="close" aria-label="Close">${icon('x')}</button>
            <aside class="side">
              <div>
                <span class="eyebrow">Book an appointment</span>
                <h2 id="title">Request a <em class="accent">visit</em></h2>
                <p class="side-text">Tell us what you need and when suits you. We'll confirm your slot on WhatsApp.</p>
              </div>
              <ul class="perks">
                <li>${icon('check-circle')} Free first consultation</li>
                <li>${icon('clock')} Confirmed within the hour</li>
                <li>${icon('calendar-check')} Open 7 days a week</li>
              </ul>
              <div class="side-foot">
                <span class="status ${status.open ? 'is-open' : ''}"><i></i>${status.text}</span>
                <a href="${telLink()}" class="call">${icon('phone')} ${clinic.phoneDisplay}</a>
              </div>
            </aside>

            <div class="main">
              <booking-form sticky-actions></booking-form>
            </div>
          </div>
        </dialog>`;
    }

    afterRender() {
      this.dialog = this.$('dialog');
      this.form = this.$('booking-form');

      this.$('.close').addEventListener('click', () => this.dialog.close());
      // A click on the dialog element itself means the backdrop was clicked
      this.dialog.addEventListener('click', (e) => {
        if (e.target === this.dialog) this.dialog.close();
      });
      this.dialog.addEventListener('close', () => document.documentElement.classList.remove('modal-open'));

      document.addEventListener(BOOKING_OPEN, (e) => this.open(e.detail.service));
    }

    async open(service) {
      await this.form.ready;
      this.form.reset();
      if (service) this.form.service = service;
      document.documentElement.classList.add('modal-open');
      this.dialog.showModal();
      this.$('.main').scrollTop = 0;
    }
  }

  customElements.define('booking-dialog', BookingDialog);

  Object.assign(App, { BookingDialog });
})();
