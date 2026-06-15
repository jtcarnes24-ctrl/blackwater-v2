import { motion } from 'framer-motion'
import { easeOut, easeInOut, viewport } from '../lib/animations'

const results = [
  {
    img: '/results/result-8.jpg',
    label: 'Meta Ads',
    stat: '12.97x ROAS',
    desc: '$6,857 in spend generated $88,913 in purchases. 875 purchases at $7.84 cost per result.',
    span: '1 / 6',
  },
  {
    img: '/results/result-9.jpg',
    label: 'Meta Ads',
    stat: '12.56x ROAS',
    desc: '$1,644 in ad spend returned $20,663 in purchases across website and mobile.',
    span: '6 / 9',
    tall: true,
  },
  {
    img: '/results/result-6.jpg',
    label: 'Meta Ads',
    stat: '11.73x ROAS',
    desc: '$1,321 spent, $15,508 in purchases. 103 purchases at $12.83 per result.',
    span: '9 / 13',
    tall: true,
  },
  {
    img: '/results/result-7.jpg',
    label: 'Meta Ads',
    stat: '7.38x ROAS',
    desc: '$5.63 per purchase with a 15.94% hook rate. Creative and targeting dialed in.',
    span: '1 / 5',
  },
  {
    img: '/results/result-1.jpg',
    label: 'Shopify',
    stat: '$8,236/day',
    desc: '193 orders. 578% jump over the previous period.',
    span: '5 / 9',
  },
  {
    img: '/results/result-2.jpg',
    label: 'Shopify',
    stat: '$7,659/day',
    desc: '159 orders, 3.04% conversion rate. Revenue up 25% day-over-day on same spend.',
    span: '9 / 13',
  },
  {
    img: '/results/result-3.jpg',
    label: 'Shopify',
    stat: '$51K month',
    desc: '$51,290 in a single month. Sessions up 77%.',
    span: '1 / 7',
  },
  {
    img: '/results/result-5.jpg',
    label: 'Shopify',
    stat: '$5,440/day',
    desc: '58% above prior period. 3.08% conversion rate. Ads doing exactly what they should.',
    span: '7 / 13',
  },
]

export function ProofSection() {
  return (
    <section
      id="results-proof"
      style={{
        background: '#080808',
        padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
            viewport={viewport}
            style={{
              fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)', fontWeight: 600, marginBottom: '1.25rem',
            }}
          >
            Client Results
          </motion.p>
          {['PROOF IN', 'THE NUMBERS'].map((line, i) => (
            <div key={line} style={{ overflow: 'hidden' }}>
              <motion.h2
                initial={{ clipPath: 'inset(0 0 100% 0)' }}
                whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.08 }}
                viewport={viewport}
                style={{
                  fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 700,
                  letterSpacing: '-0.03em', lineHeight: 0.92,
                  color: '#ffffff', textTransform: 'uppercase', margin: 0,
                }}
              >
                {line}
              </motion.h2>
            </div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 0.35 }} transition={{ duration: 0.8, delay: 0.3 }} viewport={viewport}
          style={{ fontSize: '0.75rem', color: '#fff', lineHeight: 1.7, maxWidth: '180px', textAlign: 'right' }}
        >
          Real campaigns. Real accounts. Real revenue.
        </motion.p>
      </div>

      <style>{`
        .proof-bento { display: grid; grid-template-columns: repeat(12, 1fr); gap: 1rem; }
        @media (max-width: 768px) {
          .proof-bento { grid-template-columns: 1fr 1fr !important; }
          .proof-bento > * { grid-column: span 1 !important; }
        }
        @media (max-width: 480px) {
          .proof-bento { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Asymmetric bento grid */}
      <div className="proof-bento">
        {results.map((r, i) => (
          <motion.div
            key={r.label + i}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut, delay: (i % 4) * 0.07 }}
            viewport={viewport}
            style={{
              gridColumn: r.span, /* overridden on mobile by .proof-bento > * */
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{
              width: '100%',
              aspectRatio: r.tall ? '3/4' : '16/9',
              overflow: 'hidden',
              background: '#111',
              flexShrink: 0,
            }}>
              <img
                src={r.img}
                alt={r.label}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              />
            </div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{r.label}</p>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f2ede4', letterSpacing: '-0.01em', flexShrink: 0 }}>{r.stat}</p>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{r.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
