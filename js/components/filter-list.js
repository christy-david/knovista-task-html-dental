/**
 * <filter-list placeholder="Search articles…">
 * Wrap items that have data-category="…". The filter bar (chips + search)
 * lives in Shadow DOM; the items stay in light DOM and are shown via <slot>.
 */
(() => {
  const { BaseComponent, css, html, icon, shared } = App;

  class FilterList extends BaseComponent {
    static styles = [shared.typography, shared.chips, css('components/filter-list.css')];

    #active = 'All';
    #query = '';

    get items() {
      return [...this.querySelectorAll('[data-category]')];
    }

    render() {
      const categories = ['All', ...new Set(this.items.map((item) => item.dataset.category))];

      return html`
        <div class="bar">
          <div class="chips" role="group" aria-label="Filter by topic">
            ${categories.map((c, i) => html`
              <button type="button" class="chip" data-filter="${c}" aria-pressed="${i === 0}">${c}</button>
            `)}
          </div>
          <div class="search">
            ${icon('search')}
            <input type="search" placeholder="${this.getAttribute('placeholder') ?? 'Search…'}" aria-label="Search">
          </div>
        </div>
        <slot></slot>
        <p class="empty" hidden>Nothing matches that search — try another word.</p>`;
    }

    afterRender() {
      this.$('.chips').addEventListener('click', (e) => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        this.#active = chip.dataset.filter;
        this.$$('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        this.apply();
      });

      this.$('input').addEventListener('input', (e) => {
        this.#query = e.target.value.trim().toLowerCase();
        this.apply();
      });
    }

    apply() {
      let shown = 0;
      this.items.forEach((item) => {
        const visible = (this.#active === 'All' || item.dataset.category === this.#active)
          && item.textContent.toLowerCase().includes(this.#query);
        item.hidden = !visible;
        if (visible) shown++;
      });
      this.$('.empty').hidden = shown > 0;
    }
  }

  customElements.define('filter-list', FilterList);

  Object.assign(App, { FilterList });
})();
