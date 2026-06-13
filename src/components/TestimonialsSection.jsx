import { motion } from 'framer-motion'
import { clipReveal, fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'

const testimonials = [
  { quote: 'Started working with BlackWater a few months ago and the difference has honestly been huge. The ads actually feel structured now instead of just throwing content out and hoping something works. Communication has been solid too.', name: 'Dmitri V.' },
  { quote: 'What stood out to me was how focused they were on testing and improving everything instead of making random changes. We started getting more consistent sales pretty quickly once everything was dialed in.', name: 'Noah R.' },
  { quote: 'A lot of agencies just talk, but these guys actually care about performance. They helped us improve our creatives, landing pages, and ad structure instead of only touching the ads themselves.', name: 'Giuseppe C.' },
  { quote: 'Really good experience overall. They explained everything clearly, kept me updated, and actually helped us figure out what was hurting conversions on our site.', name: 'Charlotte L.' },
]

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 },
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" style={{ background: '#080808', padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
        <motion.div variants={staggerContainer(0.08)} initial="hidden" whileInView="show" viewport={viewport}>
          <motion.p variants={fadeUp} transition={{ duration: 0.5, ease: easeOut }}
            style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem', fontWeight: 600 }}>
            Client Feedback
          </motion.p>
          {['WHAT OUR', 'CLIENTS', 'SAY'].map((line, i) => (
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
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 0.35 }} transition={{ duration: 0.8, delay: 0.3 }} viewport={viewport}
          style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#fff', lineHeight: 1.9, marginTop: '0.5rem' }}
        >
          Voices Of<br />Satisfaction<br />And Success
        </motion.p>
      </div>

      <motion.div
        variants={staggerContainer(0.1, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.25rem' }}
      >
        {testimonials.map((t) => (
          <motion.div
            key={t.name}
            variants={cardVariant}
            transition={{ duration: 0.55, ease: easeOut }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '4px', padding: '2rem',
            }}
          >
            <p style={{ fontSize: '1.8rem', color: 'rgba(255,255,255,0.15)', fontWeight: 700, lineHeight: 1, marginBottom: '1rem' }}>"</p>
            <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: '1.5rem' }}>{t.quote}</p>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f2ede4', letterSpacing: '0.05em' }}>{t.name}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
