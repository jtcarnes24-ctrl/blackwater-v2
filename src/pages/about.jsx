import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ScrollVideoHero } from '../components/pages/ScrollVideoHero'
import { AboutManifesto } from '../components/pages/AboutManifesto'
import { ResultsSection } from '../components/ResultsSection'
import { FounderSection } from '../components/FounderSection'
import { FAQSection } from '../components/FAQSection'
import { ContactSection } from '../components/ContactSection'

/* Positioning statements only — no performance figures or client claims here.
   The verified numbers live in ResultsSection, which renders below. */
const beats = [
  {
    h: 'We were not built to blend in.',
    p: 'Most agencies sell you a retainer and a monthly report. We would rather be judged on whether the account is making money, because that is the only number that decides if you stay.',
  },
  {
    h: 'What drives us is not hype.',
    p: 'It is cost per result, click-through rate and return on ad spend. Everything else is a vanity metric wearing a suit. If a campaign cannot justify itself on those three, it gets cut.',
  },
  {
    h: 'One operator, on your account.',
    p: 'You are not handed to a junior after the pitch. The person who builds the strategy is the person inside the ad account every day, which is why the framework stays consistent across every client we take on.',
  },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ScrollVideoHero
        title="Read The"
        emph="water."
        sub="A performance marketing agency for brands that would rather be measured than flattered."
      />
      <AboutManifesto
        statement="We strip out the noise, the fluff and the ego, and replace it with numbers you can act on."
        beats={beats}
      />
      <ResultsSection />
      <FounderSection />
      <FAQSection />
      <ContactSection />
    </Layout>
  </StrictMode>
)
