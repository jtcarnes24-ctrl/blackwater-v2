import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'Your ad decides who sees it',
    p: [
      'Audience targeting used to win campaigns. That era is mostly over. Broad targeting plus a strong sales signal now beats stacks of interests. So the ad itself decides who sees it.',
      'A hook that speaks to one specific person will find that person. The platform sees who engages and shows the ad to more people like them. The settings matter less now. It\'s in what the ad says in its first second.',
    ],
  },
  {
    h: 'How we build creative',
    p: [
      'We start with angles, not finished ads. An angle is the reason a specific person should care. Most accounts have one angle made ten ways. Then they decide the product doesn\'t work on paid social.',
      'Next we write hooks for each angle and test them first, because the opening decides if anyone sees the rest. Only hooks that hold attention become full ads.',
    ],
    list: [
      'Angles built from real customer words, objections and reviews',
      'Several hook versions per angle, so the test means something',
      'Scripts and concepts for video, static and carousel ads',
      'Tests that change one thing at a time, so results can be read',
      'Building on winners instead of starting over',
    ],
  },
  {
    h: 'What we won\'t do',
    p: [
      'We won\'t invent claims, results or testimonials to make an ad hit harder. It\'s a fast way to get your ad account restricted. It also brings in customers who expect something you never promised.',
      'We also check every campaign against Meta\'s ad rules before it goes live. Health, finance and anything about personal traits are easy to get wrong by accident. A restricted account costs far more than the check.',
    ],
  },
]

const faqs = [
  { q: 'Do you make the videos, or just the concepts?', a: 'We handle concepts, angles, hooks and scripts, and we direct what needs filming. If footage is needed, we tell you exactly what to capture.' },
  { q: 'How many ads does an account need?', a: 'Enough that testing never stalls. The number depends on your spend. An account running one batch for months has stopped learning.' },
  { q: 'Can you work with the ads we already have?', a: 'Yes. We\'d rather find what already works and build on it than replace everything for no reason.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="Creative Strategy & Production"
        title="Ad Creative That"
        emph="gets watched."
        intro="Angles, hooks, scripts and concepts for paid social ads. Today the ad itself is the biggest thing you control, so we treat it as strategy, not decoration."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
