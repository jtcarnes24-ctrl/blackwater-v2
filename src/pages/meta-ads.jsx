import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { PAGE_HEROES } from '../lib/pageHeroes'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'What we do',
    p: [
      'Most brands don\'t have a Meta problem. They have a structure problem. Budget is spread across too many ad sets. Ads get judged before they have enough data. The account gets rebuilt every time one week goes badly.',
      'We rebuild the account so you can read it. We combine campaigns so Meta has enough data to learn from. We keep testing apart from scaling, so new ads never mess up what works. And we change one thing at a time, so you know what caused what.',
    ],
    list: [
      'Account, pixel (code that tracks what visitors do) and conversions API (a backup that sends sales data straight to Meta) setup, with duplicate events cleaned up',
      'Campaign structure built for the spend you have now',
      'Creative tests with a clear rule for what counts as a win, set before the test starts',
      'Scaling only what has earned it, in steps small enough to keep Meta\'s learning',
      'Weekly reports on cost per result, click-through rate and return on ad spend',
    ],
  },
  {
    h: 'How we judge a campaign',
    p: [
      'Reach, impressions and engagement tell you almost nothing about whether you\'re making money. Three numbers decide if a campaign lives.',
      'Cost per result is what you pay for the outcome you want. Click-through rate is the share of people who click, so it shows if the ad earns attention. Return on ad spend is how much you make back for every $1 you spend on ads.',
      'A campaign that fails all three gets cut. One that fails a single number gets diagnosed. Weak click-through is a creative problem. A high cost per result is usually a structure or offer problem. Mixing them up is how accounts get rebuilt in circles.',
    ],
  },
  {
    h: 'Who this is for',
    p: [
      'This works best for e-commerce and direct-to-consumer brands that already have a product people want. They want paid social to be steady, not a monthly gamble.',
      'It works badly if you hope ads will fix a product nobody wants. It also fails if you expect profit in week one. Meta needs sales data before it can optimize, and that takes time. We\'d rather tell you now than find out in month two.',
    ],
  },
]

const faqs = [
  { q: 'Do I keep ownership of my ad account?', a: 'Yes, always. We ask for partner access to your Business Manager. You own the account, pixel, audiences and payment method. You can remove our access any time.' },
  { q: 'How long before we see results?', a: 'Meta needs sales data before it optimizes well. The first few weeks are about gathering data and finding which angles hold attention, not hitting a target return.' },
  { q: 'Do you write the ad creative too?', a: 'Yes. The ad itself is the biggest thing you control in a Meta account, so it\'s part of the work. That includes hooks, concepts and angles.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        hero={PAGE_HEROES['meta-ads']}
        eyebrow="Meta Ads Management"
        title="Meta Ads For"
        emph="online brands."
        intro="Facebook and Instagram ads for e-commerce and direct-to-consumer brands. We set them up, run them and scale them once the numbers say it's time."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
