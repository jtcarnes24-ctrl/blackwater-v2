import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Waves } from './ui/Waves'
import { LiquidButton } from './ui/LiquidButton'
import { fadeUp, fadeIn, clipReveal, staggerContainer, easeOut, easeInOut } from '../lib/animations'

export function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -120])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section ref={ref} style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <Waves strokeColor="rgba(255,255,255,0.13)" backgroundColor="#080808" />

      <motion.div
        style={{ y, opacity, position: 'relative', zIndex: 10, padding: '0 clamp(1.5rem, 8vw, 7rem)', width: '100%' }}
      >
        {/* Eyebrow */}
        <motion.div
          variants={staggerContainer(0.15, 0.1)}
          initial="hidden"
          animate="show"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: easeOut }}
            style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '1.25rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <motion.span
              variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }}
              transition={{ duration: 0.5, ease: easeOut }}
              style={{ display: 'block', width: '32px', height: '1px', background: 'rgba(255,255,255,0.4)', flexShrink: 0, transformOrigin: 'left' }}
            />
            Proven Systems Designed For Conversions
          </motion.p>

          {/* Headline — each line clips up */}
          <div style={{ overflow: 'hidden', marginBottom: '0.05em' }}>
            <motion.h1
              variants={clipReveal}
              transition={{ duration: 0.85, ease: easeInOut }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(3rem, 9.5vw, 10.5rem)',
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              BLACKWATER
            </motion.h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: '1.75rem' }}>
            <motion.h1
              variants={clipReveal}
              transition={{ duration: 0.85, ease: easeInOut, delay: 0.08 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(3rem, 9.5vw, 10.5rem)',
                fontWeight: 700,
                lineHeight: 0.9,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              MARKETING
            </motion.h1>
          </div>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, ease: easeOut }}
            style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', maxWidth: '420px', marginBottom: '2rem', lineHeight: 1.65 }}
          >
            We build paid social systems that scale. Meta Ads engineered for results — not vanity metrics.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: easeOut }}
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <LiquidButton href="https://calendly.com/blkwtrenterprises/30min" target="_blank" rel="noopener noreferrer">
              Book a Call
            </LiquidButton>
            <LiquidButton href="#services">
              Our Services
            </LiquidButton>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '1px', height: '50px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)', margin: '0 auto' }}
        />
      </motion.div>
    </section>
  )
}
