/**
 * <quick-actions>
 * Desktop: floating WhatsApp button.
 * Phones: a bottom bar with Call / WhatsApp / Book, always within thumb reach.
 */
(() => {
  const { BaseComponent, css, html, icon, telLink, waLink } = App;

  class QuickActions extends BaseComponent {
    static styles = [css('components/quick-actions.css')];

    render() {
      return html`
        <a href="${waLink()}" class="float-wa" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon('whatsapp')}</a>
        <nav class="bar" aria-label="Quick actions">
          <a href="${telLink()}">${icon('phone')} Call</a>
          <a href="${waLink()}" class="wa" target="_blank" rel="noopener">${icon('whatsapp')} Chat</a>
          <a href="contact.html#book" class="book" data-book>${icon('calendar')} Book</a>
        </nav>`;
    }
  }

  customElements.define('quick-actions', QuickActions);

  Object.assign(App, { QuickActions });
})();
