import { motion } from 'framer-motion'
import FlowArt, { FlowSection } from './ui/FlowArt'
import { clipReveal, fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'

const pillars = [
  { num: '01', title: 'A Method, Not a Template', desc: 'Built by studying the top-performing strategies across the industry and keeping only what actually produces results. Every campaign runs on the same foundation, so performance is repeatable instead of lucky.' },
  { num: '02', title: 'Audiences Built on Real Intent', desc: 'Most agencies pick interests and hope. We use intent data to build and target audiences already in the market for what you sell, then feed it into lookalikes. Very few agencies work this way.' },
  { num: '03', title: 'Creators On Demand', desc: 'Winning ads take volume, and volume takes people on camera. We pull from a network of UGC creators to get brands real content at the pace testing actually requires. No casting, no filming on your end.' },
]

export function FlowGroup1() {
  return (
    <FlowArt aria-label="About and Method">
      {/* About */}
      <FlowSection
        id="about"
        aria-label="About us"
        style={{ background: '#ffffff', color: '#080808' }}
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }} viewport={viewport}
          style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(8,8,8,0.4)', fontWeight: 600 }}
        >
          About Us
        </motion.p>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {['REDEFINING', 'MARKETING FOR', <>THE <span className="emph">digital</span> AGE</>].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <motion.h2
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.07 }}
                viewport={viewport}
                style={{ fontSize: 'clamp(2.5rem, 6.5vw, 7rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.92, color: '#080808', textTransform: 'uppercase', margin: 0 }}
              >
                {line}
              </motion.h2>
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.3 }} viewport={viewport}
          style={{ fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', color: 'rgba(8,8,8,0.6)', lineHeight: 1.7, maxWidth: '55ch' }}
        >
          BlackWater Marketing is a performance-driven digital marketing agency built for brands that don't settle. We specialize in Meta ad campaigns that actually move the needle, not just run. Creative strategy, conversion optimization, and paid advertising working together so every dollar you spend has a reason to be there.
        </motion.p>
      </FlowSection>

      {/* Method */}
      <FlowSection
        id="method"
        aria-label="The Method"
        style={{ background: '#ffffff', color: '#080808' }}
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }} viewport={viewport}
          style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(8,8,8,0.4)', fontWeight: 600 }}
        >
          How We Work
        </motion.p>

        <div className="method-grid">
          <div>
            {['THE', <span className="emph">method</span>].map((line, i) => (
              <div key={i} style={{ overflow: 'hidden' }}>
                <motion.h2
                  initial={{ clipPath: 'inset(0 0 100% 0)' }}
                  whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                  transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.08 }}
                  viewport={viewport}
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.9, color: '#080808', textTransform: 'uppercase', margin: 0 }}
                >
                  {line}
                </motion.h2>
              </div>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }} viewport={viewport}
              style={{ fontSize: '0.92rem', color: 'rgba(8,8,8,0.5)', lineHeight: 1.7, marginTop: '2rem' }}
            >
              Every campaign we run is built on it. It's the thinking behind the ads, the structure, the sequencing, the decisions most agencies never think to make.
            </motion.p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {pillars.map((p, i) => (
              <motion.div
                key={p.num}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: easeOut, delay: 0.1 + i * 0.1 }}
                viewport={viewport}
                style={{ padding: '1.5rem 0', borderTop: '1px solid rgba(8,8,8,0.1)', ...(i === pillars.length - 1 ? { borderBottom: '1px solid rgba(8,8,8,0.1)' } : {}) }}
              >
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(8,8,8,0.3)', fontWeight: 700, marginBottom: '0.4rem' }}>{p.num}</p>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#080808', marginBottom: '0.4rem' }}>{p.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(8,8,8,0.5)', lineHeight: 1.6 }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </FlowSection>
    </FlowArt>
  )
}
