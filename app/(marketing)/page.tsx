import type { Metadata } from 'next'
import Link from 'next/link'
import styles from './landing-page.module.css'

export const metadata: Metadata = {
  title: "The Fur Finder — Australia's AI-Powered Lost & Found Pets App",
  description:
    'Report lost or found pets, get instant AI photo matching, and connect with your community to bring pets home. Available on iOS and Android.',
}

const appStoreUrl = 'https://apps.apple.com/app/id6759967208'
const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.petreunite.app'

const featureCards = [
  ['📸', styles.fiCoral, 'AI Photo Matching', 'Upload a photo and our AI scans every found report — comparing coat colour, markings, face shape, and breed characteristics to surface the most likely matches.'],
  ['📍', styles.fiTeal, 'GPS Location Matching', 'Reports are automatically matched within your local area. A found pet 2km from a lost report gets flagged instantly, without you having to search manually.'],
  ['🗺️', styles.fiPurple, 'Interactive Map', 'See every lost and found pet near you on a live map. Locate nearby vets, shelters, and rescue organisations across all 8 Australian states and territories.'],
  ['🔍', styles.fiCoral, 'Scan Online Posts', 'Paste text from Facebook, Nextdoor, or local community groups and our AI instantly cross-checks it against every active report in the app.'],
  ['📲', styles.fiAmber, 'Biometric ID Scanning', "Register close-up photos of your pet's nose, eyes, and face. If spotted, anyone can do a quick photo scan to identify your pet — even without a microchip."],
  ['🏥', styles.fiTeal, 'Vet & Shelter Directory', '89+ verified listings across Australia. Call, get directions, or check their hours directly from the app — no separate searches needed.'],
  ['🔔', styles.fiPurple, 'Area Alerts', 'Get a push notification the moment a lost or found pet is reported within your area. Be the first to know and the first to help.'],
  ['💬', styles.fiGreen, 'In-App Messaging', 'Found a match? Message the report owner directly and securely inside the app — no need to share personal phone numbers with strangers.'],
  ['🎉', styles.fiPink, 'Happy Tails Stories', 'A dedicated section celebrating every successful reunion. Share your story and give hope to others going through the same heartbreak right now.'],
]

const faqItems = [
  ['Is The Fur Finder free to use?', 'Yes — downloading the app and posting lost or found reports is completely free, no credit card required. Premium ($4.99/month) unlocks AI photo matching, post scanning, and biometric identification for those who want the full toolkit.'],
  ['How does the AI photo matching work?', 'When you upload a photo of your pet, our AI analyses it for visual characteristics — coat colour and patterns, facial features, markings, and body shape. It then compares these against every found pet report within your search radius and returns a ranked list of potential matches with a confidence percentage and written explanation.'],
  ["I've found a stray — what should I do?", 'Open the app, tap "Report Found Pet", take a few photos, and drop a pin on the map where you found them. Our AI will immediately check it against all active lost reports in the area. You can also use the Quick Snap feature to photograph the pet and run a biometric scan to see if their owner has registered them. In the meantime, check if the pet is microchipped at your nearest vet — it\'s free.'],
  ['My pet is lost right now — what do I do first?', 'Stay calm, then: 1) Post a lost report in the app immediately with the best photos you have. 2) Share the report to your local Facebook and community groups. 3) Contact nearby vets and shelters — the app\'s directory makes this easy. 4) Use the app\'s printable flyer feature to create posters you can put up in the area. 5) Enable area alerts so you\'re notified if someone finds a pet matching your description nearby.'],
  ['What types of pets are supported?', 'Dogs, cats, birds, rabbits, reptiles, small animals (guinea pigs, hamsters, ferrets), and any other pet. When creating a report, simply select the pet type from the list — the AI matching adapts its analysis accordingly.'],
  ['Is my personal information kept private?', 'Yes. Your phone number is optional and hidden from public view by default — you choose whether to show it. All messages between users happen inside the app so neither party needs to share personal contact details. We do not sell your data to third parties. You can read our full Privacy Policy for details.'],
  ['I found my pet — how do I close my report?', 'Open your report, tap the "Mark as Reunited" button, and optionally share a short reunion message. Your report will move to the Happy Tails section, celebrating your reunion and giving hope to others. The report is no longer shown as active in the search.'],
  ['Can vets, shelters, and rescues use the app?', 'Absolutely — and it\'s free. Organisations can register as a partner, list animals currently in their care, and have those animals automatically included in AI matching results. When a lost pet\'s owner runs a match, your shelter\'s animals appear in the results if they\'re a match. Register through the app under Settings → Register as Partner.'],
]

export default function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.navWrap}>
        <nav className={styles.nav}>
          <div className={styles.navLogo}>
            <span className={styles.paw}>🐾</span>
            The Fur Finder
          </div>
          <div className={styles.navLinks}>
            <Link href="#features">Features</Link>
            <Link href="#how-it-works">How It Works</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#faq">FAQ</Link>
            <Link href="#our-story">Our Story</Link>
            <Link href="#download" className={styles.navCta}>
              Download Free
            </Link>
          </div>
        </nav>
      </div>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroPill}>🇦🇺 Australia&apos;s First AI-Powered Pet Recovery App</div>
          <h1>
            Helping bring <span className={styles.accent}>lost pets</span> home, faster.
          </h1>
          <p className={styles.sub}>
            Report a lost or found pet, let our AI scan photos for matches, and connect with your community — all in one app. Free to download and use.
          </p>
          <div className={styles.heroButtons}>
            <a href={appStoreUrl} className={styles.btnPrimary} target="_blank" rel="noreferrer">
              <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download on App Store
            </a>
            <a href={playStoreUrl} className={styles.btnSecondary} target="_blank" rel="noreferrer">
              <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              Get on Google Play
            </a>
          </div>
          <div className={styles.heroTrust}>
            <span className={styles.trustItem}>✓ Free to report pets</span>
            <span className={styles.trustDot} />
            <span className={styles.trustItem}>✓ No account needed to browse</span>
            <span className={styles.trustDot} />
            <span className={styles.trustItem}>✓ Australia-wide coverage</span>
          </div>
        </div>
      </section>

      <div className={styles.missionBand}>
        <p>
          <strong>Every minute counts.</strong> We built The Fur Finder because too many lost pets never make it home — not for lack of love, but for lack of the right tools. We&apos;re changing that.
        </p>
      </div>

      <section className={`${styles.section} ${styles.centered}`} id="features">
        <div className={styles.sectionLabel}>Features</div>
        <h2 className={styles.sectionTitle}>Everything you need to find a lost pet</h2>
        <p className={styles.sectionDesc}>
          Built for Australian pet owners, with tools designed to matter most in the critical first hours after a pet goes missing.
        </p>
        <div className={styles.featuresGrid}>
          {featureCards.map(([icon, iconClass, title, description]) => (
            <div key={title} className={styles.featureCard}>
              <div className={`${styles.featureIcon} ${iconClass}`}>{icon}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.whoBg}>
        <div className={`${styles.section} ${styles.centered}`}>
          <div className={`${styles.sectionLabel} ${styles.teal}`}>Who It&apos;s For</div>
          <h2 className={styles.sectionTitle}>Built for everyone who loves animals</h2>
          <p className={styles.sectionDesc}>
            Whether you&apos;ve lost a pet, found one, or just want to help your community — there&apos;s a place for you in The Fur Finder.
          </p>
          <div className={styles.whoGrid}>
            <div className={styles.whoCard}>
              <div className={styles.whoCardTop}>
                <span className={styles.whoEmoji}>😢</span>
                <h3>My Pet Is Lost</h3>
                <p>Your pet is missing and every minute feels like an eternity. Here&apos;s how we help you get them back.</p>
              </div>
              <div className={styles.whoCardList}>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> Post a report in under 2 minutes</div>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> AI instantly scans all found reports for matches</div>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> Share a printable flyer with one tap</div>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> Message anyone who spots your pet directly</div>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> Offer a reward to boost your report&apos;s visibility</div>
              </div>
            </div>
            <div className={styles.whoCard}>
              <div className={styles.whoCardTop}>
                <span className={styles.whoEmoji}>😊</span>
                <h3>I Found a Pet</h3>
                <p>You&apos;ve spotted a lost animal and want to reunite it with its family. You&apos;re in the right place.</p>
              </div>
              <div className={styles.whoCardList}>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> Post a found report with photos</div>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> AI matches it against all active lost reports nearby</div>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> Quick Snap to ID the pet using biometric scan</div>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> Find nearby vets and shelters to take the pet</div>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> Contact the owner safely through the app</div>
              </div>
            </div>
            <div className={styles.whoCard}>
              <div className={styles.whoCardTop}>
                <span className={styles.whoEmoji}>🌱</span>
                <h3>I Want to Help</h3>
                <p>You care about animals in your community and want to play an active part in reuniting them.</p>
              </div>
              <div className={styles.whoCardList}>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> Browse the live map for pets reported near you</div>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> Get area alerts for new reports in your suburb</div>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> Leave community tips on reports you&apos;ve seen</div>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> Share reports to your social networks</div>
                <div className={styles.whoItem}><span className={styles.whoCheck}>✓</span> Contribute to reward pools for lost pets</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.centered}`} id="how-it-works">
        <div className={styles.sectionLabel}>How It Works</div>
        <h2 className={styles.sectionTitle}>Three steps. That&apos;s all it takes.</h2>
        <p className={styles.sectionDesc}>Getting started takes less than two minutes, whether you&apos;ve lost a pet or found one wandering.</p>
        <div className={styles.steps}>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>1</div>
            <h3>Create a Report</h3>
            <p>Upload photos, describe your pet, drop a pin on the map where they were last seen or found, and hit submit. Done in under 2 minutes.</p>
            <span className={styles.stepArrow}>→</span>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>2</div>
            <h3>AI Scans for Matches</h3>
            <p>Our AI immediately compares your report against the entire database — analysing photos, breed, colour, markings, and location radius simultaneously.</p>
            <span className={styles.stepArrow}>→</span>
          </div>
          <div className={styles.stepCard}>
            <div className={styles.stepNum}>3</div>
            <h3>Get Connected &amp; Reunite</h3>
            <p>When a match is found, both parties are notified with a push alert. Message each other securely in the app and arrange a safe reunion.</p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.centered}`} style={{ paddingTop: 0 }}>
        <p style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '20px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.5px' }}>
          Works for all pet types
        </p>
        <div className={styles.petsRow}>
          <div className={styles.petPill}><span>🐶</span> Dogs</div>
          <div className={styles.petPill}><span>🐱</span> Cats</div>
          <div className={styles.petPill}><span>🐦</span> Birds</div>
          <div className={styles.petPill}><span>🐰</span> Rabbits</div>
          <div className={styles.petPill}><span>🐍</span> Reptiles</div>
          <div className={styles.petPill}><span>🐹</span> Small Animals</div>
          <div className={styles.petPill}><span>❤️</span> Any Other Pet</div>
        </div>
      </section>

      <section className={styles.section} style={{ paddingTop: 0 }}>
        <div className={styles.partnerSection}>
          <div className={styles.partnerIconWrap}>🏥</div>
          <div>
            <h3>For Vets, Shelters &amp; Rescue Organisations</h3>
            <p>
              Register your organisation as an official Fur Finder partner. Animals in your care are listed in our public directory and automatically included in AI matching results — connecting lost pet owners directly to your shelter without any extra effort on your part.
            </p>
            <div className={styles.partnerTags}>
              <span className={styles.partnerTag}>Free Registration</span>
              <span className={styles.partnerTag}>AI Match Integration</span>
              <span className={styles.partnerTag}>Organisation Dashboard</span>
              <span className={styles.partnerTag}>Public Directory Listing</span>
              <span className={styles.partnerTag}>Admin Approval</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.pricingBg} id="pricing">
        <div className={`${styles.section} ${styles.centered}`}>
          <div className={`${styles.sectionLabel} ${styles.purple}`}>Pricing</div>
          <h2 className={styles.sectionTitle}>Simple, honest pricing</h2>
          <p className={styles.sectionDesc}>
            The core app is completely free. Premium unlocks AI-powered features for those who want every possible advantage finding their pet.
          </p>
          <div className={styles.pricingGrid}>
            <div className={styles.planCard}>
              <div className={styles.planName}>Free</div>
              <div className={`${styles.planPrice} ${styles.freePrice}`}>Free</div>
              <div className={styles.planYearly}>Always free, no credit card needed</div>
              <div className={styles.planDivider} />
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> Post lost &amp; found reports</div>
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> Browse the interactive map</div>
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> Vet &amp; shelter directory</div>
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> Community tips on reports</div>
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> In-app messaging</div>
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> Printable flyer generator</div>
              <div className={styles.planFeature}><span className={styles.planCross}>–</span> AI photo matching</div>
              <div className={styles.planFeature}><span className={styles.planCross}>–</span> Scan online posts</div>
              <div className={styles.planFeature}><span className={styles.planCross}>–</span> Biometric ID scanning</div>
              <div className={styles.planFeature}><span className={styles.planCross}>–</span> Multi-photo upload (up to 5)</div>
              <a href={appStoreUrl} className={`${styles.planBtn} ${styles.planBtnFree}`} target="_blank" rel="noreferrer">Get Started Free</a>
            </div>
            <div className={`${styles.planCard} ${styles.featured}`}>
              <div className={styles.planBadge}>Most Popular</div>
              <div className={styles.planName}>Premium</div>
              <div className={styles.planPrice}><sup>$</sup>4.99<span>/month</span></div>
              <div className={styles.planYearly}>or <strong>$49.99/year</strong> — save 2 months</div>
              <div className={styles.planDivider} />
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> Everything in Free</div>
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> <strong>AI photo matching</strong></div>
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> <strong>Scan online posts with AI</strong></div>
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> <strong>Biometric ID scanning</strong></div>
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> Multi-photo upload (up to 5 photos)</div>
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> Unlimited reports &amp; pet profiles</div>
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> Area alerts for nearby pets</div>
              <div className={styles.planFeature}><span className={styles.planCheck}>✓</span> Boost report for extra visibility</div>
              <a href={appStoreUrl} className={`${styles.planBtn} ${styles.planBtnPremium}`} target="_blank" rel="noreferrer">Start Premium Trial</a>
            </div>
          </div>
          <p className={styles.pricingNote}>Subscriptions managed securely via the App Store &amp; Google Play. Cancel anytime.</p>
        </div>
      </section>

      <section className={styles.faqBg} id="faq">
        <div className={`${styles.section} ${styles.centered}`}>
          <div className={styles.sectionLabel}>FAQ</div>
          <h2 className={styles.sectionTitle}>Common questions</h2>
          <p className={styles.sectionDesc}>Everything you need to know before downloading.</p>
          <div className={styles.faqList}>
            {faqItems.map(([question, answer], index) => (
              <details key={question} open={index === 0}>
                <summary>
                  {question}
                  <span className={styles.faqIcon}>+</span>
                </summary>
                <div className={styles.faqAnswer}>{answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="our-story">
        <div className={styles.founder}>
          <div className={styles.founderBadge}>🐾 Founder&apos;s Story</div>
          <h2>Why I Built The Fur Finder</h2>
          <div className={styles.founderBody}>
            <p>Last year, my own dog Lucky went missing for two days, and I was devastated. I felt completely broken, unable to eat, and overwhelmed with fear and anxiety. I visited every vet, shelter, pound, and local park. I walked the streets, knocked on doors, and scoured Facebook lost and found pages, as well as community pages across different suburbs. But everything was scattered, and there wasn&apos;t one centralised place to get all the information I needed.</p>
            <p>Time was critical in locating Lucky. We live in an area with busy roads and reckless drivers, and I was terrified that he might be hurt. When I finally found him after two and a half days, he was traumatised, hungry, thirsty, and in pain. I was incredibly lucky to have found him, but not everyone is. There are elderly people and others who struggle to navigate multiple resources in the frantic moments after their pet goes missing.</p>
            <p>Every minute counts when a pet is lost. Too often, these animals end up in far-away pounds, shelters, or even in the hands of people who have no intention of returning them. Many owners are unable to find their pets because their microchip information or contact details haven&apos;t been updated. Too many lost pets live in shelters, never reunited with their loving owners, and both the pets and their families suffer.</p>
            <p>I see this situation every month when I come across lost animals, and I always try to help them reunite with their owners. Having gone through that heartbreak myself, I knew I had to do something to help in a more significant way. That&apos;s why I decided to create The Fur Finder — a platform that brings all the lost and found pet information into one place.</p>
            <p>The running costs of the app are covered by paid subscriptions, ensuring that it remains accessible to everyone, especially those who need it most. It was my own painful experience that motivated me to build this app, and I hope it helps reunite as many pets with their families as possible.</p>
          </div>
          <div className={styles.founderSig}>— Lucky &amp; Jaspreet, Founder of The Fur Finder 🐾</div>
        </div>
      </section>

      <section className={styles.ctaSection} id="download">
        <h2>Download The Fur Finder — Free</h2>
        <p>Every pet deserves the best chance of getting home. Join thousands of Australians already using The Fur Finder to report, search, and reunite.</p>
        <div className={styles.storeBadges}>
          <a href={appStoreUrl} className={styles.storeBadge} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            <div className={styles.storeMeta}>
              <span className={styles.storeSmall}>Download on the</span>
              <span className={styles.storeName}>App Store</span>
            </div>
          </a>
          <a href={playStoreUrl} className={styles.storeBadge} target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24"><path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/></svg>
            <div className={styles.storeMeta}>
              <span className={styles.storeSmall}>Get it on</span>
              <span className={styles.storeName}>Google Play</span>
            </div>
          </a>
        </div>
        <p className={styles.ctaTagline}>Free to download · iOS &amp; Android · No account needed to browse</p>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className="logo">🐾 The Fur Finder</div>
              <p>Australia&apos;s first AI-powered lost and found pets platform. Reuniting pets with their families, one report at a time.</p>
            </div>
            <div className={styles.footerCol}>
              <h4>App</h4>
              <a href={appStoreUrl} target="_blank" rel="noreferrer">App Store</a>
              <a href={playStoreUrl} target="_blank" rel="noreferrer">Google Play</a>
              <Link href="#features">Features</Link>
              <Link href="#pricing">Pricing</Link>
            </div>
            <div className={styles.footerCol}>
              <h4>Resources</h4>
              <Link href="#how-it-works">How It Works</Link>
              <Link href="#faq">FAQ</Link>
              <Link href="/app-features">Full Feature List</Link>
              <Link href="#our-story">Our Story</Link>
            </div>
            <div className={styles.footerCol}>
              <h4>Legal</h4>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-of-use">Terms of Use</Link>
              <Link href="/delete-account">Delete Account</Link>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p className={styles.footerCopy}>© 2026 The Fur Finder. Made with ❤️ in Australia.</p>
            <div className={styles.footerLegal}>
              <Link href="/privacy-policy">Privacy</Link>
              <Link href="/terms-of-use">Terms</Link>
              <Link href="/delete-account">Delete Account</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
