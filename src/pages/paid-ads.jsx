import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'What we do',
    p: [
      'Most brands don\'t have a Meta problem or a TikTok problem. They have a structure problem. Budget is spread across too many ad sets. Ads get judged before they have enough data. The account gets rebuilt every time one week goes badly.',
      'We rebuild the account so you can read it. We combine campaigns so the platform has enough data to learn from. We keep testing apart from scaling, so new ads never mess up what works. And we change one thing at a time, so you know what caused what.',
    ],
    list: [
      'Meta, TikTok and Google campaigns under one plan, not three separate accounts',
      'Account, pixel (code that tracks what visitors do) and conversion tracking checked before spend starts',
      'Campaign structure built for the spend you have now',
      'Creative tests with a win condition set before the test starts',
      'Scaling in steps small enough to keep the platform\'s learning',
      'Reports twice a week on cost per result, click-through rate and return on ad spend',
    ],
  },
  {
    h: 'How we judge a campaign',
    p: [
      'Reach, impressions and engagement tell you almost nothing about whether you\'re making money. Three numbers decide if a campaign lives: cost per result (what you pay for the outcome you want), click-through rate (the share of people who click), and return on ad spend (how much you make back for every $1 spent on ads).',
      'A campaign that fails all three gets cut. One that fails a single number gets diagnosed. Weak click-through is a creative problem. A high cost per result is usually a structure or offer problem. Mixing them up is how accounts get rebuilt in circles.',
    ],
  },
  {
    h: 'Who this is for',
    p: [
      'Brands that already have a product people want, and want paid ads to be steady instead of a monthly gamble.',
      'It works badly if you hope ads will fix a product nobody wants, or expect profit in week one. Platforms need sales data before they can optimize, and that takes time. We\'d rather say so now than find out in month two.',
    ],
  },
]

const faqs = [
  { q: 'Do I keep ownership of my ad account?', a: 'Yes, always. We ask for partner access to your Business Manager. You own the account, pixel, audiences and payment method. You can remove our access any time.' },
  { q: 'Which platform should we start on?', a: 'Usually the one where your customers already are, and usually one at a time. One steady channel beats three run badly.' },
  { q: 'How long before we see results?', a: 'The first few weeks are about gathering data and finding which angles hold attention, not hitting a target return.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="Paid Ads"
        title="Paid Ads On"
        emph="every platform."
        intro="Meta, TikTok and Google ads for brands that want paid traffic to be a steady system, not a monthly gamble. We build, manage and scale them."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
