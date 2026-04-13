import { z } from 'zod';
import { HookFormField } from '@/components/molecules/HookForm';

export interface FormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  subject: string;
  howCanWeHelp: string;
}

export const HERO = {
  title: 'Contact & support',
  description:
    'Have a question or need support? We’re here to help! ' +
    'Connect with us through our contact form, email, or phone — let’s find the solution together.',
  backgroundImage: '/images/contact-and-support/hero.jpg',
};

export const CONTACT_INFORMATION = [
  {
    id: 'customer-service-number',
    title: 'Customer service number',
    icon: '/icons/contact-and-support/headphones.svg',
    linkLabel: '920 021 421',
    linkHref: 'tel:920021421',
    availability: ['Sun - Thu', '8:00 AM - 4:00 PM'],
  },
  {
    id: 'beneficiary-support',
    title: 'Beneficiary support',
    icon: '/icons/contact-and-support/circle_info.svg',
    buttonHref: '#',
    buttonLabel: 'Go to Beneficiary support',
  },
  {
    id: 'appointment-booking-platform',
    title: 'Appointment booking platform',
    icon: '/icons/contact-and-support/calendar.svg',
    buttonHref: '#',
    buttonLabel: 'Book your appointment',
  },
  {
    id: 'saip-location',
    title: 'SAIP location',
    icon: '/icons/contact-and-support/location.svg',
    locationHref: '#',
    locationAddress: [
      'Riyadh 13321,',
      'As Sahafah Olaya St 6531, 3059,',
      'Saudi Authority for Intellectual Property',
    ],
  },
  {
    id: 'social-media',
    title: 'Social media',
    icon: '/icons/contact-and-support/internet.svg',
    socialMedia: [
      {
        ariaLabel: 'X',
        href: '#',
        icon: '/icons/contact-and-support/x.svg',
      },
      {
        ariaLabel: 'YouTube',
        href: '#',
        icon: '/icons/contact-and-support/youtube.svg',
      },
      {
        ariaLabel: 'Instagram',
        href: '#',
        icon: '/icons/contact-and-support/instagram.svg',
      },
      {
        ariaLabel: 'LinkedIn',
        href: '#',
        icon: '/icons/contact-and-support/linkedin.svg',
      },
      {
        ariaLabel: 'Snapchat',
        href: '#',
        icon: '/icons/contact-and-support/snapchat.svg',
      },
      {
        ariaLabel: 'Facebook',
        href: '#',
        icon: '/icons/contact-and-support/facebook.svg',
      },
    ],
  },
];

export const APPOINTMENT_BOOKING = {
  heading: 'Book your appointment with SAIP',
  description:
    "Before you visit the SAIP headquarters, remember to book your visit online through our platform. It's quick, easy and required to ensure the best service for you.",
  image: {
    src: '/images/contact-and-support/appointment-booking.png',
    alt: 'Appointment booking',
    className: 'rounded-2xl',
  },
  buttonLabel: 'Book your appointment',
  buttonHref: '',
};

export const BENEFICIARY_SUPPORT = {
  heading: 'Beneficiary support',
  description: [
    'Our Beneficiary support service is here to assist you with any questions or issues.',
    'Reach out to get the help you need!',
  ],
  image: {
    src: '/images/contact-and-support/beneficiary-support.png',
    alt: 'Appointment booking',
    className: 'rounded-2xl',
  },
  buttonLabel: 'Go to Beneficiary support',
  buttonHref: '',
};

export const FOLLOW_US = [
  {
    ariaLabel: 'X',
    href: '#',
    icon: '/icons/contact-and-support/x.svg',
  },
  {
    ariaLabel: 'YouTube',
    href: '#',
    icon: '/icons/contact-and-support/youtube.svg',
  },
  {
    ariaLabel: 'Instagram',
    href: '#',
    icon: '/icons/contact-and-support/instagram.svg',
  },
  {
    ariaLabel: 'LinkedIn',
    href: '#',
    icon: '/icons/contact-and-support/linkedin.svg',
  },
  {
    ariaLabel: 'Snapchat',
    href: '#',
    icon: '/icons/contact-and-support/snapchat.svg',
  },
  {
    ariaLabel: 'Facebook',
    href: '#',
    icon: '/icons/contact-and-support/facebook.svg',
  },
];

export const FORM_FIELDS: HookFormField[] = [
  {
    id: 'fullName',
    label: 'Full name',
    type: 'text',
    placeholder: 'Type your full name',
    helperText: 'Please enter your full name.',
    schema: z
      .string()
      .refine((val) => (val ?? '').trim().length > 0, { message: 'Please enter your full name.' })
      .min(2, { message: 'Your name must be at least 2 characters long.' })
      .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/, {
        message:
          'Your name contains invalid characters. Please use only letters, spaces or dashes.',
      }),
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Type your Email',
    helperText: 'Please enter your email address.',
    schema: z
      .string()
      .refine((val) => (val ?? '').trim().length > 0, {
        message: 'Please enter your email address.',
      })
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
        message:
          'The email address format is invalid. Please use a valid email, e.g., mohammed.alrasheed@gmail.com.',
      }),
  },
  {
    id: 'phoneNumber',
    label: 'Phone number',
    type: 'tel',
    placeholder: 'Type your phone number',
    helperText: 'Please provide your phone number.',
    options: [
      { label: '+966', value: '+966' },
      { label: '+48', value: '+48' },
      { label: '+47', value: '+47' },
    ],
    schema: z
      .string()
      .refine((val) => (val ?? '').trim().length > 0, {
        message: 'Please provide your phone number.',
      })
      .regex(/^\+\d{1,3}\s?\d{7,15}$/, {
        message:
          'The phone number is not valid. Please ensure you include the correct country code.',
      }),
  },
  {
    id: 'subject',
    label: 'Subject',
    type: 'select',
    placeholder: 'Select your subject',
    helperText: 'Please select a subject from the list.',
    options: [
      { label: 'Option', value: 'option1' },
      { label: 'Option', value: 'option2' },
      { label: 'Option', value: 'option3' },
      { label: 'Option', value: 'option4' },
    ],
    schema: z.string().refine((val) => (val ?? '').trim().length > 0, {
      message: 'Please select a subject from the list.',
    }),
  },
  {
    id: 'howCanWeHelp',
    label: 'How can we help?',
    type: 'textarea',
    placeholder: 'Type your message',
    helperText: 'Please describe how we can help.',
    schema: z
      .string()
      .refine((val) => (val ?? '').trim().length > 0, {
        message: 'Please describe how we can help.',
      })
      .min(10, { message: 'Your message must be at least 10 characters long.' }),
  },
];
