import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { PAGE_HEROES } from '../lib/pageHeroes'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'B2B is not a numbers game',
    p: [
      'Consumer marketing runs on reach and impulse. B2B is the opposite. You target a few companies, several people decide together, and the sale takes months.',
      'Chasing cheap leads fills your pipeline (your list of possible deals) with people who will never buy. What matters is whether real sales conversations happen.',
    ],
    list: [
      'Targeting the people who really buy, by job role, company, and intent',
      'Offers built for people who take time to decide',
      'Lead qualification, so sales time goes to real opportunities',
      'Measuring over a full sales cycle',
    ],
  },
  {
    h: 'Cost per lead can fool you',
    p: [
      'Cost per lead (what you pay for each new contact) is the easiest number to improve and the easiest to be fooled by.',
      'We report on qualified conversations and closed revenue instead. They are smaller and slower. If cheap leads never convert, we will say so.',
    ],
  },
  {
    h: 'Our rules on outreach',
    p: [
      'If the plan includes outbound (reaching out to people first), it has to follow the rules. That means consent, do-not-contact lists, and the laws for calling and messaging in your market. Ignoring them is a legal risk for you, and we will not cut that corner.',
    ],
  },
]

const faqs = [
  { q: 'Does paid social work for B2B?', a: 'It can. It works well for building demand and retargeting (ads shown to people who already visited). It is usually weak at closing a big contract alone.' },
  { q: 'How long before we can judge it?', a: 'At least one full sales cycle. After three weeks, you can judge form fills, not revenue.' },
  { q: 'Do you do the sales calls?', a: 'No. We bring in and qualify the opportunity. Your team closes it, since they know the product best.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        hero={PAGE_HEROES['b2b-marketing']}
        eyebrow="B2B Marketing"
        title="B2B Marketing"
        emph="for real buyers."
        intro="B2B marketing (selling to other businesses) means longer sales cycles, smaller lists, and bigger deals. It needs precision and patience, not volume."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
