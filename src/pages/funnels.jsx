import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'What happens after the click',
    p: [
      'Brands spend months tuning ads and almost no time on what happens after the click. That\'s backwards. The ad buys attention. Everything after it decides if that attention turns into money.',
      'A funnel isn\'t a landing page (the page people reach after clicking your ad) with an upsell added. It\'s the whole path: what the ad promised, what the page delivers, what checkout asks for, and what happens in the days after.',
    ],
    list: [
      'Mapping the path today and finding where people drop off',
      'Matching the ad, page and offer so nobody has to start over',
      'Less friction in checkout and forms, without redesigning just to redesign',
      'Follow-up for people who didn\'t buy the first time',
      'A post-purchase sequence, because the second order costs less than the first',
    ],
  },
  {
    h: 'Where the money leaks',
    p: [
      'In most accounts we audit, the biggest loss isn\'t in the ad account. It\'s a gap between what the ad said and what the page shows. Or a checkout that asks for more than it needs.',
      'These fixes aren\'t exciting. But they move the numbers fastest, because they help every campaign at once.',
    ],
  },
  {
    h: 'How we work',
    p: [
      'We measure before we change anything, so we know what caused each improvement. Where traffic allows, we change one thing at a time.',
      'If your funnel is solid and the real problem is the creative or the offer, we\'ll tell you. We won\'t rebuild something that works.',
    ],
  },
]

const faqs = [
  { q: 'Is this different from landing page work?', a: 'It overlaps. A landing page is one step. The funnel is every step from ad to repeat purchase. We often start with the page because it\'s the fastest win, then widen out.' },
  { q: 'Do I need new software?', a: 'Rarely. Most brands already own the tools and use only a small part of them.' },
  { q: 'How long does it take?', a: 'Mapping and the obvious fixes are quick. Proving a change worked takes as long as your traffic needs to give a real result instead of noise.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="Funnel Creation & Optimization"
        title="Funnels That Turn"
        emph="clicks into customers."
        intro="Funnels are the steps between the ad and the purchase. We design them on purpose so you stop losing sales after the click."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
