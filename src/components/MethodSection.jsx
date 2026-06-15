import { motion } from 'framer-motion'
import { clipReveal, fadeUp, slideRight, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'

const pillars = [
  { num: '01', title: 'Built on What Works', desc: 'The Method was built by studying the top-performing strategies across the industry and combining them into one. No guesswork. No borrowed ideas. Just what works, distilled.' },
  { num: '02', title: 'Engineered for Performance', desc: 'Every decision has a reason behind it. The structure is designed to get results efficiently, so your ad spend works harder from day one, not after months of trial and error.' },
  { num: '03', title: 'Applied Consistently', desc: "The Method isn't adjusted per campaign. It's the foundation. That consistency is what creates predictable, repeatable results for every client we work with." },
]

export function MethodSection() {
  return (
    <section id="method" style={{ background: '#f2ede4', padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)', borderTop: '1px solid rgba(8,8,8,0.08)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>

        <motion.div variants={staggerContainer(0.1, 0.05)} initial="hidden" whileInView="show" viewport={viewport}>
          <motion.p variants={fadeUp} transition={{ duration: 0.5, ease: easeOut }}
            style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(8,8,8,0.4)', marginBottom: '2rem', fontWeight: 600 }}>
            How We Work
          </motion.p>
          {['THE', 'METHOD'].map((line, i) => (
            <div key={line} style={{ overflow: 'hidden' }}>
              <motion.h2
                variants={clipReveal}
                transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.08 }}
                style={{ fontSize: 'clamp(2.5rem, 5vw, 5.5rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.92, color: '#080808', textTransform: 'uppercase', margin: 0 }}
              >
                {line}
              </motion.h2>
            </div>
          ))}
          <motion.div variants={staggerContainer(0.1, 0.3)} initial="hidden" whileInView="show" viewport={viewport}>
            <motion.p variants={fadeUp} transition={{ duration: 0.6, ease: easeOut }}
              style={{ fontSize: '0.92rem', color: 'rgba(8,8,8,0.55)', lineHeight: 1.7, marginTop: '2rem', marginBottom: '1rem' }}>
              It didn't come from a course or a template. It came from years of studying the best media buyers and marketing agencies in the world, pulling what actually produces results, cutting what doesn't.
            </motion.p>
            <motion.p variants={fadeUp} transition={{ duration: 0.6, ease: easeOut }}
              style={{ fontSize: '0.92rem', color: 'rgba(8,8,8,0.55)', lineHeight: 1.7 }}>
              Every campaign we run is built on it. It's the thinking behind them, the structure, the sequencing, the decisions most agencies never think to make.
            </motion.p>
          </motion.div>
        </motion.div>

        <motion.div variants={staggerContainer(0.15, 0.2)} initial="hidden" whileInView="show" viewport={viewport}
          style={{ display: 'flex', flexDirection: 'column' }}>
          {pillars.map((p, i) => (
            <motion.div
              key={p.num}
              variants={slideRight}
              transition={{ duration: 0.55, ease: easeOut }}
              style={{
                padding: '2rem 0',
                borderTop: '1px solid rgba(8,8,8,0.12)',
                ...(i === pillars.length - 1 ? { borderBottom: '1px solid rgba(8,8,8,0.12)' } : {}),
              }}
            >
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(8,8,8,0.3)', fontWeight: 700, marginBottom: '0.6rem' }}>{p.num}</p>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#080808', marginBottom: '0.5rem' }}>{p.title}</h4>
              <p style={{ fontSize: '0.88rem', color: 'rgba(8,8,8,0.55)', lineHeight: 1.65 }}>{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
