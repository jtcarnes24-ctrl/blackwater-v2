import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'You cannot improve what you cannot measure',
    p: [
      'Every budget choice a platform makes comes from the conversion data you send it. If that data is wrong, missing, or counted twice, the platform aims at the wrong thing.',
      'It is the least exciting part of paid social and the most likely to be quietly broken. We check it before we spend anything.',
    ],
    list: [
      'Business Manager and ad account setup, using partner access instead of logins',
      'Pixel installed and firing on the events that matter',
      'Conversions API set up on the server, so results survive browser tracking limits',
      'Event deduplication, so one purchase is not counted twice',
      'Domain verification and aggregated event setup',
    ],
  },
  {
    h: 'What broken tracking looks like',
    p: [
      'Reported revenue does not match your store. Sales go to the wrong campaign. Cost per purchase looks great while your bank account says otherwise.',
      'The platform buys more of whatever it thinks is working. So bad data does more than mislead you. It spends your money the wrong way. Most accounts we take over have at least one of these problems. Fixing it is usually worth more than any creative change.',
    ],
  },
  {
    h: 'You keep ownership of everything',
    p: [
      'We ask for partner access to your Business Manager. You own the ad account, pixel, audiences, and payment method, and you can remove our access any time. We never ask for your logins, and we do not build assets in our own account that you would have to leave behind.',
    ],
  },
]

const faqs = [
  { q: 'What if my pixel is already set up?', a: 'We audit it instead of replacing it. If events fire correctly and deduplication is clean, we leave it alone and tell you.' },
  { q: 'Do I need a developer?', a: 'Usually not. Most platforms support server-side setup built in or through an app. If a developer is needed, we tell you exactly what to do.' },
  { q: 'Does this work with Shopify?', a: 'Yes, and with most major platforms.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="Tracking & Account Setup"
        title="Tracking Setup"
        emph="you can trust."
        intro="We set up your ad account, pixel (a bit of code that tracks visitor actions), and Conversions API (a way to send results straight from your server). We check every event before ad spend goes live."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
