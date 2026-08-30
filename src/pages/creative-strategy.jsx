import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'Creative is the targeting now',
    p: [
      'Audience targeting used to be where campaigns were won. That era is largely over. Broad targeting plus a strong conversion signal now outperforms the layered interest stacks that used to be standard practice, which means the creative itself has become the thing deciding who sees your ad.',
      'A hook that speaks to one specific person will find that person, because the platform reads engagement and serves accordingly. That shifts the work: the leverage is no longer in the settings, it is in what the ad says in its first second.',
    ],
  },
  {
    h: 'How we build creative',
    p: [
      'We start with angles rather than executions. An angle is the argument the ad is making — the specific reason a specific person should care. Most accounts fail because they have one angle produced ten ways, then conclude the product does not work on paid social.',
      'Once angles are defined, each gets a hook written against it. Hooks are tested first, because the opening decides whether anything after it is seen. Only the hooks that hold attention get built into full ads.',
    ],
    list: [
      'Angle development based on real customer language, objections and reviews',
      'Hook writing, with several variations per angle so the test is meaningful',
      'Scripts and concepts for video, plus static and carousel concepts',
      'Structured testing that isolates one variable so results can be read',
      'Iteration on winners rather than starting from scratch each round',
    ],
  },
  {
    h: 'What we will not do',
    p: [
      'We will not invent claims, results or testimonials to make an ad land harder. Beyond being a fast route to a restricted ad account, it produces customers who arrive expecting something you did not promise.',
      'Every campaign is also checked against Meta advertising policy before it ships. Categories like health, finance and anything touching personal attributes have rules that are easy to break by accident, and a restricted account costs far more than the review took.',
    ],
  },
]

const faqs = [
  { q: 'Do you produce the video, or just the concept?', a: 'We handle concepts, angles, hooks and scripts, and direct what needs filming. Where footage is required we will tell you exactly what to capture rather than leaving you to guess.' },
  { q: 'How many creatives does an account need?', a: 'Enough that testing never stalls. The exact number depends on spend, but an account running a single batch of ads for months is an account that has stopped learning.' },
  { q: 'Can you work with our existing creative?', a: 'Yes. We would rather start by finding what is already working and building on it than replace everything for the sake of it.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="Creative Strategy & Production"
        title="Ad Creative That Earns"
        emph="attention."
        intro="Angles, hooks, scripts and concepts built for paid social. Creative is the largest remaining lever in a modern ad account, so it is treated as strategy rather than decoration."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
