import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { WordWaveHero } from '../components/pages/WordWaveHero'
import { AboutTimeline } from '../components/pages/AboutTimeline'
import { AboutManifesto } from '../components/pages/AboutManifesto'
import { ResultsSection } from '../components/ResultsSection'
import { FounderSection } from '../components/FounderSection'
import { FAQSection } from '../components/FAQSection'
import { ContactSection } from '../components/ContactSection'

/* Positioning statements only — no performance figures or client claims here.
   The verified numbers live in ResultsSection, which renders below. */
const beats = [
  {
    h: 'Judged on results, not reports.',
    p: 'Most agencies sell you a monthly fee and a report. We would rather be judged on one thing: is your account making money? That is what decides if you stay.',
  },
  {
    h: 'Three numbers that matter.',
    p: 'Cost per result, click-through rate and return on ad spend. In plain words: what each sale costs, how many people click, and how much you make back. Everything else is just for show. If a campaign cannot win on those three, it gets cut.',
  },
  {
    h: 'The person you meet runs your account.',
    p: 'You will not get handed to a junior after the first call. The person who builds your plan is the one inside your ad account every day.',
  },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Dark shell: the light sections below paint their own white, and a
        white page showed through as a hairline under the hero. */}
    <Layout dark>
      <WordWaveHero />
      <AboutTimeline />
      <AboutManifesto
        statement="No fluff and no ego. Just clear numbers you can act on."
        beats={beats}
      />
      <ResultsSection />
      <FounderSection />
      <FAQSection />
      <ContactSection />
    </Layout>
  </StrictMode>
)
