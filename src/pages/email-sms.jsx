import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { PAGE_HEROES } from '../lib/pageHeroes'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'You already paid for these people',
    p: [
      'New customers get the attention because that\'s where the spend is. But your email and text list is the one audience you don\'t pay a platform to reach again. In most accounts, it\'s badly underused.',
      'The work has two halves. Flows are automatic messages triggered by what someone does, and they quietly earn revenue every day. Campaigns are one-off sends you choose to make. Most brands do some campaigns and almost no flows.',
    ],
    list: [
      'A welcome sequence for people who joined but haven\'t bought',
      'Abandoned cart and abandoned checkout, kept separate because they are different problems',
      'Browse abandonment, for shoppers who looked but never added to cart',
      'Post-purchase emails, review requests and reorder timing',
      'Win-back messages for past customers before they\'re gone for good',
      'A campaign calendar that doesn\'t need a discount every time',
    ],
  },
  {
    h: 'SMS works differently',
    p: [
      'Email can handle volume. SMS can\'t. It lands on a device people treat as personal, so the bar for sending is much higher. Send too much and people leave for good.',
      'We use SMS for moments worth interrupting someone: an order update, a restock they asked about, or a real deadline. Not a fourth reminder about a sale.',
    ],
  },
  {
    h: 'Getting into the inbox',
    p: [
      'A perfect flow that lands in spam earns nothing. Email authentication, a clean list and a good sending reputation decide whether your copy gets read at all.',
      'We also keep consent clean. Buying or scraping lists damages the sending domain you depend on. We won\'t do it.',
    ],
  },
]

const faqs = [
  { q: 'Which platform do you work in?', a: 'In most cases, the one you already use. Switching costs real time and money, and it\'s rarely the actual problem.' },
  { q: 'How often should we send?', a: 'Often enough to stay in front of people, but not so often that unsubscribes beat signups. The right number depends on your category and list. We watch it instead of guessing.' },
  { q: 'Do flows really matter that much?', a: 'Flows run whether or not anyone remembers to send something that week. That\'s why they\'re worth building well, once.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        hero={PAGE_HEROES['email-sms']}
        eyebrow="Email & SMS Marketing"
        title="Email & SMS That"
        emph="brings them back."
        intro="Email and SMS flows and campaigns that bring in revenue from people who already know you. Your cheapest customer is one who has already bought once."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
