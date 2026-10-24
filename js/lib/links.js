(() => {
  const { clinic } = App;

  const telLink = (number = clinic.phone) => `tel:${number}`;

  const waLink = (text = 'Hi, I would like to book a dental appointment') =>
    `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(text)}`;

  const mailLink = (subject = '', body = '') =>
    `mailto:${clinic.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const mapLink = () =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(clinic.mapQuery)}`;

  Object.assign(App, { telLink, waLink, mailLink, mapLink });
})();
