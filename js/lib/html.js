/**
 * Tiny tagged-template helper for building component markup.
 * Arrays are joined (so `.map()` works inline) and null/false render nothing.
 *
 *   html`<ul>${items.map((i) => html`<li>${i}</li>`)}</ul>`
 */
(() => {
  const html = (strings, ...values) =>
    strings.reduce((out, str, i) => {
      const value = values[i];
      const text = value == null || value === false ? '' : Array.isArray(value) ? value.join('') : value;
      return out + str + (i < values.length ? text : '');
    }, '');

  Object.assign(App, { html });
})();
