import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'The gap between the click and the purchase',
    p: [
      'Brands spend months optimising ads and almost no time on what happens after the click. That is backwards. The ad buys attention; everything after it decides whether that attention turns into money.',
      'A funnel is not a landing page with an upsell bolted on. It is the whole sequence: what the ad promised, what the page delivers, what the checkout asks for, and what happens in the days after someone does or does not buy.',
    ],
    list: [
      'Mapping the current path and finding where people actually drop',
      'Message match between ad, page and offer so nobody has to start again',
      'Checkout and form friction removed rather than redesigned for its own sake',
      'Follow-up for the people who did not convert the first time',
      'Post-purchase sequence, because the second order is cheaper than the first',
    ],
  },
  {
    h: 'Where the money usually leaks',
    p: [
      'In most accounts we audit, the biggest single loss is not in the ad account at all. It is a mismatch between what the ad said and what the page shows, or a checkout that asks for more than it needs.',
      'These are unglamorous fixes. They are also the ones that change the numbers fastest, because they improve every campaign at once rather than one ad at a time.',
    ],
  },
  {
    h: 'How we approach it',
    p: [
      'We measure before we change anything, so improvements can be attributed rather than assumed. Changes go in one at a time where traffic allows.',
      'If the funnel is already sound and the problem is upstream in the creative or the offer, we will tell you that instead of rebuilding something that works.',
    ],
  },
]

const faqs = [
  { q: 'Is this different from landing page work?', a: 'It overlaps. A landing page is one step; the funnel is every step from ad to repeat purchase. We often start with the page because it is the fastest win, then widen out.' },
  { q: 'Do I need new software for this?', a: 'Rarely. Most brands already have the tools and are using a fraction of them.' },
  { q: 'How long does it take?', a: 'The mapping and the obvious fixes are quick. Proving a change worked takes as long as your traffic needs to produce a real result rather than noise.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="Funnel Creation & Optimization"
        title="A Path From Click"
        emph="to customer."
        intro="The steps between the ad and the purchase, designed deliberately rather than assembled by accident. Most brands lose more money here than in the ad account."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
