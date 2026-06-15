import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'
import { LiquidButton } from './ui/LiquidButton'
import { MaskReveal } from './ui/MaskReveal'
import { Waves } from './ui/Waves'

const jackItems = Array(10).fill('JACK CARNES').join(' · ')
const bwItems = Array(6).fill('BLACKWATER MARKETING').join(' · ')
const repeated = (str) => [str, str, str].join('    ')

const PARAS = [
  `I started out running my own fitness brand — selling to weightlifters, figuring it out as I went. Pretty quickly I realized the product wasn't the hard part. Getting it in front of the right people was. That's when I went deep on ads. Not as a side skill — as the whole thing. Once you understand how paid traffic actually works, you start seeing it everywhere. Every successful brand you admire has a machine running behind it. I wanted to build that machine.`,
  `BlackWater started as a system before it was an agency. I spent a long time studying what the best-performing brands were doing differently — not just their ads, but the whole machine behind them. The creative strategy, the funnel structure, the way they scaled without blowing their numbers. I built The Method from that. Every client we take on runs through it.`,
  `I don't take on clients I can't actually help. That sounds obvious, but it's rarer than you'd think in this industry. When we work together, you're not getting handed off to an account manager two weeks in. You get me — on the account, watching the numbers, adjusting when something needs to move. The brands I work with tend to stay because the results keep coming.`,
]

export function FounderSection() {
  const scrollContainer = useRef(null)
  const { scrollYProgress } = useScroll({
    target: scrollContainer,
    offset: ['start start', 'end end'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.75], [1, 4])
  const maskOpacity = useTransform(scrollYProgress, [0.55, 0.75], [1, 0])

  return (
    <section id="founder" style={{ background: '#f2ede4', borderTop: '1px solid rgba(8,8,8,0.06)' }}>

      {/* Scroll zoom container — 300vh sticky */}
      <div ref={scrollContainer} style={{ position: 'relative', height: '300vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          {/* Waves background */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.3, pointerEvents: 'none' }}>
            <Waves strokeColor="rgba(8,8,8,0.6)" backgroundColor="transparent" pointerSize={0} />
          </div>

          {/* Marquee text — behind photo */}
          <div style={{
            position: 'absolute', top: '50%', left: 0, right: 0,
            transform: 'translateY(-50%)',
            display: 'flex', flexDirection: 'column', gap: '0.1em',
            zIndex: 5,
          }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                display: 'flex', whiteSpace: 'nowrap',
                animation: 'marquee-scroll 18s linear infinite',
                willChange: 'transform',
              }}>
                {[repeated(jackItems), repeated(jackItems), repeated(jackItems)].map((text, i) => (
                  <span key={i} style={{
                    fontSize: 'clamp(3.5rem, 8.5vw, 9.5rem)', fontWeight: 700,
                    letterSpacing: '-0.03em', textTransform: 'uppercase',
                    color: 'rgba(8,8,8,0.18)', lineHeight: 1, paddingRight: '2rem', flexShrink: 0,
                  }}>{text}</span>
                ))}
              </div>
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                display: 'flex', whiteSpace: 'nowrap',
                animation: 'marquee-scroll-right 22s linear infinite',
                willChange: 'transform',
              }}>
                {[repeated(bwItems), repeated(bwItems), repeated(bwItems)].map((text, i) => (
                  <span key={i} style={{
                    fontSize: 'clamp(3.5rem, 8.5vw, 9.5rem)', fontWeight: 700,
                    letterSpacing: '-0.03em', textTransform: 'uppercase',
                    color: '#080808', lineHeight: 1, paddingRight: '2rem', flexShrink: 0,
                  }}>{text}</span>
                ))}
              </div>
            </div>
          </div>

          {/* MaskReveal — zooms on scroll */}
          <motion.div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            translateX: '-50%',
            zIndex: 15,
            width: 'min(760px, 100vw)',
            scale,
            transformOrigin: 'bottom center',
            WebkitMaskImage: 'linear-gradient(to bottom, black 62%, transparent 76%)',
            maskImage: 'linear-gradient(to bottom, black 62%, transparent 76%)',
            opacity: maskOpacity,
          }}>
            <MaskReveal
              colorSrc="/jack-color.png"
              bwSrc="/jack-bw.png"
              size={760}
            />
          </motion.div>

        </div>
      </div>

      {/* Bio — after scroll zoom completes */}
      <div style={{ padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 8vw, 7rem)' }}>
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
              color: 'rgba(8,8,8,0.4)', fontWeight: 600, marginBottom: '0.75rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
            }}
          >
            <span style={{ display: 'block', width: '20px', height: '1px', background: 'rgba(8,8,8,0.2)' }} />
            Founder — BlackWater Marketing
          </motion.p>

          <div style={{ display: 'flex', gap: 'clamp(2rem, 6vw, 8rem)', flexWrap: 'wrap', alignItems: 'flex-start', marginTop: '2rem' }}>

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
                      color: '#080808', textTransform: 'uppercase', margin: 0,
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
                    color: 'rgba(8,8,8,0.62)',
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
                  style={{ background: '#080808', color: '#f2ede4' }}
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
