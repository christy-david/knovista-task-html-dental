(() => {
  const { clinic, hours } = App;

  const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const toMinutes = (hhmm) => {
    const [h, m] = hhmm.split(':').map(Number);
    return h * 60 + m;
  };

  /** "20:00" → "8 PM", "09:30" → "9:30 AM" */
  function formatTime(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return m ? `${hour}:${String(m).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`;
  }

  /** Current time at the clinic, regardless of the visitor's own time zone. */
  const clinicNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: clinic.timeZone }));

  const hoursFor = (day) => hours.find((h) => h.days.includes(day));

  /** → { open: boolean, text: "Open now · until 8 PM" | "Closed · opens tomorrow 9 AM" } */
  function openStatus(now = clinicNow()) {
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    const today = hoursFor(day);

    if (today && mins >= toMinutes(today.open) && mins < toMinutes(today.close)) {
      return { open: true, text: `Open now · until ${formatTime(today.close)}` };
    }

    for (let offset = 0; offset < 7; offset++) {
      const d = (day + offset) % 7;
      const slot = hoursFor(d);
      if (!slot || (offset === 0 && mins >= toMinutes(slot.open))) continue;
      const when = offset === 0 ? 'today' : offset === 1 ? 'tomorrow' : DAY_NAMES[d];
      return { open: false, text: `Closed · opens ${when} ${formatTime(slot.open)}` };
    }
    return { open: false, text: 'Closed' };
  }

  Object.assign(App, { formatTime, clinicNow, hoursFor, openStatus });
})();
