import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'What we actually do',
    p: [
      'Most brands do not have a Meta problem. They have a structure problem that shows up inside Meta. Budget is spread across too many ad sets, creative is judged before it has enough data to be judged, and the account gets rebuilt every time a week goes badly.',
      'We take the account apart and rebuild it around a structure that can be read. Campaigns are consolidated so the algorithm gets enough events to learn from, testing is separated from scaling so a new creative never destabilises what is already working, and every change is made one at a time so you can tell what caused what.',
    ],
    list: [
      'Account, pixel and conversions API setup, including event configuration and deduplication',
      'Campaign architecture built for the spend level you are actually at, not the one you want to be at',
      'Structured creative testing with a defined win condition before the test runs',
      'Scaling only on the campaigns that have earned it, at increments that do not reset learning',
      'Weekly reporting on cost per result, click-through rate and return on ad spend',
    ],
  },
  {
    h: 'How we judge a campaign',
    p: [
      'We do not optimise for the metrics that look good in a screenshot. Reach, impressions and engagement rate tell you almost nothing about whether the account is making money.',
      'The three numbers that decide whether a campaign lives are cost per result, click-through rate and return on ad spend. Cost per result tells you what you are paying for the outcome you actually want. Click-through rate tells you whether the creative is earning attention. Return on ad spend tells you whether the whole thing is worth continuing.',
      'A campaign that is failing on all three gets killed. A campaign failing on one gets diagnosed, because the fix for weak click-through is a creative problem and the fix for a high cost per result is usually a structure or an offer problem. Treating them as the same thing is how accounts get rebuilt in circles.',
    ],
  },
  {
    h: 'Who this is for',
    p: [
      'This works best for e-commerce and direct-to-consumer brands that already have product-market fit and want paid social to become a predictable channel rather than a monthly gamble.',
      'It works badly for brands hoping ads will fix a product nobody wants, or expecting a profitable account in week one. Meta needs conversion volume before it can optimise, and buying that data takes time. We would rather say that up front than discover it together in month two.',
    ],
  },
]

const faqs = [
  { q: 'Do I keep ownership of my ad account?', a: 'Yes, always. We request partner access to your Business Manager, which means you own the account, the pixel, the audiences and the payment method. You can remove our access at any time without asking us.' },
  { q: 'How long before we see results?', a: 'Meta needs conversion volume before it optimises properly. Expect the first few weeks to be about gathering data and finding which creative angles hold attention, not about hitting a target return.' },
  { q: 'Do you write the ad creative too?', a: 'Yes. Creative is the largest lever in a modern Meta account, so it is not treated as a separate service. Hooks, concepts and angles are part of the work.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="Meta Ads Management"
        title="Meta Ads That Scale"
        emph="profitably."
        intro="Facebook and Instagram campaigns built, managed and scaled for e-commerce and DTC brands. Structure first, creative second, scaling only once the numbers earn it."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
