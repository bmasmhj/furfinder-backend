import type { ReactNode } from 'react'

export const supportEmail = 'support@thefurfinder.com'
export const partnershipsEmail = 'partnerships@thefurfinder.com'
export const privacyEmail = 'privacy@thefurfinder.com'

export const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/app-features', label: 'Full Feature List' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/about', label: 'Our Story' },
]

export const heroTrustItems = [
  'Free to report pets',
  'No account needed to browse',
  'Australia-wide coverage',
]

export const featureCards = [
  {
    icon: '📸',
    iconClassName: 'bg-[#fff1ed]',
    title: 'AI Photo Matching',
    description:
      'Upload a photo and our AI scans every found report, comparing coat colour, markings, face shape, and breed characteristics to surface likely matches.',
  },
  {
    icon: '📍',
    iconClassName: 'bg-[#e8f8f7]',
    title: 'GPS Location Matching',
    description:
      'Reports are matched inside your local radius so a found pet a few kilometres away gets flagged fast without manual searching.',
  },
  {
    icon: '🗺️',
    iconClassName: 'bg-[#eef2ff]',
    title: 'Interactive Map',
    description:
      'Browse live lost and found reports alongside vets, shelters, and rescue organisations across Australia in one map view.',
  },
  {
    icon: '🔎',
    iconClassName: 'bg-[#fff1ed]',
    title: 'Scan Online Posts',
    description:
      'Paste text from Facebook, Nextdoor, or local community pages and let AI cross-check it against active reports.',
  },
  {
    icon: '📱',
    iconClassName: 'bg-[#fff7e8]',
    title: 'Biometric ID Scanning',
    description:
      "Register close-up photos of your pet's face, eyes, and nose to improve identification when someone finds them.",
  },
  {
    icon: '🏥',
    iconClassName: 'bg-[#e8f8f7]',
    title: 'Vet & Shelter Directory',
    description:
      'Find nearby clinics, shelters, and rescue partners without leaving the app or opening a second search.',
  },
  {
    icon: '🔔',
    iconClassName: 'bg-[#eef2ff]',
    title: 'Area Alerts',
    description:
      'Get notified as soon as a matching lost or found pet is reported in your area so you can act quickly.',
  },
  {
    icon: '💬',
    iconClassName: 'bg-[#ebfbf1]',
    title: 'In-App Messaging',
    description:
      'Connect securely inside the app instead of sharing personal phone numbers with strangers during a stressful moment.',
  },
  {
    icon: '🎉',
    iconClassName: 'bg-[#fceef5]',
    title: 'Happy Tails Stories',
    description:
      'Celebrate successful reunions and give other families hope with stories from real pet owners.',
  },
]

export const audienceCards = [
  {
    emoji: '😢',
    title: 'My Pet Is Lost',
    description:
      "Your pet is missing and every minute feels heavy. Here's how the app helps you respond immediately.",
    items: [
      'Post a report in under 2 minutes',
      'Run AI matching against found pets nearby',
      'Create a printable flyer instantly',
      'Message people who report sightings',
      'Boost your report for extra visibility',
    ],
  },
  {
    emoji: '😊',
    title: 'I Found a Pet',
    description:
      'You found an animal and want to get them home safely without guessing where to start.',
    items: [
      'Post a found report with photos',
      'Check AI matches against lost pets',
      'Use quick biometric scans',
      'Find nearby vets and shelters',
      'Contact owners safely in-app',
    ],
  },
  {
    emoji: '🌱',
    title: 'I Want to Help',
    description:
      'You care about animals in your suburb and want to help reunite them with their people.',
    items: [
      'Browse the live map near you',
      'Get suburb-based alerts',
      'Leave tips on reports you recognise',
      'Share reports to local groups',
      'Support reward pools when needed',
    ],
  },
]

export const steps = [
  {
    title: 'Create a Report',
    description:
      'Upload photos, describe the pet, drop a pin on the map, and publish in under two minutes.',
  },
  {
    title: 'AI Scans for Matches',
    description:
      'The app compares photos, markings, breed details, and location radius across the database automatically.',
  },
  {
    title: 'Connect and Reunite',
    description:
      'When a likely match appears, both sides are notified and can coordinate a safe reunion through in-app messaging.',
  },
]

export const petTypes = ['Dogs', 'Cats', 'Birds', 'Rabbits', 'Reptiles', 'Small Animals', 'Any Other Pet']

export const pricingPlans = [
  {
    name: 'Free',
    price: 'Free',
    note: 'Always free, no credit card needed',
    cta: 'Get Started Free',
    href: "/download",
    featured: false,
    features: [
      { included: true, label: 'Post lost and found reports' },
      { included: true, label: 'Browse the interactive map' },
      { included: true, label: 'Vet and shelter directory' },
      { included: true, label: 'Community tips on reports' },
      { included: true, label: 'In-app messaging' },
      { included: true, label: 'Printable flyer generator' },
      { included: false, label: 'AI photo matching' },
      { included: false, label: 'Scan online posts' },
      { included: false, label: 'Biometric ID scanning' },
      { included: false, label: 'Multi-photo upload (up to 5)' },
    ],
  },
  {
    name: 'Premium',
    price: '$4.99',
    period: '/month',
    note: 'or $49.99/year — save 2 months',
    cta: 'Start Premium Trial',
    href: "/download",
    featured: true,
    badge: 'Most Popular',
    features: [
      { included: true, label: 'Everything in Free' },
      { included: true, label: 'AI photo matching' },
      { included: true, label: 'Scan online posts with AI' },
      { included: true, label: 'Biometric ID scanning' },
      { included: true, label: 'Multi-photo upload (up to 5 photos)' },
      { included: true, label: 'Unlimited reports and pet profiles' },
      { included: true, label: 'Area alerts for nearby pets' },
      { included: true, label: 'Boost report for extra visibility' },
    ],
  },
]

export const faqItems = [
  {
    question: 'Is The Fur Finder free to use?',
    answer:
      'Yes. Downloading the app and posting lost or found reports is free. Premium unlocks AI photo matching, online post scanning, and biometric identification.',
  },
  {
    question: 'How does the AI photo matching work?',
    answer:
      'The AI compares pet photos for coat colour, markings, facial features, and body shape, then ranks possible matches with a confidence score and explanation.',
  },
  {
    question: "I've found a stray. What should I do?",
    answer:
      'Create a found pet report with photos and a map pin, then let AI compare it against nearby lost reports. You can also check with a vet for a microchip.',
  },
  {
    question: 'My pet is lost right now. What do I do first?',
    answer:
      'Post a report immediately, contact nearby vets and shelters, share the report to your community channels, and enable alerts so you know about likely sightings quickly.',
  },
  {
    question: 'What types of pets are supported?',
    answer:
      'Dogs, cats, birds, rabbits, reptiles, small animals, and other companion pets are all supported in reports and matching.',
  },
  {
    question: 'Is my information private?',
    answer:
      'Yes. Messaging happens inside the app, and contact details stay under your control. The service is built for safe coordination, not public oversharing.',
  },
]

export const founderStory = [
  'Last year, my own dog Lucky went missing for two days, and I was devastated. I felt completely broken, unable to eat, and overwhelmed with fear and anxiety. I visited every vet, shelter, pound, and local park. I walked the streets, knocked on doors, and scoured Facebook lost and found pages, as well as community pages across different suburbs. But everything was scattered, and there was not one centralised place to get all the information I needed.',
  'Time was critical in locating Lucky. We live in an area with busy roads and reckless drivers, and I was terrified that he might be hurt. When I finally found him after two and a half days, he was traumatised, hungry, thirsty, and in pain. I was incredibly lucky to have found him, but not everyone is.',
  'Every minute counts when a pet is lost. Too often these animals end up in far-away pounds, shelters, or with people who do not know how to reunite them quickly. That experience is what pushed me to create The Fur Finder.',
  'The app brings lost and found information into one place, adds AI to reduce the searching burden, and helps families act faster when panic is highest. I hope it helps reunite as many pets with their families as possible.',
]

export const appFeatureSections: Array<{
  title: string
  intro?: string
  highlight?: { tone: 'coral' | 'teal'; title: string; body: string }
  items?: Array<{ title: string; body: string }>
}> = [
  {
    title: '1. App Overview',
    intro:
      'The Fur Finder is a mobile app designed to reunite lost pets with their owners across Australia. It combines AI-powered photo matching, community tools, GPS-based search, and pet registration into one experience on iOS and Android.',
    highlight: {
      tone: 'coral',
      title: 'Mission',
      body: 'Reduce the number of lost pets, minimise shelter intake, and build a compassionate community of pet lovers through technology.',
    },
  },
  {
    title: '2. Core Features',
    items: [
      {
        title: 'Report Lost or Found Pets',
        body: 'Quick reporting, multi-photo upload, detailed pet information, GPS location tagging, contact details, and optional reward support.',
      },
      {
        title: 'Home Feed',
        body: 'A live feed of active lost and found reports with filters for type, pet category, and proximity.',
      },
      {
        title: 'Interactive Map',
        body: 'Colour-coded map markers for lost pets, found pets, vets, shelters, and rescue organisations with adjustable search radius.',
      },
      {
        title: 'Pet Profile Registration',
        body: 'Pre-register pets with photos, biometric images, suburb tags, and medical notes so owners can act faster if a pet goes missing.',
      },
      {
        title: 'My Pets Dashboard',
        body: 'Manage registered pets and active reports in one place, with status tracking for boosted and reunited reports.',
      },
    ],
  },
  {
    title: '3. AI-Powered Features',
    highlight: {
      tone: 'teal',
      title: 'Technology',
      body: 'Powered by OpenAI vision-enabled workflows for both text and image analysis.',
    },
    items: [
      {
        title: 'AI Pet Matching',
        body: 'Compares photos, descriptions, GPS radius, and profile details to return confidence-based matches between lost, found, and registered pets.',
      },
      {
        title: 'Scan Online Posts',
        body: 'Extracts structured pet information from pasted social posts or URLs and checks it against live app data.',
      },
    ],
  },
]

export const privacySections = [
  {
    title: '1. Information We Collect',
    body:
      'We collect contact details, optional GPS location you explicitly share, pet photos, report information, and pet-related details used for matching. When AI features are used, pet descriptions and imagery are processed to help surface likely matches.',
  },
  {
    title: '2. How We Use Your Information',
    body:
      'We use your information to help reunite pets, power AI matching, notify users about nearby activity, and support core community features. We do not sell personal data for advertising.',
  },
  {
    title: '3. How We Store Your Data',
    body:
      'Data is stored on secured cloud infrastructure with encrypted transmission and password hashing. Users can delete reports, profiles, and account data through the app, with backup retention limited to operational recovery windows.',
  },
  {
    title: '4. Sharing Your Information',
    body:
      'Pet reports are visible to other users to support reunification. AI processing is used only for matching-related functionality. We do not share personal information for third-party marketing.',
  },
  {
    title: '5. Your Rights',
    body:
      'You can request access, correction, deletion, and withdrawal of consent in line with Australian privacy obligations. Complaints can be directed to the support address listed below.',
  },
]

export const termsSections = [
  {
    title: '1. Acceptance of Terms',
    body:
      'By downloading or using The Fur Finder, you agree to these terms and to Australian consumer law requirements that apply to the service.',
  },
  {
    title: '2. Description of Service',
    body:
      'The app provides lost and found pet reporting, pet profile registration, AI-assisted matching, community messaging, and rescue organisation support tools.',
  },
  {
    title: '3. User Responsibilities',
    body:
      'Users must provide accurate information, avoid fraudulent or harmful content, respect other users’ privacy, and only use the app for legitimate pet reunification and support purposes.',
  },
  {
    title: '4. AI Matching Disclaimer',
    body:
      'AI results are suggestions only. Owners and finders should still verify identity carefully through direct confirmation, physical checks, and microchip verification where possible.',
  },
  {
    title: '5. Subscription and Premium Features',
    body:
      'Premium subscriptions unlock additional AI and visibility tools. Billing and cancellation are handled through the relevant app store platform.',
  },
]

export const deleteAccountCards: Array<{ title: string; content: ReactNode }> = [
  {
    title: 'Delete Your Account',
    content:
      'You can request permanent deletion of your The Fur Finder account and associated data at any time. This action removes your account details, pet reports, registered pet profiles, comments, biometric scans, and notification history.',
  },
  {
    title: 'How to Delete Your Account',
    content:
      'Option 1: In the app, open Settings, go to Account, tap Delete My Account, and confirm. Option 2: send an email request with your account email address and we will process it.',
  },
  {
    title: 'Data Retention',
    content:
      'Active records are removed from our main database when deletion is processed. Operational backups are purged on the normal retention cycle, and only anonymised analytics may remain.',
  },
]
