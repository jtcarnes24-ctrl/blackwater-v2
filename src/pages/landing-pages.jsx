import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'The page is often the cheapest fix',
    p: [
      'Most brands try to fix weak returns by changing the ads. Often the ads work fine. You pay for the click, and the page is where the money leaks out.',
      'Doubling a page\'s conversion rate (the share of visitors who buy) cuts your cost per acquisition in half, with no campaign changes.',
    ],
    list: [
      'Clarity at the top: what it is, who it is for, what it costs',
      'One main action per screen, not five competing buttons',
      'Proof and answers to objections placed where doubt shows up',
      'Mobile-first layout, because that is where traffic lands',
      'Fast load times, since a slow page loses people early',
    ],
  },
  {
    h: 'The page must match the ad',
    p: [
      'The most common problem is an ad and page that do not match. Someone clicks an ad about one product, then lands on a generic homepage and has to start over.',
      'Each campaign should land on a page that continues what the ad started. That alone often beats a redesign.',
    ],
  },
  {
    h: 'How we work on it',
    p: [
      'We read the page like a stranger would, then check it against how your traffic behaves. We change one thing at a time when possible, so we know what worked.',
      'We will tell you when a page is fine and the problem is elsewhere.',
    ],
  },
]

const faqs = [
  { q: 'Do you build the page or just advise?', a: 'Either. We can give you a ranked list of changes, or design and build the page ourselves.' },
  { q: 'Will this work on Shopify?', a: 'Yes. Most of the work is layout, messaging, and flow, which applies on any platform.' },
  { q: 'How long before we know if it worked?', a: 'It depends on traffic. A page needs enough visitors for the difference to be real, not noise. We will tell you up front how long that takes at your spend.' },
]

/* Sites BlackWater designed and built. RPR and XL Athlete point at the
   workers.dev builds on purpose: their own domains still serve the old sites
   those rebuilds replace, so linking the domain would show someone else's
   work. Swap each href to the custom domain once the rebuild is live on it. */
const work = {
  heading: 'Recent work',
  intro: 'A few sites we designed and built. Each one opens in a new tab.',
  items: [
    {
      name: 'DABV Water Systems',
      kind: 'Industrial water technology',
      img: '/work/dabv.webp',
      alt: 'DABV homepage: the dabv wordmark over an aerial photograph of a farm at dawn.',
      href: 'https://dabv-us.blkwtrenterprises.workers.dev/',
    },
    {
      name: 'Reflexive Performance Reset',
      kind: 'Training system and app',
      img: '/work/rpr.webp',
      alt: 'RPR homepage: Reset Your Body In Minutes in heavy type on black, with app store buttons.',
      href: 'https://rpr-site.blkwtrenterprises.workers.dev/',
    },
    {
      name: 'XL Athlete',
      kind: 'Strength and conditioning library',
      img: '/work/xl-athlete.webp',
      alt: 'XL Athlete homepage: a runner on a red track behind the words Train Faster, Get Stronger, Stay Healthy.',
      href: 'https://xl-athlete.blkwtrenterprises.workers.dev/',
    },
    {
      name: 'Track Football Consortium',
      kind: 'Coaching conference',
      img: '/work/tfc.webp',
      alt: 'Track Football Consortium homepage: Track Football Consortium in serif type over an aerial split of a football field and a running track.',
      href: 'https://track-football-consortium.blkwtrenterprises.workers.dev/',
    },
    {
      name: 'The Brand Command System',
      kind: 'Course and community',
      img: '/work/brand-command.webp',
      alt: 'The Brand Command System homepage: Recon. Deploy. Payload. over a dark aerial landscape.',
      href: 'https://thebrandcommandsystem.com/',
    },
  ],
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="Landing Pages & CRO"
        title="Landing Pages"
        emph="that convert."
        intro="We build landing pages (the page people see after clicking your ad) with clearer messaging and a simpler flow. A high cost per acquisition (what you pay to win a customer) is often a page problem, not an ad problem."
        sections={sections}
        work={work}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
