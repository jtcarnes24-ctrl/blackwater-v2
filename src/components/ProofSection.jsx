import { motion } from 'framer-motion'
import { easeOut, easeInOut, viewport } from '../lib/animations'

const results = [
  {
    img: '/results/result-8.jpg',
    label: 'Meta Ads — 12.97x ROAS',
    desc: '$6,857 in spend generated $88,913 in purchases — 12.97x ROAS across all active campaigns. 875 purchases at $7.84 cost per result.',
  },
  {
    img: '/results/result-9.jpg',
    label: 'Meta Ads — 12.56x ROAS',
    desc: '$1,644 in ad spend returned $20,663 in purchases. Multiple campaigns running consistently above 12x across website and mobile.',
  },
  {
    img: '/results/result-6.jpg',
    label: 'Meta Ads — 11.73x ROAS',
    desc: '$1,321 spent, $15,508 in purchases — 11.73x ROAS average. 103 purchases across campaigns with a $12.83 cost per result.',
  },
  {
    img: '/results/result-7.jpg',
    label: 'Meta Ads — 7.38x ROAS',
    desc: 'Campaigns holding a 7.38x ROAS at $5.63 per purchase with a 15.94% hook rate — creative and targeting dialed in.',
  },
  {
    img: '/results/result-1.jpg',
    label: 'Shopify — $8,236 in a Day',
    desc: '$8,236 in a single day. 193 orders, 578% jump over the previous period. Consistent traffic flow and an offer that converted.',
  },
  {
    img: '/results/result-2.jpg',
    label: 'Shopify — $7,659 in a Day',
    desc: '$7,659 with 159 orders and a 3.04% conversion rate. Revenue up 25% day over day with the same spend — optimization doing its job.',
  },
  {
    img: '/results/result-3.jpg',
    label: 'Shopify — $51K Month',
    desc: '$51,290 in a single month. 204 sessions up 77%, 21 orders. A focused product and the right paid traffic structure behind it.',
  },
  {
    img: '/results/result-4.jpg',
    label: 'Shopify — $4,950 in a Day',
    desc: '$4,950 with 121 orders and a 4.67% conversion rate. Revenue up 57% over the day before — steady scaling, not spiking.',
  },
  {
    img: '/results/result-5.jpg',
    label: 'Shopify — $5,440 in a Day',
    desc: '$5,440 in one day, 58% above the prior period with a 3.08% conversion rate. Clean traffic, solid offer, ads doing exactly what they should.',
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginTop: '4rem',
      }}>
        {results.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut, delay: (i % 3) * 0.08 }}
            viewport={viewport}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: '#111' }}>
              <img
                src={r.img}
                alt={r.label}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              />
            </div>
            <div style={{ padding: '1.25rem' }}>
              <p style={{
                fontSize: '0.78rem', fontWeight: 700, color: '#f2ede4',
                letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem',
              }}>
                {r.label}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
                {r.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
