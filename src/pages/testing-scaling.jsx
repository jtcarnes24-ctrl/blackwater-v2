import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'A test needs a win condition',
    p: [
      'Most accounts run "tests" with no agreed definition of a winner. Ads get judged after one day, killed on a hunch, or left running because nobody wants to turn them off.',
      'Before a test runs, we decide what result makes a winner and how much data it needs. Then we stick to it.',
    ],
    list: [
      'One thing changed at a time, so the result is clear',
      'A set win condition and minimum data, agreed up front',
      'Losers cut on schedule, not on mood',
      'Winners improved, not replaced',
      'A written record of what was tried',
    ],
  },
  {
    h: 'Scaling is where most accounts break',
    p: [
      'Finding a profitable ad is the easy half. Then budget gets doubled overnight, the campaign goes back into learning (the platform\'s trial period), performance drops, and the winner gets killed.',
      'We scale in steps the account can handle. We watch cost per result (what you pay for each sale or lead), not daily spend. Some winners hit a ceiling, and pushing past it can wipe out a profitable month.',
    ],
  },
  {
    h: 'What you get from us',
    p: [
      'Reports twice a week on cost per result, click-through rate (how often people click your ad), and ROAS (revenue for each dollar of ad spend), with a plain note on what changed and why.',
      'No dashboard link and silence. If something is not working, you hear it from us first, with our plan.',
    ],
  },
]

const faqs = [
  { q: 'How many ads do you test at once?', a: 'Enough that the account keeps learning, but few enough that each ad gets enough data to judge. The number depends on your spend.' },
  { q: 'How fast can we scale?', a: 'As fast as cost per result holds. That varies by account. Anyone who gives you a fixed percentage without seeing your numbers is guessing.' },
  { q: 'What happens when a winning ad stops working?', a: 'Ad fatigue is normal, not a failure. That is why testing runs all the time instead of stopping once something works.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="Ad Testing & Scaling"
        title="Ad Testing & Scaling"
        emph="that finds winners."
        intro="We test ads with a win condition set before the test starts. Then we scale winners in small steps, so the ad platform does not have to start learning over. Reports come twice a week, in plain English."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
