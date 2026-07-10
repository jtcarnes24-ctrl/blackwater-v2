import { useState } from 'react'
import { motion } from 'framer-motion'
import { clipReveal, fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'
import { LiquidButton } from './ui/LiquidButton'

const services = [
  { num: '01', name: 'Meta Ads', desc: 'Scaling brands through high-performing paid advertising on Facebook and Instagram. Built to convert, optimized to grow.' },
  { num: '02', name: 'TikTok Ads', desc: 'Short-form video campaigns engineered for TikTok\'s algorithm. We build creatives that stop the scroll and systems that turn views into sales.' },
  { num: '03', name: 'Funnel Creation & Optimization', desc: 'We build and optimize the full customer journey, from ad click to checkout. Every step is structured to reduce drop-off and increase revenue.' },
  { num: '04', name: 'Ad Creative Generation', desc: 'Scroll-stopping creatives and ad concepts built to improve engagement, lower acquisition costs, and drive results that show in the numbers.' },
  { num: '05', name: 'Email & SMS Marketing', desc: 'Retention campaigns that keep your customers coming back. Automated flows and broadcast campaigns built to generate revenue between ad pushes.' },
  { num: '06', name: 'B2B Marketing & CRM', desc: 'Full-service CRM setup and automation for targeted email campaigns. We reach your ideal prospects, build the sequences, and drive revenue from the top of the funnel down.' },
  { num: '07', name: 'Conversion Optimization', desc: 'Landing pages, offers, and post-click experiences refined to turn traffic into revenue and push your ROAS higher.' },
  { num: '08', name: 'Web Design', desc: 'Modern, high-converting websites built around your brand, designed to look the part and close the deal.' },
]

export function ServicesSection() {
  const [hovered, setHovered] = useState(null)

  return (
    <section id="services" style={{ background: '#C8D746', padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '5rem', flexWrap: 'wrap', gap: '2rem' }}>
        <motion.div variants={staggerContainer(0.08)} initial="hidden" whileInView="show" viewport={viewport}>
            {['OUR', <span className="emph">services</span>].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <motion.h2
                variants={clipReveal}
                transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.08 }}
                style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.92, color: '#080808', textTransform: 'uppercase', margin: 0 }}
              >
                {line}
              </motion.h2>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: easeOut }} viewport={viewport}>
          <LiquidButton
            href="https://calendly.com/blackwatermrkting/45"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#080808', borderColor: '#080808' }}
          >
            Apply Now
          </LiquidButton>
        </motion.div>
      </div>

      {/* Editorial numbered list */}
      <motion.div
        variants={staggerContainer(0.06, 0.1)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {services.map((s, i) => (
          <motion.div
            key={s.num}
            variants={fadeUp}
            transition={{ duration: 0.5, ease: easeOut }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ borderTop: '1px solid rgba(8,8,8,0.12)', cursor: 'default' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(1rem, 3vw, 3rem)',
              padding: 'clamp(1.25rem, 2.5vw, 2rem) 0',
              transition: 'opacity 0.3s',
              opacity: hovered !== null && hovered !== i ? 0.35 : 1,
            }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: 'rgba(8,8,8,0.4)',
                flexShrink: 0,
                width: '2rem',
                transform: hovered === i ? 'translateX(0)' : 'translateX(-8px)',
                opacity: hovered === i ? 1 : 0.3,
                transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1), opacity 0.3s ease',
              }}>{s.num}</span>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <h3 style={{
                  fontSize: 'clamp(1.2rem, 2.8vw, 2.6rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: '#080808',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  marginBottom: hovered === i ? '0.6rem' : 0,
                  transition: 'margin 0.35s cubic-bezier(0.32,0.72,0,1)',
                }}>
                  {s.name}
                </h3>

                <div style={{
                  overflow: 'hidden',
                  maxHeight: hovered === i ? '200px' : '0',
                  opacity: hovered === i ? 1 : 0,
                  transition: 'max-height 0.4s cubic-bezier(0.32,0.72,0,1), opacity 0.3s ease',
                }}>
                  <p style={{
                    fontSize: '0.88rem',
                    color: 'rgba(8,8,8,0.5)',
                    lineHeight: 1.65,
                    maxWidth: '560px',
                  }}>
                    {s.desc}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        ))}
        <div style={{ borderBottom: '1px solid rgba(8,8,8,0.12)' }} />
      </motion.div>
    </section>
  )
}
