import { motion } from 'framer-motion'
import { clipReveal, fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'
import { LiquidButton } from './ui/LiquidButton'

const services = [
  { num: '01', name: 'Meta Ads Management', desc: 'Scaling brands through high-performing paid advertising on Facebook and Instagram. Built to convert, optimized to grow.' },
  { num: '02', name: 'TikTok Ads', desc: 'Short-form video campaigns engineered for TikTok\'s algorithm. We build creatives that stop the scroll and systems that turn views into sales.' },
  { num: '03', name: 'Funnel Creation & Optimization', desc: 'We build and optimize the full customer journey — from ad click to checkout. Every step is structured to reduce drop-off and increase revenue.' },
  { num: '04', name: 'Ad Creation', desc: 'Scroll-stopping creatives and ad concepts built to improve engagement, lower acquisition costs, and drive results that show in the numbers.' },
  { num: '05', name: 'Email & SMS Marketing', desc: 'Retention campaigns that keep your customers coming back. Automated flows and broadcast campaigns built to generate revenue between ad pushes.' },
  { num: '06', name: 'B2B Marketing & CRM', desc: 'Full-service CRM setup and automation for targeted email campaigns. We reach your ideal prospects, build the sequences, and drive revenue from the top of the funnel down.' },
  { num: '07', name: 'Conversion Optimization', desc: 'Landing pages, offers, and post-click experiences refined to turn traffic into revenue and push your ROAS higher.' },
  { num: '08', name: 'Web Design', desc: 'Modern, high-converting websites built around your brand — designed to look the part and close the deal.' },
]

const cardVariant = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0 },
}

export function ServicesSection() {
  return (
    <section id="services" style={{ background: '#080808', padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
        <motion.div variants={staggerContainer(0.08)} initial="hidden" whileInView="show" viewport={viewport}>
          <motion.p variants={fadeUp} transition={{ duration: 0.5, ease: easeOut }}
            style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '1.25rem', fontWeight: 600 }}>
            What We Do
          </motion.p>
          {['OUR', 'SERVICES'].map((line, i) => (
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

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: easeOut }} viewport={viewport}>
          <LiquidButton href="https://calendly.com/blkwtrenterprises/30min" target="_blank" rel="noopener noreferrer">
            Get Started
          </LiquidButton>
        </motion.div>
      </div>

      <motion.div
        variants={staggerContainer(0.1, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {services.map((s) => (
          <motion.div
            key={s.num}
            variants={cardVariant}
            transition={{ duration: 0.55, ease: easeOut }}
            whileHover={{ backgroundColor: '#111' }}
            style={{ background: '#080808', padding: '2.5rem 2rem', transition: 'background 0.3s' }}
          >
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', fontWeight: 700, marginBottom: '1.5rem' }}>{s.num}</p>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.9rem', lineHeight: 1.2 }}>{s.name}</h3>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>{s.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
