// Keep copy separate from presentation so a Hebrew locale can be added later.
// Biographical facts and contact information must be verified with Dr. Morris.
export const site = {
  name: 'Dr. Eitan Morris',
  title: 'Dr. Eitan Morris | Personal dental care',
  description: 'Meet Dr. Eitan Morris. A personal approach to dental care, with space for your questions and care for your smile.',
  language: 'en',
  direction: 'ltr',
  navigation: [
    { label: 'Meet Dr. Morris', href: '/about/' },
    { label: 'The approach', href: '/#approach' },
    { label: 'Clinics & appointments', href: '/clinics/' },
  ],
  contact: {
    email: 'dreitanmorris@gmail.com',
    phone: '',
    phoneDisplay: '',
    whatsapp: '',
    address: '',
    mapsUrl: '',
  },
  portrait: '/images/dr-eitan-morris.png',
  principles: [
    { number: '01', title: 'A conversation first.', text: 'Good care begins with listening. Share what brings you here, what matters to you, and any concerns you have.' },
    { number: '02', title: 'Clarity, at every step.', text: 'Understand your options, ask your questions, and feel informed about the next step in your care.' },
    { number: '03', title: 'Care that feels personal.', text: 'Your needs, your priorities, your smile. A thoughtful approach starts with seeing the person behind it.' },
  ],
  visit: [
    { number: '01', title: 'Let’s get to know you', text: 'A chance to talk about your dental history, your concerns, and what you’d like to achieve.' },
    { number: '02', title: 'Understand your smile', text: 'An examination helps build a picture of your oral health and identify what needs attention.' },
    { number: '03', title: 'Find your next step', text: 'Discuss the findings and your options together, with time to ask questions before making decisions.' },
  ],
  faqs: [
    { question: 'I feel nervous about visiting the dentist. Can we talk first?', answer: 'Of course. Mention how you feel when you get in touch. Knowing your concerns before your visit is a helpful first step toward making the experience more comfortable.' },
    { question: 'What should I bring to my first visit?', answer: 'Bring any recent dental records or X-rays you have, a list of medications, and any questions you would like to discuss. The clinic can confirm whether anything else is needed when you arrange your appointment.' },
    { question: 'Will I be able to discuss my treatment options?', answer: 'Your visit is an opportunity to understand your oral health, discuss the available options, and ask about the recommended next steps, timing, and costs.' },
    { question: 'How do I arrange an appointment?', answer: 'Use the contact details below to get in touch and arrange a suitable time.' },
  ],
} as const;
