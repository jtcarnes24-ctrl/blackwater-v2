import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'TikTok is not Meta with different dimensions',
    p: [
      'The most common way brands waste money on TikTok is running their Meta creative on it. The placement is the same shape, so it feels like it should work. It does not, because the two platforms reward completely different behaviour.',
      'Meta rewards a clear offer put in front of a well-defined audience. TikTok rewards content that earns attention on its own merit before it ever asks for anything. An ad that opens with a logo and a discount code gets scrolled past in under a second. An ad that opens mid-sentence with a real person holding the product gets watched.',
      'We build TikTok creative natively for the platform, then let performance decide which angles deserve budget.',
    ],
  },
  {
    h: 'What the work looks like',
    p: [
      'Setup comes first: the TikTok pixel, event configuration and a campaign structure that gives the algorithm enough conversion signal to optimise against.',
      'Then volume. TikTok burns through creative faster than Meta does, so a campaign that is fed two ads a month will stall regardless of how good those two ads are. The account needs a steady supply of new angles, and the testing framework needs to identify a winner quickly enough to matter.',
    ],
    list: [
      'TikTok pixel and events setup, with conversion tracking verified before spend starts',
      'Native-first creative concepts written for the platform rather than adapted from Meta',
      'Hook testing, because the first second decides whether the rest of the ad is seen',
      'Structured scaling once an angle proves it holds cost per result at higher spend',
      'Honest reporting on which angles worked and which did not',
    ],
  },
  {
    h: 'When TikTok is the wrong channel',
    p: [
      'TikTok suits visual, demonstrable, impulse-friendly products with a broad audience. If your product is genuinely better shown than explained, it is a strong fit.',
      'It is a poor fit for high-consideration purchases with long sales cycles, tightly regulated categories, or brands with no capacity to produce a steady stream of new creative. If we think Meta alone would serve you better, we will say so rather than sell you a second channel you do not need.',
    ],
  },
]

const faqs = [
  { q: 'Do I need to appear on camera?', a: 'No, though founder-led content often performs well. Product-led demonstrations, voiceover formats and creator content all work. What matters is that it feels native to the platform rather than like a repurposed television spot.' },
  { q: 'Can you run Meta and TikTok together?', a: 'Yes, and it is usually the better setup once Meta is stable. Meta tends to be the reliable base and TikTok the upside, so we would rather get one performing before adding the other.' },
  { q: 'How much creative does TikTok need?', a: 'More than Meta. Creative fatigues faster, so the account needs a consistent supply of new angles rather than a single batch at the start.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="TikTok Ads Management"
        title="TikTok Ads Built"
        emph="natively."
        intro="TikTok campaigns for e-commerce brands, built around creative made for the platform rather than repurposed from Meta. Setup, tracking, creative volume and scaling."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
