import { motion } from 'framer-motion'
import FlowArt, { FlowSection } from './ui/FlowArt'
import { SplineScene } from './ui/SplineScene'
import { AIChart } from './ui/AIChart'
import { easeOut, easeInOut, viewport } from '../lib/animations'

const testimonials = [
  { quote: 'Started working with BlackWater a few months ago and the difference has honestly been huge. The ads actually feel structured now instead of just throwing content out and hoping something works.', name: 'Dmitri V.' },
  { quote: 'What stood out to me was how focused they were on testing and improving everything instead of making random changes. We started getting more consistent sales pretty quickly.', name: 'Noah R.' },
  { quote: 'A lot of agencies just talk, but these guys actually care about performance. They helped us improve our creatives, landing pages, and ad structure.', name: 'Giuseppe C.' },
  { quote: 'Really good experience overall. They explained everything clearly, kept me updated, and actually helped us figure out what was hurting conversions on our site.', name: 'Charlotte L.' },
]

export function FlowGroup2() {
  return (
    <FlowArt aria-label="AI and Testimonials">
      {/* AI Section */}
      <FlowSection
        id="ai"
        aria-label="AI-powered advertising"
        style={{ background: '#080808', color: '#ffffff' }}
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }} viewport={viewport}
          style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}
        >
          AI-Powered Advertising
        </motion.p>

        <div className="ai-layout">
          <div style={{ flex: 1 }}>
            {["WE DON'T JUST", 'RUN ADS.', 'WE ENGINEER', 'THEM.'].map((line, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <motion.h2
                  initial={{ clipPath: 'inset(0 0 100% 0)' }}
                  whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                  transition={{ duration: 0.75, ease: easeInOut, delay: i * 0.07 }}
                  viewport={viewport}
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 4rem)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 0.95, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}
                >
                  {line}
                </motion.h2>
              </div>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.35 }} viewport={viewport}
              style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '42ch', margin: '1.5rem 0 0.85rem' }}
            >
              Brands that aren't using AI in their marketing right now aren't just falling behind — they're getting priced out. The cost to acquire a customer keeps climbing while your competitors are using AI to find better audiences, test more creatives, and optimize faster than any human team can keep up with manually.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.42 }} viewport={viewport}
              style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '42ch', margin: '0 0 0.85rem' }}
            >
              We've watched brands with solid products shut down because their ad accounts dried up and they had no system to fix it. No creative testing framework. No AI-assisted analysis. Just guessing and hoping the numbers come back. They don't.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.49 }} viewport={viewport}
              style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '42ch', margin: '0 0 1.5rem' }}
            >
              Every campaign at BlackWater runs AI-driven creative analysis, audience modeling, and real-time budget optimization. It's not an add-on — it's built into how we operate.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.45 }} viewport={viewport}
            >
              <AIChart />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }} viewport={viewport}
            className="ai-robot"
          style={{}}
            onWheel={e => e.stopPropagation()}
          >
            <div style={{ position: 'absolute', inset: 0 }} onWheel={e => e.stopPropagation()}>
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </motion.div>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', flex: 1, alignContent: 'end' }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut, delay: i * 0.08 }} viewport={viewport}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              style={{
                background: 'rgba(8,8,8,0.05)', border: '1px solid rgba(8,8,8,0.08)',
                borderRadius: '4px', padding: '1.5rem',
              }}
            >
              <p style={{ fontSize: '1.5rem', color: 'rgba(8,8,8,0.15)', fontWeight: 700, lineHeight: 1, marginBottom: '0.75rem' }}>"</p>
              <p style={{ fontSize: '0.88rem', color: 'rgba(8,8,8,0.65)', lineHeight: 1.65, marginBottom: '1.25rem' }}>{t.quote}</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#080808', letterSpacing: '0.05em' }}>{t.name}</p>
            </motion.div>
          ))}
        </div>
      </FlowSection>
    </FlowArt>
  )
}
