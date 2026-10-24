/**
 * <article-reader>
 * Opens blog posts in a native <dialog>. Each post <article> keeps its
 * full text in a <template>; app.js turns clicks on [data-read] into an
 * `article:open` event carrying that <article>.
 */
(() => {
  const { ARTICLE_OPEN, BaseComponent, css, html, icon, shared } = App;

  class ArticleReader extends BaseComponent {
    static styles = [shared.typography, shared.buttons, css('components/modal.css')];

    render() {
      return html`
        <dialog class="wide" aria-labelledby="title">
          <img class="cover" alt="">
          <div class="body">
            <div class="head">
              <div>
                <div class="meta"></div>
                <h2 id="title"></h2>
              </div>
              <button type="button" class="close" aria-label="Close">${icon('x')}</button>
            </div>
            <div class="article"></div>
            <div class="btn-row">
              <a href="contact.html#book" class="btn btn-primary" data-book>${icon('calendar')} Book a consultation</a>
            </div>
          </div>
        </dialog>`;
    }

    afterRender() {
      this.dialog = this.$('dialog');
      this.$('.close').addEventListener('click', () => this.dialog.close());
      this.dialog.addEventListener('click', (e) => {
        if (e.target === this.dialog) this.dialog.close();
      });
      // Close the article first so the booking dialog isn't stacked on top
      this.$('[data-book]').addEventListener('click', () => this.dialog.close());
      this.dialog.addEventListener('close', () => document.documentElement.classList.remove('modal-open'));

      document.addEventListener(ARTICLE_OPEN, (e) => this.open(e.detail.article));
    }

    open(post) {
      const template = post?.querySelector('template');
      if (!template) return;

      this.$('.cover').src = post.querySelector('img').src.replace('w=800', 'w=1400');
      this.$('.meta').innerHTML = post.querySelector('.post-meta').innerHTML;
      this.$('#title').textContent = post.querySelector('h2, h3').textContent;
      this.$('.article').replaceChildren(template.content.cloneNode(true));

      document.documentElement.classList.add('modal-open');
      this.dialog.showModal();
      this.dialog.scrollTop = 0;
    }
  }

  customElements.define('article-reader', ArticleReader);

  Object.assign(App, { ArticleReader });
})();
