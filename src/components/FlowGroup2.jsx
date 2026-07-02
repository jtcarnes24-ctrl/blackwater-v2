import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FlowArt, { FlowSection } from './ui/FlowArt'
import { AIChart } from './ui/AIChart'
import { easeOut, easeInOut, viewport } from '../lib/animations'

const testimonials = [
  { quote: "Jack and the team don't just run ads and disappear. They're constantly testing stuff, sending updates, and actually explaining what's working. It feels like having another team in our business instead of another agency.", name: 'Luca Moretti' },
  { quote: "I've worked with agencies before and this was a completely different experience. The communication is fast, they're straight up about what's working, and our numbers have looked better every month since we started.", name: 'Priya Narayanan' },
  { quote: "One thing I noticed right away was how much they actually cared about the outcome. They weren't just trying to spend our budget. Every change had a reason behind it and it paid off.", name: 'Mateo Álvarez' },
  { quote: "These guys are lowkey obsessed with improving everything. Every week there was something new being tested or optimized. It made me feel like our account was actually getting attention instead of being forgotten.", name: 'Zain Al-Haddad' },
  { quote: "I was honestly skeptical because everyone says they can scale brands. BlackWater actually backed it up. We finally have a system that brings in sales consistently instead of random good weeks.", name: 'Anika Sørensen' },
  { quote: "The response time is crazy. I don't think I've ever waited more than a couple hours for an answer. Having three people working together on our account definitely makes a difference.", name: 'Thiago Carvalho' },
  { quote: "I've never had an agency send this many ideas without me asking. New creatives, landing page feedback, ad angles, offers. They helped improve way more than just our Meta ads.", name: 'Sofia Petrovic' },
  { quote: "Probably the easiest agency we've worked with. No confusing reports or fluff. They just tell you what happened, what's changing next, and keep pushing to get better results. Love that.", name: "Kieran O'Donnell" },
  { quote: "Our CPA kept creeping up and we couldn't figure out why. BlackWater came in, cleaned everything up, and within a few weeks we were finally profitable again. Wish we found them sooner lol.", name: 'Nikolai Varga' },
  { quote: "Shout out to the whole BlackWater crew. It never felt like one person trying to juggle everything. There was always someone available, ideas were flowing, and they treated our brand like it was their own.", name: 'Yara Ben Salem' },
]

function TestimonialCarousel() {
  const [index, setIndex] = useState(0)

  const goPrev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
  const goNext = () => setIndex((i) => (i + 1) % testimonials.length)

  const t = testimonials[index]
  const arrowBtnStyle = {
    width: '40px', height: '40px', borderRadius: '999px',
    border: '1px solid rgba(8,8,8,0.15)', background: 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0, color: '#080808',
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 4vw, 2.5rem)', width: '100%', justifyContent: 'center' }}>
        <button type="button" aria-label="Previous testimonial" onClick={goPrev} style={arrowBtnStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div style={{ width: '100%', maxWidth: '560px', minHeight: '260px', display: 'flex', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                background: 'rgba(8,8,8,0.05)', border: '1px solid rgba(8,8,8,0.08)',
                borderRadius: '4px', padding: '1.75rem', width: '100%',
              }}
            >
              <p style={{ fontSize: '1.5rem', color: 'rgba(8,8,8,0.15)', fontWeight: 700, lineHeight: 1, marginBottom: '0.75rem' }}>"</p>
              <p style={{ fontSize: '0.95rem', color: 'rgba(8,8,8,0.65)', lineHeight: 1.65, marginBottom: '1.25rem' }}>{t.quote}</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#080808', letterSpacing: '0.05em' }}>{t.name}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <button type="button" aria-label="Next testimonial" onClick={goNext} style={arrowBtnStyle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <p style={{ fontSize: '0.75rem', color: 'rgba(8,8,8,0.4)', letterSpacing: '0.05em', fontWeight: 600 }}>
        {index + 1} / {testimonials.length}
      </p>
    </div>
  )
}

export function FlowGroup2() {
  return (
    <FlowArt aria-label="AI and Testimonials">
      {/* AI Section */}
      <FlowSection
        id="ai"
        aria-label="AI-powered advertising"
        style={{ background: '#080808', color: '#ffffff' }}
      >
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%' }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }} viewport={viewport}
            style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginBottom: '1.5rem' }}
          >
            AI-Powered Advertising
          </motion.p>

          {/* Heading overlaid on the demand-index graph */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'clamp(240px, 34vh, 360px)' }}>
            <motion.div
              initial={{ opacity: 0 }} whileInView={{ opacity: 0.3 }}
              transition={{ duration: 1, ease: easeOut }} viewport={viewport}
              aria-hidden="true"
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', pointerEvents: 'none', zIndex: 0 }}
            >
              <AIChart />
            </motion.div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              {["WE DON'T JUST", 'RUN ADS.', 'WE ENGINEER', 'THEM.'].map((line, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  {/* Reveal on mount, not scroll — this heading sits inside a
                      GSAP-pinned section where whileInView + clip-path is
                      unreliable, and it must always be visible over the graph */}
                  <motion.h2
                    initial={{ clipPath: 'inset(0 0 100% 0)' }}
                    animate={{ clipPath: 'inset(0 0 0% 0)' }}
                    transition={{ duration: 0.75, ease: easeInOut, delay: 0.2 + i * 0.07 }}
                    style={{ fontSize: 'clamp(2rem, 4.5vw, 4.5rem)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 0.95, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}
                  >
                    {line}
                  </motion.h2>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting copy below */}
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.35 }} viewport={viewport}
            style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: '60ch', margin: '2.5rem 0 1rem' }}
          >
            Brands that aren't using AI in their marketing right now aren't just falling behind, they're getting priced out. The cost to acquire a customer keeps climbing while your competitors are using AI to find better audiences, test more creatives, and optimize faster than any human team can keep up with manually.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.42 }} viewport={viewport}
            style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: '60ch', margin: '0 0 1rem' }}
          >
            We've watched brands with solid products shut down because their ad accounts dried up and they had no system to fix it. No creative testing framework. No AI-assisted analysis. Just guessing and hoping the numbers come back. They don't.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.49 }} viewport={viewport}
            style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: '60ch', margin: 0 }}
          >
            Every campaign at BlackWater runs AI-driven creative analysis, audience modeling, and real-time budget optimization. It's not an add-on, it's built into how we operate.
          </motion.p>
        </div>
      </FlowSection>

      {/* Testimonials */}
      <FlowSection
        id="testimonials"
        aria-label="Client testimonials"
        style={{ background: '#f2ede4', color: '#080808' }}
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }} viewport={viewport}
          style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(8,8,8,0.4)', fontWeight: 600 }}
        >
          Client Feedback
        </motion.p>

        {['WHAT OUR', 'CLIENTS SAY'].map((line, i) => (
          <div key={line} style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
              transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.08 }}
              viewport={viewport}
              style={{ fontSize: 'clamp(2.5rem, 6vw, 6.5rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.92, color: '#080808', textTransform: 'uppercase', margin: 0 }}
            >
              {line}
            </motion.h2>
          </div>
        ))}

        <TestimonialCarousel />
      </FlowSection>
    </FlowArt>
  )
}
