import { useRef, useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'
import { LiquidButton } from './ui/LiquidButton'

const PARAS = [
  `I started out running my own fitness brand, selling to weightlifters, figuring it out as I went. Pretty quickly I realized the product wasn't the hard part. Getting it in front of the right people was. That's when I went deep on ads. Not as a side skill, as the whole thing. Once you understand how paid traffic actually works, you start seeing it everywhere. Every successful brand you admire has a machine running behind it. I wanted to build that machine.`,
  `BlackWater started as a system before it was an agency. I spent a long time studying what the best-performing brands were doing differently, not just their ads, but the whole machine behind them. The creative strategy, the funnel structure, the way they scaled without blowing their numbers. I built The Method from that. Every client we take on runs through it.`,
  `I don't take on clients I can't actually help. That sounds obvious, but it's rarer than you'd think in this industry. When we work together, you're not getting handed off to an account manager two weeks in. You get me, on the account, watching the numbers, adjusting when something needs to move. The brands I work with tend to stay because the results keep coming.`,
]

function BlurLetter({ char, delay }) {
  return (
    <motion.span
      initial={{ opacity: 0, filter: 'blur(12px)', y: -18 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay }}
      style={{ display: 'inline-block' }}
    >
      {char}
    </motion.span>
  )
}

function BlurWord({ text, startDelay = 0, letterDelay = 0.045, style, className }) {
  return (
    <span className={className} style={{ display: 'inline-block', ...style }}>
      {text.split('').map((ch, i) => (
        <BlurLetter key={i} char={ch} delay={startDelay + i * letterDelay} />
      ))}
    </span>
  )
}

export function FounderSection() {
  return (
    <section id="founder" style={{ background: '#080808', borderTop: '1px solid rgba(242,237,228,0.06)' }}>

      {/* ── Name + Photo hero ── */}
      <div style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '8rem 1rem',
      }}>

        {/* Text stack — full viewport width, photo nested inside so absolute % is relative to text height */}
        <div style={{ width: '100%', textAlign: 'center', position: 'relative', userSelect: 'none' }}>

          {/* JACK */}
          <div style={{ lineHeight: 0.85 }}>
            <BlurWord
              text="JACK"
              startDelay={0.1}
              style={{
                fontSize: '22vw',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                color: '#C8D746',
                textTransform: 'uppercase',
                display: 'block',
              }}
            />
          </div>

          {/* CARNES */}
          <div style={{ lineHeight: 0.85 }}>
            <BlurWord
              text="CARNES"
              startDelay={0.28}
              style={{
                fontSize: '22vw',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                color: '#C8D746',
                textTransform: 'uppercase',
                display: 'block',
              }}
            />
          </div>

          {/* Photo — inside text div, so top:50% = midpoint between the two lines */}
          <style>{`.founder-photo { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1); } .founder-photo:hover { transform: scale(1.1); }`}</style>
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 }}
            style={{
              position: 'absolute',
              top: '37%',
              left: '43%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            <img
              src="/jack-founder.png"
              alt="Jack Carnes"
              className="founder-photo"
              style={{
                width: 'clamp(130px, 16vw, 250px)',
                height: 'clamp(220px, 27vw, 420px)',
                objectFit: 'cover',
                objectPosition: 'top center',
                borderRadius: '999px',
                display: 'block',
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* ── Bio ── */}
      <div style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 8vw, 7rem)', borderTop: '1px solid rgba(242,237,228,0.06)' }}>
        <motion.div
          variants={staggerContainer(0.12, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5, ease: easeOut }}
            style={{
              fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#C8D746', fontWeight: 600, marginBottom: '0.75rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}
          >
            <span style={{ display: 'block', width: '20px', height: '1px', background: '#C8D746' }} />
            Founder, BlackWater Marketing
          </motion.p>

          <div style={{ display: 'flex', gap: 'clamp(1.5rem, 6vw, 8rem)', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: '2rem' }}>

            <div style={{ flexShrink: 0 }}>
              {['JACK', 'CARNES'].map((line, i) => (
                <div key={line} style={{ overflow: 'hidden' }}>
                  <motion.h2
                    initial={{ clipPath: 'inset(0 0 100% 0)' }}
                    whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                    transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.07 }}
                    viewport={viewport}
                    style={{
                      fontSize: 'clamp(2.8rem, 5.5vw, 6rem)', fontWeight: 700,
                      letterSpacing: '-0.03em', lineHeight: 0.92,
                      color: '#f2ede4', textTransform: 'uppercase', margin: 0,
                    }}
                  >{line}</motion.h2>
                </div>
              ))}
            </div>

            <div style={{ flex: 1, minWidth: '280px', maxWidth: '62ch' }}>
              {PARAS.map((para, i) => (
                <motion.p
                  key={i}
                  variants={fadeUp}
                  transition={{ duration: 0.6, ease: easeOut }}
                  style={{
                    fontSize: 'clamp(0.92rem, 1.5vw, 1.08rem)',
                    color: 'rgba(242,237,228,0.55)',
                    lineHeight: 1.78,
                    marginTop: i === 0 ? 0 : '1.2rem',
                  }}
                >{para}</motion.p>
              ))}

              <motion.div
                variants={fadeUp}
                transition={{ duration: 0.5, ease: easeOut }}
                style={{ marginTop: '2.5rem' }}
              >
                <LiquidButton
                  href="https://calendly.com/blkwtrenterprises/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: '#f2ede4', color: '#080808' }}
                >
                  Book a Call →
                </LiquidButton>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
