import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'You already paid for these people',
    p: [
      'Acquisition gets the attention because it is where the spend is. But the list you have built is the one audience you do not pay a platform to reach again, and in most accounts it is badly underused.',
      'The work splits into two halves. Flows run automatically off behaviour and quietly earn revenue every day. Campaigns are the sends you decide on. Most brands do a bit of the second and almost none of the first.',
    ],
    list: [
      'Welcome sequence for people who joined but have not bought',
      'Abandoned cart and abandoned checkout, separated because they are different problems',
      'Browse abandonment for intent that never reached the cart',
      'Post-purchase, review requests and replenishment timing',
      'Win-back for lapsed customers before they are gone for good',
      'Campaign calendar that does not rely on discounting every time',
    ],
  },
  {
    h: 'SMS is a different instrument',
    p: [
      'Email tolerates volume. SMS does not. It arrives on a device people treat as personal, so the bar for sending is much higher and the penalty for over-sending is that they leave permanently.',
      'We use it for the moments that genuinely warrant interrupting someone: an order update, a restock they asked about, a deadline that is real. Not a fourth reminder about a sale.',
    ],
  },
  {
    h: 'Deliverability is part of the job',
    p: [
      'A perfect flow that lands in spam earns nothing. Authentication, list hygiene and sending reputation are not separate concerns from the copy; they decide whether the copy is ever read.',
      'We also keep consent clean. Buying or scraping lists damages the sending domain you depend on, and it is not something we will do.',
    ],
  },
]

const faqs = [
  { q: 'Which platform do you work in?', a: 'Whichever you already use, in most cases. Switching platforms is a real cost and rarely the actual problem.' },
  { q: 'How often should we send?', a: 'Enough to stay present, not so much that unsubscribes outpace signups. The right number depends on your category and your list, and it is something we watch rather than assume.' },
  { q: 'Do flows really matter that much?', a: 'They are the part that runs whether or not anyone remembers to send something that week, which is exactly why they are worth building properly once.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="Email & SMS Marketing"
        title="Own The Audience"
        emph="you already paid for."
        intro="Flows and campaigns that earn revenue from people who already know you. The cheapest customer you will ever get is the one you have bought once already."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
