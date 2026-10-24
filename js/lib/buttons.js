/**
 * Smilora-style "rolling text" buttons.
 * Wraps each .btn's text in <span class="roll"><span class="roll-inner">…</span></span>;
 * buttons.css then slides the label up on hover while a copy rolls in.
 * Safe to call repeatedly — already-processed buttons are skipped.
 */
(() => {
  function rollButtons(root = document) {
    root.querySelectorAll('.btn:not([data-rolled])').forEach((btn) => {
      btn.setAttribute('data-rolled', '');
      [...btn.childNodes].forEach((node) => {
        const text = node.nodeType === Node.TEXT_NODE ? node.textContent.trim() : '';
        if (!text) return;
        const roll = document.createElement('span');
        const inner = document.createElement('span');
        roll.className = 'roll';
        inner.className = 'roll-inner';
        inner.dataset.text = text;
        inner.textContent = text;
        roll.append(inner);
        node.replaceWith(roll);
      });
    });
  }

  Object.assign(App, { rollButtons });
})();
