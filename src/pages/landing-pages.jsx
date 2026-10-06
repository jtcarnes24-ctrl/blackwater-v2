import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'The cheapest performance gain is usually the page',
    p: [
      'Most brands try to fix a weak return by changing the ads. Sometimes that is right. Often the ads are doing their job, the click is being paid for, and the page is where the money leaks out.',
      'Doubling the conversion rate of a page halves your cost per acquisition without touching the campaign. That is a much cheaper win than finding a creative that performs twice as well.',
    ],
    list: [
      'Above-the-fold clarity: what it is, who it is for, what it costs',
      'One primary action per screen instead of five competing buttons',
      'Social proof positioned where the doubt actually occurs',
      'Objections answered on the page rather than in a FAQ nobody opens',
      'Mobile-first layout, because that is where the traffic lands',
      'Page speed, since a slow page loses people before it can convince them',
    ],
  },
  {
    h: 'Message match is most of it',
    p: [
      'The single most common problem is a mismatch between the ad and the page. Someone clicks an ad about a specific product for a specific reason and lands on a generic homepage that makes them start again.',
      'Every campaign should land somewhere that continues the sentence the ad started. That alone often moves conversion rate more than a redesign.',
    ],
  },
  {
    h: 'How we work on it',
    p: [
      'We start by reading the page as a stranger would, then check it against how the traffic actually behaves. Changes are made one at a time where possible, so improvements can be attributed rather than guessed at.',
      'We will tell you when a page is fine and the problem is elsewhere. Rebuilding a page that already converts is a way to spend money and lose ground.',
    ],
  },
]

const faqs = [
  { q: 'Do you build the page or just advise?', a: 'Both are possible. We can hand you a prioritised list of changes, or design and build the page ourselves.' },
  { q: 'Will this work on Shopify?', a: 'Yes. Most of the work is layout, messaging and flow, which applies regardless of platform.' },
  { q: 'How long before we know if it worked?', a: 'It depends on traffic volume. A page needs enough visitors for a difference to be real rather than noise, and we will say up front roughly how long that will take at your spend.' },
]

/* Sites BlackWater designed and built. RPR and XL Athlete point at the
   workers.dev builds on purpose: their own domains still serve the old sites
   those rebuilds replace, so linking the domain would show someone else's
   work. Swap each href to the custom domain once the rebuild is live on it. */
const work = {
  heading: 'Recent work',
  intro: 'A few of the sites we have designed and built. Each one opens in a new tab.',
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
        title="Stop Leaking The"
        emph="traffic you buy."
        intro="Conversion-focused layouts, sharper messaging and cleaner flow. Halving the cost per acquisition is often a page problem, not a campaign problem."
        sections={sections}
        work={work}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
