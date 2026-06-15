import { motion } from 'framer-motion'
import { clipReveal, fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'

const testimonials = [
  { quote: 'Started working with BlackWater a few months ago and the difference has honestly been huge. The ads actually feel structured now instead of just throwing content out and hoping something works.', name: 'Dmitri V.', role: 'E-commerce Founder' },
  { quote: 'What stood out was how focused they were on testing and improving everything. We started getting more consistent sales pretty quickly once everything was dialed in.', name: 'Noah R.', role: 'DTC Brand Owner' },
  { quote: 'A lot of agencies just talk, but these guys actually care about performance. They helped us improve creatives, landing pages, and ad structure, not just the ads themselves.', name: 'Giuseppe C.', role: 'Brand Director' },
  { quote: 'Really good experience overall. They explained everything clearly, kept me updated, and actually helped us figure out what was hurting conversions on our site.', name: 'Charlotte L.', role: 'Marketing Lead' },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ background: '#080808', padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <motion.div variants={staggerContainer(0.08)} initial="hidden" whileInView="show" viewport={viewport} style={{ marginBottom: '4rem' }}>
        {['WHAT OUR', 'CLIENTS SAY'].map((line, i) => (
          <div key={line} style={{ overflow: 'hidden' }}>
            <motion.h2
              variants={clipReveal}
              transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.08 }}
              style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.92, color: '#ffffff', textTransform: 'uppercase', margin: 0 }}
            >
              {line}
            </motion.h2>
          </div>
        ))}
      </motion.div>

      <style>{`
        .testimonials-bento { display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: auto auto; gap: 1rem; }
        @media (max-width: 768px) {
          .testimonials-bento { grid-template-columns: 1fr !important; grid-template-rows: auto !important; }
          .testimonials-bento > * { grid-column: 1 / -1 !important; grid-row: auto !important; }
        }
      `}</style>

      {/* Bento-style asymmetric testimonial grid */}
      <motion.div
        className="testimonials-bento"
        variants={staggerContainer(0.1, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {/* Large card, col 1-7 */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.55, ease: easeOut }}
          style={{ gridColumn: '1 / 8', gridRow: '1 / 2' }}
        >
          <TestimonialCard t={testimonials[0]} large />
        </motion.div>

        {/* Tall card, col 8-12, rows 1-2 */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.08 }}
          style={{ gridColumn: '8 / 13', gridRow: '1 / 3' }}
        >
          <TestimonialCard t={testimonials[1]} tall />
        </motion.div>

        {/* Small card, col 1-4, row 2 */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.14 }}
          style={{ gridColumn: '1 / 5', gridRow: '2 / 3' }}
        >
          <TestimonialCard t={testimonials[2]} />
        </motion.div>

        {/* Small card, col 4-8, row 2 */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.55, ease: easeOut, delay: 0.2 }}
          style={{ gridColumn: '5 / 8', gridRow: '2 / 3' }}
        >
          <TestimonialCard t={testimonials[3]} />
        </motion.div>
      </motion.div>

    </section>
  )
}

function TestimonialCard({ t, large, tall }) {
  return (
    /* Outer shell (double-bezel) */
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '16px',
      padding: '2px',
      height: '100%',
    }}>
      {/* Inner core */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        borderRadius: '14px',
        padding: large ? '2.5rem 3rem' : '2rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07)',
        minHeight: tall ? '320px' : undefined,
      }}>
        <div>
          <p style={{
            fontSize: large ? '1.8rem' : '1.5rem',
            color: 'rgba(255,255,255,0.12)',
            fontWeight: 700,
            lineHeight: 1,
            marginBottom: '1.25rem',
          }}>"</p>
          <p style={{
            fontSize: large ? '1rem' : '0.9rem',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7,
            marginBottom: '2rem',
          }}>
            {t.quote}
          </p>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.25rem' }}>
          <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f2ede4', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>{t.name}</p>
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{t.role}</p>
        </div>
      </div>
    </div>
  )
}
