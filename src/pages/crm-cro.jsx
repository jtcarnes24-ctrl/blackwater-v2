import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'More traffic into a leaking funnel is just a more expensive leak',
    p: [
      'The instinct when results dip is to buy more traffic. Often the traffic is fine and the loss is happening after it arrives: leads sitting unactioned, records duplicated, a form asking for information nobody wants to give yet.',
      'Fixing conversion improves every campaign at once. A page that converts twice as well halves your cost per acquisition without touching a single ad.',
    ],
    list: [
      'Pipeline stages that reflect how buying actually happens',
      'Lead routing and follow-up timing, since speed of response moves close rates more than almost anything else',
      'Deduplication and data hygiene so reporting can be trusted',
      'Form and checkout friction reduced to what is genuinely needed',
      'Conversion tracking wired to the CRM so marketing and sales see the same numbers',
    ],
  },
  {
    h: 'Marketing and sales looking at different numbers',
    p: [
      'A common and expensive problem: the ad platform reports one figure, the CRM reports another, and nobody can say which is real. Decisions then get made on whichever number supports the argument.',
      'Connecting the two is unglamorous work that pays for itself, because it ends the argument. Once both sides are looking at the same pipeline, the conversation moves from whose number is right to what to do next.',
    ],
  },
  {
    h: 'Test properly or not at all',
    p: [
      'Conversion work invites guessing. We change one thing at a time where traffic allows, and we say up front roughly how long a test needs to run before the result means anything.',
      'Where volume is too low for a meaningful test, we will say so rather than declare a winner from noise.',
    ],
  },
]

const faqs = [
  { q: 'Which CRM do you work with?', a: 'Whichever you have. The principles do not change much between platforms, and migrating is rarely the actual fix.' },
  { q: 'Is this the same as landing page work?', a: 'Related but wider. Landing pages are the front door; this covers what happens to a lead or an order after it comes through.' },
  { q: 'How do you know a change worked?', a: 'By measuring before and after with enough volume for the difference to be real. If we cannot measure it honestly, we will tell you it is a judgement call rather than a proven gain.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="CRM & Conversion Optimization"
        title="Fix The Leaks"
        emph="before you scale."
        intro="Pipeline hygiene, lead routing and conversion rate. Pouring more traffic into a funnel that leaks just makes the leak more expensive."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
