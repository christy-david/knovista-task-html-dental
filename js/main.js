/**
 * main.js — runs last, once every component is defined.
 *
 * 1. Wires global behaviour: [data-book] / [data-read] click delegation.
 * 2. Starts the GSAP-style motion system (js/lib/motion.js).
 */
(() => {
  const { ARTICLE_OPEN, BOOKING_OPEN, closestInPath, emit, initMotion, rollButtons } = App;

  rollButtons(document);

  /*
   * One click listener for the whole site. Because it uses the composed path,
   * it also catches clicks on buttons *inside* components' Shadow DOM.
   *
   *   <a href="contact.html#book" data-book="implants">  → opens booking dialog
   *   <button data-read>                                 → opens article reader
   *
   * Links keep a real href, so they still work if JavaScript fails to load.
   */
  document.addEventListener('click', (event) => {
    const bookTrigger = closestInPath(event, 'data-book');
    if (bookTrigger && document.querySelector('booking-dialog')) {
      event.preventDefault();
      emit(bookTrigger, BOOKING_OPEN, { service: bookTrigger.getAttribute('data-book') });
      return;
    }

    const readTrigger = closestInPath(event, 'data-read');
    if (readTrigger) {
      emit(readTrigger, ARTICLE_OPEN, { article: readTrigger.closest('article') });
    }
  });

  initMotion();
})();
