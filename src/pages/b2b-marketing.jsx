import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'B2B does not reward volume tactics',
    p: [
      'Consumer marketing works on reach and impulse. B2B works on almost the opposite: a small number of accounts, several people involved in the decision, and a cycle measured in months rather than minutes.',
      'That changes what a good campaign looks like. Optimising for cheap leads produces a pipeline full of people who will never buy. The metric that matters is whether qualified conversations happen, not how many forms were filled in.',
    ],
    list: [
      'Defining who actually buys, and who merely fills in forms',
      'Targeting by role, company and intent rather than broad interest',
      'Offers built for consideration, not impulse',
      'Lead qualification so sales time goes to real opportunities',
      'Measurement across a cycle long enough to be honest',
    ],
  },
  {
    h: 'Cost per lead is a misleading number',
    p: [
      'It is the easiest number to improve and the easiest to be fooled by. Halving cost per lead while halving lead quality leaves you worse off and busier.',
      'We would rather report on qualified conversations and closed revenue, even when those numbers are smaller and slower. If a campaign produces cheap leads that never convert, we will say so rather than put it in a report as a win.',
    ],
  },
  {
    h: 'On outreach',
    p: [
      'Where outbound is part of the plan, it has to respect the rules that govern it: consent, suppression lists, and the regulations that apply to calling and messaging in your market.',
      'Ignoring those is a legal exposure for you, not for us, and it is not a corner we will cut.',
    ],
  },
]

const faqs = [
  { q: 'Does paid social work for B2B?', a: 'It can, particularly for demand generation and retargeting. It is usually poor as a direct-response channel for a high-value contract, and expecting it to close deals on its own leads to disappointment.' },
  { q: 'How long before we can judge it?', a: 'At least one full sales cycle. Judging a B2B campaign after three weeks tells you about form fills, not about revenue.' },
  { q: 'Do you do the sales calls?', a: 'No. We generate and qualify the opportunity; closing stays with your team, who know the product far better than we do.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="B2B Marketing"
        title="Reach The Accounts"
        emph="that actually buy."
        intro="Longer cycles, smaller lists, bigger contracts. B2B rewards precision and patience rather than the volume tactics that work for consumer brands."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
