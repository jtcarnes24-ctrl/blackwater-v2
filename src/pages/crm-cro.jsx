import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { PAGE_HEROES } from '../lib/pageHeroes'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'More traffic into a leaky funnel costs more',
    p: [
      'When results dip, the instinct is to buy more traffic. Often the loss comes after people arrive. Leads sit untouched, records get duplicated, and forms ask for too much too soon.',
      'Fixing conversion helps every campaign at once. A page that converts twice as well cuts your cost per acquisition (what you pay to win a customer) in half, with no ad changes.',
    ],
    list: [
      'Pipeline stages (the steps a lead moves through) that match how people buy',
      'Lead routing (who gets each lead) and fast follow-up, since speed moves close rates',
      'Clean data with no duplicates, so reports can be trusted',
      'Forms and checkout cut down to what is needed',
      'Conversion tracking tied to the CRM, so marketing and sales see the same numbers',
    ],
  },
  {
    h: 'Marketing and sales see different numbers',
    p: [
      'The ad platform shows one figure and the CRM shows another. Nobody knows which is real, so decisions follow whichever number backs the argument.',
      'Connecting the two is unglamorous work, but it ends the argument. Then you can talk about what to do next.',
    ],
  },
  {
    h: 'Test properly or not at all',
    p: [
      'We change one thing at a time when traffic allows. We say up front how long a test needs to run before the result means anything. If traffic is too low, we will say so instead of calling a winner from noise.',
    ],
  },
]

const faqs = [
  { q: 'Which CRM do you work with?', a: 'Whichever you have. The basics are much the same across platforms, and switching is rarely the real fix.' },
  { q: 'Is this the same as landing page work?', a: 'Related, but wider. Landing pages are the front door. This covers what happens to a lead or order after it comes in.' },
  { q: 'How do you know a change worked?', a: 'We measure before and after with enough volume to be sure. If we cannot, we will call it a judgment call, not a proven gain.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        hero={PAGE_HEROES['crm-cro']}
        eyebrow="CRM & Conversion Optimization"
        title="Fix Your CRM"
        emph="before you scale."
        intro="We fix your CRM (the tool that tracks leads and customers) and your conversion rate (the share of people who buy). More traffic into a leaky funnel just makes the leak cost more."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
