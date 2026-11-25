import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicePage } from '../components/pages/ServicePage'
import { ContactSection } from '../components/ContactSection'

const sections = [
  {
    h: 'Why your Meta ads won\'t work on TikTok',
    p: [
      'Brands waste money on TikTok by running their Meta ads there. The ad is the same shape, so it feels like it should work. It doesn\'t, because the two apps reward different things.',
      'Meta rewards a clear offer shown to the right audience. TikTok rewards content that earns attention before it asks for anything. An ad that opens with a logo and a discount code gets scrolled past in under a second. An ad that opens mid-sentence with a real person holding the product gets watched.',
      'We build ads made for TikTok. Then results decide which angles get budget.',
    ],
  },
  {
    h: 'What the work looks like',
    p: [
      'Setup comes first: the TikTok pixel (code that tracks what visitors do), event setup, and a campaign structure that gives TikTok enough sales data to learn from.',
      'Then volume. TikTok burns through ads faster than Meta. A campaign fed two ads a month will stall, however good they are. You need a steady supply of new angles and a test that finds a winner fast.',
    ],
    list: [
      'Pixel and event setup, with tracking checked before spend starts',
      'Ad concepts written for TikTok, not copied from Meta',
      'Hook testing, because the first second decides if anyone sees the rest',
      'Scaling once an angle keeps its cost per result (what you pay for each sale or lead) at higher spend',
      'Honest reports on what worked and what didn\'t',
    ],
  },
  {
    h: 'When TikTok is the wrong channel',
    p: [
      'TikTok suits products that look good on video, are easy to demo, and are easy to buy on impulse. If your product is better shown than explained, it\'s a strong fit.',
      'It\'s a poor fit for things people think about for a long time before buying. It\'s also poor for tightly regulated categories, or brands that can\'t make a steady stream of new videos. If Meta alone would serve you better, we\'ll say so.',
    ],
  },
]

const faqs = [
  { q: 'Do I need to be on camera?', a: 'No, though ads led by the founder often do well. Product demos, voiceovers and creator videos all work. The ad just needs to feel like TikTok, not a TV spot.' },
  { q: 'Can you run Meta and TikTok together?', a: 'Yes, and it\'s usually better once Meta is stable. Meta is the steady base and TikTok the upside. We\'d rather get one working first.' },
  { q: 'How many new ads does TikTok need?', a: 'More than Meta. Ads wear out faster, so you need a steady supply of new angles, not one batch at the start.' },
]

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicePage
        eyebrow="TikTok Ads Management"
        title="TikTok Ads Made"
        emph="for TikTok."
        intro="TikTok ads for e-commerce brands, built for the platform instead of copied from Meta. We handle setup, tracking, new ads and scaling."
        sections={sections}
        faqs={faqs}
      />
      <ContactSection />
    </Layout>
  </StrictMode>
)
