/**
 * Site-wide content and settings — the single source of truth.
 * Edit the clinic's details here once and every component updates.
 *
 * Content scope (concerns, treatment list, safety protocol, plans, FAQ
 * topics) is modelled on what large Indian dental chains like Clove Dental
 * offer, rewritten for a single clinic. All figures are placeholders.
 */
(() => {
  /** Unsplash image URL helper */
  const photo = (id, w = 1200) =>
    `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

  const clinic = {
    name: 'Pearl Smile',
    tagline: 'Dental Clinic',
    phone: '+919847012345',
    phoneDisplay: '+91 98470 12345',
    landline: '+914842401234',
    landlineDisplay: '0484 240 1234',
    whatsapp: '919847012345',
    email: 'hello@pearlsmiledental.in',
    area: 'Kakkanad, Kochi',
    address: ['2nd Floor, Lakeview Plaza', 'Seaport–Airport Road', 'Kakkanad, Kochi, Kerala 682030'],
    mapQuery: 'Kakkanad, Kochi, Kerala',
    timeZone: 'Asia/Kolkata',
  };

  // days: 0 = Sunday … 6 = Saturday — open 7 days
  const hours = [
    { label: 'Monday – Saturday', days: [1, 2, 3, 4, 5, 6], open: '09:00', close: '20:30' },
    { label: 'Sunday', days: [0], open: '10:00', close: '14:00' },
  ];

  const nav = [
    { href: 'index.html', label: 'Home' },
    { href: 'about.html', label: 'About' },
    { href: 'services.html', label: 'Treatments' },
    { href: 'blog.html', label: 'Blog' },
    { href: 'contact.html', label: 'Contact' },
  ];

  /* ---------------------------------------------------------------- Treatments */
  const services = [
    { id: 'checkup',    icon: 'stethoscope', name: 'Check-up & Cleaning',   price: '₹800',     duration: '45 min',       img: '1606811971618-4486d14f3f99',
      summary: 'A full oral exam, digital X-ray if needed, and ultrasonic scaling and polishing.',
      points: ['Full oral & gum examination', 'Ultrasonic scaling and polishing', 'Personalised home-care plan'] },
    { id: 'fillings',   icon: 'circle-dot',  name: 'Tooth-coloured Fillings', price: '₹1,200', duration: '30 min',       img: '1698749778813-ad5f2814e50f',
      summary: 'Composite fillings matched to your tooth shade — no metal, no grey edges.',
      points: ['Shade-matched composite resin', 'Bonded in a single visit', 'Replaces old silver fillings'] },
    { id: 'rct',        icon: 'tooth',       name: 'Root Canal Treatment',  price: '₹4,500',   duration: '1–2 visits',   img: '1588776814546-1ffcf47267a5',
      summary: 'Rotary and microscope-assisted root canals that save the natural tooth.',
      points: ['Single-sitting in most cases', 'Rotary instruments & apex locator', 'Protected with a zirconia crown'] },
    { id: 'extraction', icon: 'syringe',     name: 'Wisdom Tooth Removal',  price: '₹2,500',   duration: '45 min',       img: '1588776813941-dcf9c55e84d2',
      summary: 'Gentle surgical and laser-assisted extractions with clear aftercare.',
      points: ['Digital X-ray planning', 'Painless local anaesthesia', 'Written aftercare & follow-up call'] },
    { id: 'gum',        icon: 'heart-pulse', name: 'Advanced Gum Care',     price: '₹3,000',   duration: '2 visits',     img: '1657470179447-0f5aa16daa91',
      summary: 'Deep cleaning and laser gum therapy for bleeding, receding or swollen gums.',
      points: ['Deep cleaning (scaling & root planing)', 'Laser-assisted gum therapy', 'Treatment for bad breath & bleeding'] },
    { id: 'braces',     icon: 'smile',       name: 'Dental Braces',         price: '₹35,000',  duration: '12–18 months', img: '1674775372064-8c75d3f8c757',
      summary: 'Metal and ceramic braces for teens and adults, with monthly reviews.',
      points: ['Metal or tooth-coloured ceramic', 'Monthly progress reviews', 'Retainers included'] },
    { id: 'aligners',   icon: 'smile-plus',  name: 'Clear Aligners',        price: '₹65,000',  duration: '6–12 months',  img: '1564420228450-d9a5bc8d6565',
      summary: 'Nearly invisible, removable aligners planned with a 3D smile preview.',
      points: ['3D smile preview before you start', 'Removable for eating & brushing', 'Fewer clinic visits than braces'] },
    { id: 'implants',   icon: 'layers',      name: 'Dental Implants',       price: '₹25,000',  duration: '2–3 visits',   img: '1593022356769-11f762e25ed9',
      summary: 'Titanium implants placed with 3D guidance, topped with a natural crown.',
      points: ['3D-guided placement', 'Single, multiple & full-mouth', 'Lifetime warranty on premium implants'] },
    { id: 'crowns',     icon: 'crown',       name: 'Crowns & Bridges',      price: '₹5,000',   duration: '2 visits',     img: '1600170311833-c2cf5280ce49',
      summary: 'Zirconia and ceramic crowns, digitally scanned for a precise fit.',
      points: ['Digital scan, no messy moulds', 'Zirconia, E-max & PFM options', 'Bridges to replace missing teeth'] },
    { id: 'dentures',   icon: 'smile',       name: 'Dentures',              price: '₹12,000',  duration: '3 visits',     img: '1670250492416-570b5b7343b1',
      summary: 'Comfortable full and partial dentures, including implant-supported options.',
      points: ['Full & partial dentures', 'Flexible, metal-free options', 'Implant-supported dentures'] },
    { id: 'kids',       icon: 'baby',        name: 'Kids Dentistry',        price: '₹600',     duration: '30 min',       img: '1626736985932-c0df2ae07a2e',
      summary: 'Friendly first visits, fluoride, sealants and habit counselling for children.',
      points: ['First check-up from age 1', 'Fluoride varnish & pit sealants', 'Habit counselling (thumb-sucking)'] },
    { id: 'cosmetic',   icon: 'sparkles',    name: 'Whitening & Veneers',   price: '₹6,000',   duration: '1 hour',       img: '1677026010083-78ec7f1b84ed',
      summary: 'In-clinic whitening, veneers and digital smile design.',
      points: ['In-clinic whitening in about an hour', 'Porcelain & composite veneers', 'Digital smile design'] },
    { id: 'laser',      icon: 'zap',         name: 'Laser Dentistry',       price: '₹3,500',   duration: '30–60 min',    img: '1771442873038-dda05b6ca447',
      summary: 'Minimally invasive laser treatment for gums, ulcers and sensitivity.',
      points: ['Minimal bleeding, faster healing', 'Mouth ulcer & sensitivity relief', 'Gum contouring'] },
  ];

  // Extra choices that only appear in the booking form
  const extraBookingOptions = [
    { id: 'emergency', name: 'Emergency / Tooth pain' },
    { id: 'followup', name: 'Follow-up appointment' },
    { id: 'other', name: 'Not sure – need advice' },
  ];

  const bookingOptions = [...services, ...extraBookingOptions];
  const serviceName = (id) => bookingOptions.find((s) => s.id === id)?.name ?? id;

  /* ------------------------------------------- "How can we help you today?" */
  const concerns = [
    { icon: 'stethoscope', label: 'Regular check-up', hint: 'Every 6 months', service: 'checkup' },
    { icon: 'siren', label: 'Tooth pain', hint: 'Seen same day', service: 'emergency' },
    { icon: 'droplets', label: 'Teeth cleaning', hint: '45 minutes', service: 'checkup' },
    { icon: 'layers', label: 'Dental implants', hint: 'Free consult', service: 'implants' },
    { icon: 'smile-plus', label: 'Braces & aligners', hint: '3D smile preview', service: 'aligners' },
    { icon: 'baby', label: 'Kids dentistry', hint: 'From age 1', service: 'kids' },
    { icon: 'zap', label: 'Emergency care', hint: 'Call anytime', service: 'emergency' },
    { icon: 'refresh-cw', label: 'Follow-up visit', hint: 'Existing patients', service: 'followup' },
  ];

  /* ------------------------------------------------ Why patients choose us */
  const reasons = [
    { title: 'Specialist-led treatment', img: '1662837625421-5fd8ed6131a0', badge: '4 of 6 dentists hold an MDS',
      text: 'Every plan is made by a specialist in that field — endodontists for root canals, orthodontists for braces — and reviewed before treatment starts.' },
    { title: 'A 4-step sterilisation protocol', img: '1588776814546-daab30f310ce', badge: 'Sealed kits, opened in front of you',
      text: 'Instruments are cleaned, disinfected, sterilised in a Class-B autoclave and sealed. Each chair is wiped down and logged between patients.' },
    { title: 'Digital & laser technology', img: '1600170311833-c2cf5280ce49', badge: '3D intraoral scanning',
      text: 'Digital X-rays use a fraction of the radiation, 3D scans replace messy moulds, and lasers make gum and soft-tissue work gentler.' },
    { title: 'Costs in writing, easy EMI', img: '1777331903190-341a3dd0441b', badge: 'No-cost EMI above ₹10,000',
      text: 'You get a written estimate before anything begins. Insurance claims are filed for you, and larger treatments can be split into EMIs.' },
    { title: 'Follow-up that really follows up', img: '1617812191081-2a24e3f30e45', badge: 'Calls at 24 hours & 7 days',
      text: 'After major treatment our team calls to check on you, and a dentist is reachable on WhatsApp for any questions.' },
  ];

  /* ------------------------------------------------ Patient-safety protocol */
  const safetySteps = [
    { icon: 'spray-can', title: 'Clean', text: 'Instruments are scrubbed and run through an ultrasonic cleaner to remove every trace of debris.' },
    { icon: 'droplets', title: 'Disinfect', text: 'Hospital-grade disinfectant for instruments, chairs and every surface a patient touches.' },
    { icon: 'flame', title: 'Sterilise', text: 'A Class-B vacuum autoclave — the highest standard — kills all bacteria, viruses and spores.' },
    { icon: 'package', title: 'Seal & log', text: 'Kits are sealed in dated pouches and opened in front of you. Every cycle is recorded.' },
  ];

  /* -------------------------------------------------------------- Doctors */
  const doctors = [
    { name: 'Dr. Anil Menon', role: 'Founder · Implantologist', qual: 'BDS, MDS (Prosthodontics)', img: '1758691463582-11aea602cd4a', service: 'implants',
      spec: 'Implants, full-mouth rehabilitation and complex crown & bridge work.',
      bio: 'With over 20 years in practice and 2,500+ implants placed, Dr. Menon founded Pearl Smile so patients would always leave understanding their treatment.',
      facts: ['20+ years', 'Malayalam · English'] },
    { name: 'Dr. Anjali Varghese', role: 'Endodontist', qual: 'BDS, MDS (Endodontics)', img: '1681939278218-a755fb2bf2d3', service: 'rct',
      spec: 'Painless single-sitting root canals, re-treatments and microscope dentistry.',
      bio: 'Dr. Anjali is known for calming nervous patients. She has performed more than 4,000 root canals and leads our sterilisation programme.',
      facts: ['12 years', 'Malayalam · Tamil'] },
    { name: 'Dr. Rohan Thomas', role: 'Orthodontist', qual: 'BDS, MDS (Orthodontics)', img: '1622253692010-333f2da6031d', service: 'aligners',
      spec: 'Braces, clear aligners and early orthodontic care for children.',
      bio: 'A certified aligner provider, Dr. Rohan shows every patient a 3D preview of their result before treatment begins.',
      facts: ['10 years', 'English · Hindi'] },
    { name: 'Dr. Meera Pillai', role: 'Paediatric Dentist', qual: 'BDS, MDS (Pedodontics)', img: '1606265752439-1f18756aa5fc', service: 'kids',
      spec: 'First dental visits, preventive care and anxiety-free treatment for kids.',
      bio: 'Dr. Meera turns check-ups into a game. She runs our school dental camps and parents\' oral-health workshops.',
      facts: ['8 years', 'Malayalam · English'] },
  ];

  /* --------------------------------------------------------- Testimonials */
  const testimonials = [
    { name: 'Lakshmi Nair', treatment: 'Clear aligners', img: '1617812191081-2a24e3f30e45', doctor: 2,
      quote: 'I was hiding my smile in every photo. Ten months of aligners later, I can\'t stop smiling — and nobody even noticed I was wearing them.' },
    { name: 'Fathima Shirin', treatment: 'Root canal', img: '1567516364473-233c4b6fcfbe', doctor: 1,
      quote: 'I put off my root canal for a year out of fear. Dr. Anjali explained every step and it honestly felt like a filling. I wish I\'d come sooner.' },
    { name: 'Ananya Joseph', treatment: 'Whitening', img: '1489278353717-f64c6ee8a4d2', doctor: 0,
      quote: 'Whitening before my wedding, done in an hour. The result looked natural, and the price was exactly what they quoted on day one.' },
  ];

  /* -------------------------------------------------------- Dental plans */
  const plans = [
    { name: 'Smile Care', price: '₹650', period: '/ year',
      text: 'For individuals who want to stay on top of their oral health.',
      features: ['Unlimited consultations for a year', 'One full cleaning & polishing', 'Digital X-ray included', '₹1,800 treatment voucher', '10% off all treatments'] },
    { name: 'Family Care+', price: '₹750', period: '/ year', featured: true,
      text: 'Covers your family of up to 4, plus savings on bigger treatments.',
      features: ['Everything in Smile Care, for 4 people', 'Kids\' fluoride & sealant check', '₹3,500 off braces, aligners or implants', 'Priority weekend appointments', 'Lifetime renewal at the same price'] },
  ];

  Object.assign(App, { photo, clinic, hours, nav, services, extraBookingOptions, bookingOptions, serviceName, concerns, reasons, safetySteps, doctors, testimonials, plans });
})();
