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
      'Most brands do not have a Meta problem or a TikTok problem. They have a structure problem that shows up inside the platform. Budget is spread across too many ad sets, creative is judged before it has the data to be judged, and the account gets rebuilt every time a week goes badly.',
      'We take the account apart and rebuild it around a structure that can be read. Campaigns are consolidated so the algorithm gets enough events to learn from, testing is separated from scaling so a new ad never destabilises what already works, and changes are made one at a time so you can tell what caused what.',
    ],
    list: [
      'Meta, TikTok and Google campaigns under one strategy rather than three disconnected accounts',
      'Account, pixel and conversion tracking verified before spend starts',
      'Campaign architecture built for the spend level you are actually at',
      'Structured creative testing with a win condition defined before the test runs',
      'Scaling in increments that do not reset learning',
      'Reporting twice a week on cost per result, click-through rate and return on ad spend',
    ],
  },
  {
    h: 'How we judge a campaign',
    p: [
      'Reach, impressions and engagement rate tell you almost nothing about whether an account is making money. Three numbers decide whether a campaign lives: cost per result, click-through rate, and return on ad spend.',
      'Failing all three means it gets cut. Failing one means it gets diagnosed, because weak click-through is a creative problem while a high cost per result is usually a structure or an offer problem. Treating them as the same thing is how accounts get rebuilt in circles.',
    ],
  },
  {
    h: 'Who this is for',
    p: [
      'Brands that already have product-market fit and want paid to become a predictable channel rather than a monthly gamble.',
      'It works badly for anyone hoping ads will fix a product nobody wants, or expecting profit in week one. Platforms need conversion volume before they optimise, and buying that data takes time. We would rather say so up front than discover it together in month two.',
    ],
  },
]

const faqs = [
  { q: 'Do I keep ownership of my ad account?', a: 'Yes, always. We request partner access to your Business Manager, so you own the account, the pixel, the audiences and the payment method, and you can remove our access at any time without asking us.' },
  { q: 'Which platform should we start on?', a: 'Usually the one where your customers already are, and usually one at a time. Getting a single channel stable beats running three badly.' },
  { q: 'How long before we see results?', a: 'Expect the first few weeks to be about gathering data and finding which angles hold attention, not about hitting a target return.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="Paid Ads"
        title="Paid Ads That Scale"
        emph="profitably."
        intro="Meta, TikTok and Google campaigns built, managed and scaled for brands that want paid traffic to be a system rather than a monthly gamble."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
