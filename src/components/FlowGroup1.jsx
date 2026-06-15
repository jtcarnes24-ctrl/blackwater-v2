import { motion } from 'framer-motion'
import FlowArt, { FlowSection } from './ui/FlowArt'
import { clipReveal, fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'

const pillars = [
  { num: '01', title: 'Built on What Works', desc: 'The Method was built by studying the top-performing strategies across the industry and combining them into one. No guesswork. No borrowed ideas. Just what works, distilled.' },
  { num: '02', title: 'Engineered for Performance', desc: 'Every decision has a reason behind it. The structure is designed to get results efficiently, so your ad spend works harder from day one, not after months of trial and error.' },
  { num: '03', title: 'Applied Consistently', desc: "The Method isn't adjusted per campaign. It's the foundation. That consistency is what creates predictable, repeatable results for every client we work with." },
]

export function FlowGroup1() {
  return (
    <FlowArt aria-label="About and Method">
      {/* About */}
      <FlowSection
        id="about"
        aria-label="About us"
        style={{ background: '#f2ede4', color: '#080808' }}
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }} viewport={viewport}
          style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(8,8,8,0.4)', fontWeight: 600 }}
        >
          About Us
        </motion.p>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {['REDEFINING', 'MARKETING FOR', 'THE DIGITAL AGE'].map((line, i) => (
            <div key={line} style={{ overflow: 'hidden' }}>
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
        style={{ background: '#080808', color: '#ffffff' }}
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }} viewport={viewport}
          style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}
        >
          How We Work
        </motion.p>

        <div className="method-grid">
          <div>
            {['THE', 'METHOD'].map((line, i) => (
              <div key={line} style={{ overflow: 'hidden' }}>
                <motion.h2
                  initial={{ clipPath: 'inset(0 0 100% 0)' }}
                  whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                  transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.08 }}
                  viewport={viewport}
                  style={{ fontSize: 'clamp(2.5rem, 5vw, 6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.9, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}
                >
                  {line}
                </motion.h2>
              </div>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }} viewport={viewport}
              style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginTop: '2rem' }}
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
                style={{ padding: '1.5rem 0', borderTop: '1px solid rgba(255,255,255,0.08)', ...(i === pillars.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.08)' } : {}) }}
              >
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', fontWeight: 700, marginBottom: '0.4rem' }}>{p.num}</p>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>{p.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </FlowSection>
    </FlowArt>
  )
}
