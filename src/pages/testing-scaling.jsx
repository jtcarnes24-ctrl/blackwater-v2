import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'A test without a win condition is just spending',
    p: [
      'Most accounts run what they call tests but have no agreed definition of a winner. Ads are judged after a day, killed on a hunch, or left running because nobody wants to be the one to switch them off.',
      'We decide before a test runs what result would make an ad a winner, and how much data it needs before that judgement means anything. Then we hold to it.',
    ],
    list: [
      'One variable changed at a time so the result is readable',
      'A defined win condition and a minimum data threshold agreed up front',
      'Losers cut on schedule rather than on mood',
      'Winners iterated on, not replaced from scratch',
      'A written record of what was tried, so the same angle is not re-run in six months',
    ],
  },
  {
    h: 'Scaling is where most accounts break',
    p: [
      'Finding a profitable ad is the easy half. The expensive mistake is what happens next: budget doubled overnight, the campaign re-enters learning, performance collapses, and the winner gets blamed and killed.',
      'We scale in increments the account can absorb, watching cost per result rather than daily spend, and we accept that some winners have a ceiling. Pushing a good ad past the point it works is how a profitable month becomes an unprofitable one.',
    ],
  },
  {
    h: 'What you get from us',
    p: [
      'Reporting twice a week on cost per result, click-through rate and return on ad spend, with a plain-English note on what changed and why.',
      'Not a dashboard link and silence. If something is not working you will hear it from us first, along with what we intend to do about it.',
    ],
  },
]

const faqs = [
  { q: 'How many ads do you test at once?', a: 'Enough that the account keeps learning, few enough that each has the data to be judged. The exact number depends on your spend.' },
  { q: 'How fast can we scale?', a: 'As fast as cost per result holds. That varies by account, and anyone who gives you a fixed percentage without seeing your numbers is guessing.' },
  { q: 'What happens when a winning ad stops working?', a: 'Creative fatigue is normal, not a failure. That is why the testing pipeline runs continuously rather than stopping once something works.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="Ad Testing & Scaling"
        title="Find The Winner."
        emph="then feed it."
        intro="Structured testing with a win condition agreed before the test runs, then scaling in increments that do not reset learning. Reporting twice a week, in plain English."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
