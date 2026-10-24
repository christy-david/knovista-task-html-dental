/**
 * app.js — the single entry point every page loads:
 *   <script src="js/app.js" defer></script>
 *
 * The code is split into small files (data, lib helpers, one file per Web
 * Component). Each file registers what it provides on the global `App`
 * namespace, e.g. App.html, App.BaseComponent, App.clinic.
 *
 * These are classic scripts rather than ES modules on purpose: browsers block
 * ES modules on pages opened straight from disk (file://), so this way the
 * site works by simply double-clicking index.html, as well as on a server.
 *
 * Order matters — each file may use anything loaded above it.
 */
window.App = window.App || {};

(() => {
  const FILES = [
    // Data
    'data/site.js',

    // Helpers
    'lib/html.js',
    'lib/styles.js',
    'lib/icons.js',
    'lib/time.js',
    'lib/links.js',
    'lib/events.js',
    'lib/motion.js',
    'lib/buttons.js',
    'lib/base-component.js',

    // Web Components
    'components/app-icon.js',
    'components/site-header.js',
    'components/site-footer.js',
    'components/quick-actions.js',
    'components/booking-form.js',
    'components/booking-dialog.js',
    'components/concern-picker.js',
    'components/service-rail.js',
    'components/why-choose.js',
    'components/before-after.js',
    'components/doctor-slider.js',
    'components/testimonial-slider.js',
    'components/service-details.js',
    'components/team-grid.js',
    'components/stat-counter.js',
    'components/opening-hours.js',
    'components/filter-list.js',
    'components/article-reader.js',
    'components/scroll-spy.js',

    // Start-up: click delegation + animations
    'main.js',
  ];

  // Resolve paths relative to this file, so it works from any page
  const base = document.currentScript.src.replace(/app\.js([?#].*)?$/, '');

  // async = false keeps dynamically added scripts executing in list order
  FILES.forEach((file) => {
    const script = document.createElement('script');
    script.src = base + file;
    script.async = false;
    document.head.append(script);
  });
})();
