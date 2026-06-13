import { motion } from 'framer-motion'
import { easeOut, easeInOut, viewport } from '../lib/animations'

const results = [
  {
    img: '/results/result-1.jpg',
    label: 'Lead Gen — $6.4K in a Day',
    desc: '$6,400 in sales and 426 orders in a single day. We structured the campaign around a tight audience and let the creative do the heavy lifting.',
  },
  {
    img: '/results/result-2.jpg',
    label: 'Clothing Brand — First $10K Month',
    desc: 'A clothing client that had never crossed five figures in a month. We rebuilt their ad structure from scratch and got them there with 654 orders.',
  },
  {
    img: '/results/result-10.jpg',
    label: 'Ecom — $56K Month',
    desc: '$56,873 in 30 days with a 312% lift over the previous period. Consistent daily spend, tested creatives, and a scaling strategy that held up.',
  },
  {
    img: '/results/result-6.jpg',
    label: 'Ecom — $39K Month',
    desc: '$39,936 in a single month — 162 orders at a 7.29% conversion rate. Clean funnel, right audience, and ads that kept performing.',
  },
  {
    img: '/results/result-5.jpg',
    label: 'Drop Day — $8,433 in 24 Hours',
    desc: '227 orders and $8,433 on a single product drop. Orders up 588% over the prior period. Campaigns were prepped and the timing was locked in.',
  },
  {
    img: '/results/result-8.jpg',
    label: 'Flash Sale — $8,433 Revenue',
    desc: '$8,433 from a flash sale campaign. 227 orders, 592% jump in sales. Short window, maximum output.',
  },
  {
    img: '/results/result-4.jpg',
    label: 'End of Year Flash Sale — $4,558',
    desc: '$4,558 in one day off a year-end flash sale. 87 orders, 73% revenue increase over the day before. Quick turnaround, strong return.',
  },
  {
    img: '/results/result-3.jpg',
    label: 'Q4 Push — 519% Sales Increase',
    desc: '$3,415 with a 519% spike in revenue and a 4.8% conversion rate. Q4 campaigns live and die by the setup — this one was dialed.',
  },
  {
    img: '/results/result-7.jpg',
    label: 'Single Day — $5,440',
    desc: '$5,440 in one day, 58% higher than the day before with a 3.08% conversion rate. Steady spend, consistent output.',
  },
  {
    img: '/results/result-9.jpg',
    label: 'Meta Ads — 11.79x ROAS',
    desc: '$1,321 in ad spend turned into $19,508 in purchases — 11.79x ROAS across all campaigns. 928 add-to-carts, 164 purchases.',
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
