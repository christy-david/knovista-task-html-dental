/**
 * <why-choose>
 * Smilora-style numbered list: picking a reason expands its text and
 * cross-fades the photo beside it.
 */
(() => {
  const { BaseComponent, css, html, icon, photo, reasons, shared } = App;

  class WhyChoose extends BaseComponent {
    static styles = [shared.typography, css('components/why-choose.css')];

    render() {
      return html`
        <div class="wrap">
          <ol>
            ${reasons.map((r, i) => html`
              <li class="${i === 0 ? 'active' : ''}">
                <button type="button" aria-expanded="${i === 0}" aria-controls="p${i}" data-i="${i}">
                  <span class="n">${String(i + 1).padStart(2, '0')}</span>
                  <span class="t">${r.title}</span>
                </button>
                <div class="panel" id="p${i}"><div><p>${r.text}</p></div></div>
              </li>
            `)}
          </ol>
          <div class="stage">
            ${reasons.map((r, i) => html`<img src="${photo(r.img, 1000)}" alt="" class="${i === 0 ? 'active' : ''}" loading="lazy">`)}
            <div class="badge">${icon('check-circle')}<span>${reasons[0].badge}</span></div>
          </div>
        </div>`;
    }

    afterRender() {
      this.$('ol').addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (button) this.select(Number(button.dataset.i));
      });
    }

    select(index) {
      this.$$('li').forEach((li, i) => {
        li.classList.toggle('active', i === index);
        li.querySelector('button').setAttribute('aria-expanded', String(i === index));
      });
      this.$$('.stage img').forEach((img, i) => img.classList.toggle('active', i === index));
      this.$('.badge span').textContent = reasons[index].badge;
    }
  }

  customElements.define('why-choose', WhyChoose);

  Object.assign(App, { WhyChoose });
})();
