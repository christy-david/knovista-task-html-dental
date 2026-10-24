/**
 * <booking-form service="implants" sticky-actions>
 * Appointment request form (Smilora-style underline fields).
 *
 * - Native constraint validation + friendly custom messages
 * - Indian mobile check: 10 digits starting 6–9 (+91 / spaces / dashes allowed)
 * - Time slots follow the clinic's hours for the chosen day
 *   (e.g. Sunday 10 AM – 2 PM → Evening is disabled)
 * - Sends a ready-to-go message via WhatsApp, or email as a fallback
 * - `sticky-actions` keeps the send button visible inside the dialog on phones
 *
 * Used inline on the contact page and inside <booking-dialog>.
 */
(() => {
  const { BaseComponent, bookingOptions, clinic, css, formatTime, hoursFor, html, icon, mailLink, serviceName, shared, waLink } = App;

  const SLOTS = [
    { label: 'Morning', icon: 'sun', from: 9, to: 12, hint: '9 – 12' },
    { label: 'Afternoon', icon: 'sunset', from: 12, to: 16, hint: '12 – 4' },
    { label: 'Evening', icon: 'moon', from: 16, to: 21, hint: '4 – 8:30' },
  ];

  const toHour = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h + m / 60;
  };

  // Local YYYY-MM-DD (en-CA formats dates that way)
  const isoDate = (d) => d.toLocaleDateString('en-CA');

  class BookingForm extends BaseComponent {
    static styles = [shared.typography, shared.buttons, css('components/booking-form.css')];

    render() {
      const today = new Date();
      const maxDate = new Date(today);
      maxDate.setDate(today.getDate() + 90);

      return html`
        <form novalidate>
          <fieldset class="group">
            <legend class="group-head"><span class="step">01</span>Your details</legend>
            <div class="row">
              <div class="field">
                <label for="name">Full name <span class="req" aria-hidden="true">*</span></label>
                <input id="name" name="name" autocomplete="name" placeholder="Your name" minlength="2" required
                       aria-describedby="name-error">
                <small class="error" id="name-error">Please enter your name</small>
              </div>
              <div class="field">
                <label for="phone">Mobile number <span class="req" aria-hidden="true">*</span></label>
                <div class="affix">
                  <span class="prefix">+91</span>
                  <input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national"
                         placeholder="98470 12345" required aria-describedby="phone-error">
                </div>
                <small class="error" id="phone-error">Enter a 10-digit mobile number</small>
              </div>
            </div>
          </fieldset>

          <fieldset class="group">
            <legend class="group-head"><span class="step">02</span>Your visit</legend>
            <div class="row">
              <div class="field">
                <label for="service">What do you need?</label>
                <div class="select">
                  <select id="service" name="service">
                    ${bookingOptions.map((s) => html`<option value="${s.id}">${s.name}</option>`)}
                  </select>
                  ${icon('chevron-right')}
                </div>
              </div>
              <div class="field">
                <label for="date">Preferred date <span class="req" aria-hidden="true">*</span></label>
                <input id="date" name="date" type="date" min="${isoDate(today)}" max="${isoDate(maxDate)}" required
                       aria-describedby="date-error">
                <small class="error" id="date-error">Please choose a date</small>
              </div>
            </div>

            <fieldset class="field">
              <legend>Preferred time</legend>
              <div class="slots">
                ${SLOTS.map((s, i) => html`
                  <label class="slot">
                    <input type="radio" name="slot" value="${s.label}" ${i === 0 ? 'checked' : ''}>
                    <span>${icon(s.icon)}${s.label}<small>${s.hint}</small></span>
                  </label>
                `)}
              </div>
              <small class="slot-note" aria-live="polite"></small>
            </fieldset>

            <div class="field">
              <label for="message">Anything we should know? <span class="optional">Optional</span></label>
              <textarea id="message" name="message" rows="1" placeholder="e.g. sensitivity on the left side for a week"></textarea>
            </div>
          </fieldset>

          <div class="actions">
            <button type="submit" class="btn btn-whatsapp btn-lg btn-block">${icon('whatsapp')} Send request on WhatsApp</button>
            <p class="note">
              ${icon('shield-check')} Free first consultation · or
              <button type="button" class="link" data-email>send by email</button>
            </p>
          </div>
        </form>

        <div class="success" hidden role="status" tabindex="-1">
          <div class="tick">${icon('check')}</div>
          <h3>Request ready!</h3>
          <p>Press <strong>send</strong> in the window that just opened. We'll confirm your slot within the hour.</p>
          <dl class="summary"></dl>
          <div class="success-actions">
            <button type="button" class="btn btn-light" data-reset>Book another appointment</button>
          </div>
        </div>`;
    }

    afterRender() {
      this.form = this.$('form');
      this.success = this.$('.success');
      this.phone = this.$('#phone');
      this.date = this.$('#date');
      if (this.hasAttribute('service')) this.service = this.getAttribute('service');

      // Phone: accept "+91 98470-12345", "098470 12345", etc.
      this.phone.addEventListener('input', () => this.checkPhone());
      this.date.addEventListener('change', () => this.updateSlots());

      // After the first submit attempt, re-validate fields as the user fixes them
      this.form.addEventListener('input', (e) => {
        if (this.form.classList.contains('was-validated')) e.target.closest('.field')?.classList.toggle('invalid', !e.target.checkValidity());
      });

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.send('whatsapp');
      });
      this.$('[data-email]').addEventListener('click', () => this.send('email'));
      this.$('[data-reset]').addEventListener('click', () => this.reset());
      this.updateSlots();
    }

    /** Pre-select a treatment by id, e.g. form.service = 'implants' */
    set service(id) {
      const select = this.$('select');
      if (select && [...select.options].some((o) => o.value === id)) select.value = id;
    }

    digits() {
      let d = this.phone.value.replace(/\D/g, '');
      if (d.length === 12 && d.startsWith('91')) d = d.slice(2);
      if (d.length === 11 && d.startsWith('0')) d = d.slice(1);
      return d;
    }

    checkPhone() {
      const ok = /^[6-9]\d{9}$/.test(this.digits());
      this.phone.setCustomValidity(ok || !this.phone.value ? '' : 'invalid');
      if (!this.phone.value) this.phone.setCustomValidity('');
      return ok;
    }

    /** Enable only the time slots the clinic is open for on the chosen day. */
    updateSlots() {
      const day = this.date.value ? new Date(`${this.date.value}T00:00`).getDay() : null;
      const open = day === null ? null : hoursFor(day);
      const radios = this.$$('.slot input');

      radios.forEach((radio, i) => {
        const s = SLOTS[i];
        const available = !open || (toHour(open.open) < s.to && toHour(open.close) > s.from);
        radio.disabled = !available;
        radio.closest('.slot').title = available ? s.hint : 'Clinic closed at this time';
      });

      if (this.$('.slot input:checked')?.disabled) radios.find((r) => !r.disabled).checked = true;

      const closedSome = radios.some((r) => r.disabled);
      this.$('.slot-note').textContent = closedSome && open
        ? `${open.label}: open ${formatTime(open.open)} – ${formatTime(open.close)} only`
        : '';
    }

    validate() {
      this.checkPhone();
      this.form.classList.add('was-validated');
      this.$$('.field').forEach((f) => {
        const input = f.querySelector('input:not([type=radio]), select, textarea');
        f.classList.toggle('invalid', !!input && !input.checkValidity());
      });
      if (this.form.checkValidity()) return true;
      this.form.querySelector(':invalid')?.focus();
      return false;
    }

    details() {
      const data = Object.fromEntries(new FormData(this.form));
      const d = this.digits();
      return {
        Name: data.name.trim(),
        Mobile: `+91 ${d.slice(0, 5)} ${d.slice(5)}`,
        Treatment: serviceName(data.service),
        Preferred: `${new Date(`${data.date}T00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}, ${data.slot}`,
        Note: data.message.trim(),
      };
    }

    message(details) {
      const lines = [`Hi ${clinic.name}, I'd like to book an appointment.`, ''];
      Object.entries(details).forEach(([k, v]) => { if (v) lines.push(`${k}: ${v}`); });
      return lines.join('\n');
    }

    send(channel) {
      if (!this.validate()) return;
      const details = this.details();
      const text = this.message(details);

      if (channel === 'email') location.href = mailLink('Appointment request', text);
      else window.open(waLink(text), '_blank', 'noopener');

      this.$('.summary').innerHTML = Object.entries(details)
        .filter(([, v]) => v)
        .map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)
        .join('');
      this.form.hidden = true;
      this.success.hidden = false;
      this.success.focus();
    }

    reset() {
      if (!this.form) return;
      this.form.reset();
      this.form.classList.remove('was-validated');
      this.$$('.field.invalid').forEach((f) => f.classList.remove('invalid'));
      this.phone.setCustomValidity('');
      this.updateSlots();
      this.form.hidden = false;
      this.success.hidden = true;
    }
  }

  customElements.define('booking-form', BookingForm);

  Object.assign(App, { BookingForm });
})();
