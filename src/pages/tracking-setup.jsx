import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'You cannot optimise what you cannot measure',
    p: [
      'Every decision a platform makes about your budget is based on the conversion data you send it. If that data is wrong, incomplete or arriving twice, the algorithm optimises toward the wrong thing and no amount of creative fixes it.',
      'This is the least glamorous part of running paid social and the part most likely to be quietly broken. We check it before we spend anything.',
    ],
    list: [
      'Business Manager and ad account structure, with partner access rather than logins',
      'Pixel installed and firing on the events that actually matter',
      'Conversions API set up server-side so results survive browser tracking limits',
      'Event deduplication, so one purchase is not counted as two',
      'Domain verification and aggregated event configuration',
      'A documented map of which event means what, so reporting is readable later',
    ],
  },
  {
    h: 'What broken tracking looks like',
    p: [
      'Reported revenue that does not match your store. Conversions credited to the wrong campaign. A cost per purchase that looks excellent while the bank account disagrees.',
      'These are not reporting quirks. The platform is buying more of whatever it thinks is working, so bad data does not just mislead you, it actively spends your money in the wrong direction.',
      'Most accounts we take over have at least one of these problems. Finding it is usually worth more in the first month than any creative change.',
    ],
  },
  {
    h: 'You keep ownership of everything',
    p: [
      'We request partner access to your Business Manager. You own the ad account, the pixel, the audiences and the payment method, and you can remove our access at any time without asking us.',
      'We never ask for your login credentials, and we do not build assets inside our own account that you would have to leave behind.',
    ],
  },
]

const faqs = [
  { q: 'What if my pixel is already set up?', a: 'We audit it rather than replace it. If the events are firing correctly and deduplication is clean, we leave it alone and say so.' },
  { q: 'Do I need a developer?', a: 'Usually not. Most platforms support server-side setup natively or through an app. Where a developer is genuinely required, we specify exactly what needs doing.' },
  { q: 'Does this work with Shopify?', a: 'Yes, and with most major platforms. Shopify in particular has a well-supported path for both the pixel and the Conversions API.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="Tracking & Account Setup"
        title="Clean Data In."
        emph="decisions out."
        intro="Ad account, pixel and Conversions API setup, with events verified before a pound of spend goes live. The least glamorous part of paid social, and the part most often quietly broken."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
