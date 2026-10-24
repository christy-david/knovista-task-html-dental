/**
 * App-wide custom events. Components talk to each other through these
 * instead of reaching into one another, which keeps them decoupled.
 */
(() => {
  const BOOKING_OPEN = 'booking:open';
  const ARTICLE_OPEN = 'article:open';

  /** Fire an event that bubbles out of any Shadow DOM up to `document`. */
  function emit(origin, name, detail = {}) {
    origin.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail }));
  }

  /**
   * Like `event.target.closest('[attr]')`, but sees through Shadow DOM
   * by walking the event's composed path.
   */
  function closestInPath(event, attr) {
    return event.composedPath().find((node) => node instanceof Element && node.hasAttribute(attr));
  }

  Object.assign(App, { BOOKING_OPEN, ARTICLE_OPEN, emit, closestInPath });
})();
