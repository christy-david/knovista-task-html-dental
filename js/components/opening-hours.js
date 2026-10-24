/**
 * <opening-hours>
 * Live open/closed status + hours table, with today's row highlighted.
 */
(() => {
  const { BaseComponent, clinicNow, css, formatTime, hours, html, openStatus, shared } = App;

  class OpeningHours extends BaseComponent {
    static styles = [shared.typography, css('components/opening-hours.css')];

    render() {
      const today = clinicNow().getDay();
      const status = openStatus();

      return html`
        <p class="status ${status.open ? 'is-open' : ''}"><i></i>${status.text}</p>
        <table>
          ${hours.map((h) => html`
            <tr class="${h.days.includes(today) ? 'today' : ''}">
              <td>${h.label}</td>
              <td>${formatTime(h.open)} – ${formatTime(h.close)}</td>
            </tr>
          `)}
          <tr><td>Dental emergencies</td><td>Call anytime</td></tr>
        </table>`;
    }
  }

  customElements.define('opening-hours', OpeningHours);

  Object.assign(App, { OpeningHours });
})();
