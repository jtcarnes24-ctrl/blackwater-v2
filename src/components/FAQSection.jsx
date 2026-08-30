import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'

const faqs = [
  {
    q: 'What does it cost?',
    a: "It depends on what you need. We scope to your goals, not a fixed package. Most partners are on a monthly retainer, and we'll give you exact numbers on the call. No hidden fees, and your ad spend always goes straight to the platforms, never through us.",
  },
  {
    q: 'What kind of businesses do you work with?',
    a: "Mostly e-commerce and DTC brands ready to actually scale, plus a few local businesses we believe in. If you've got a product people want and a budget to grow, that's who we're built for.",
  },
  {
    q: 'How do I get started?',
    a: "Book a quick call. We'll look at the whole business, not just the ad account, and tell you exactly what we'd do differently, and if it's a fit, we get to work. No pressure, no hard pitch.",
  },
]

function FAQRow({ item, isOpen, onToggle }) {
  return (
    <div style={{ borderTop: '1px solid rgba(20,20,20,0.12)' }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '1.5rem', padding: 'clamp(1.4rem, 3vw, 2rem) 0', textAlign: 'left',
        }}
      >
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(1.15rem, 2.4vw, 1.4rem)',
          fontWeight: 700, letterSpacing: '-0.01em',
          color: '#141414', lineHeight: 1.25,
        }}>
          {item.q}
        </span>
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0, width: '40px', height: '40px', borderRadius: '999px',
            border: '1px solid rgba(20,20,20,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#141414',
          }}
        >
          <motion.svg
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: easeInOut }}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </motion.svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: easeInOut }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(0.95rem, 1.6vw, 1.08rem)',
              color: 'rgba(20,20,20,0.65)', lineHeight: 1.75,
              maxWidth: '62ch', paddingBottom: 'clamp(1.4rem, 3vw, 2rem)',
            }}>
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FAQSection() {
  // -1, not 0: every answer starts closed, so the list reads as a list of
  // questions rather than opening on one the reader did not ask.
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      style={{
        background: '#ffffff',
        padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)',
      }}
    >
      <motion.div
        variants={staggerContainer(0.1, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        style={{ maxWidth: '60rem', margin: '0 auto' }}
      >
        {/* Eyebrow */}
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5, ease: easeOut }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.6rem', fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(20,20,20,0.55)', fontWeight: 600, marginBottom: '1.5rem',
          }}
        >
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#85929d', display: 'inline-block' }} />
          FAQs
        </motion.p>

        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          transition={{ duration: 0.6, ease: easeOut }}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(2.2rem, 6vw, 4.5rem)',
            fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.02,
            color: '#141414', textAlign: 'center', margin: 0,
          }}
        >
          Frequently Asked <span className="emph">Questions</span><span style={{ color: '#85929d' }}>.</span>
        </motion.h2>

        {/* Subline */}
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.05 }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: 'rgba(20,20,20,0.65)', lineHeight: 1.6, textAlign: 'center',
            maxWidth: '48ch', margin: '1.5rem auto 0',
          }}
        >
          Everything you need to know before we talk. Still have a question? Book a call and ask us directly.
        </motion.p>

        {/* Accordion */}
        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.6, ease: easeOut, delay: 0.1 }}
          style={{ marginTop: 'clamp(3rem, 6vw, 5rem)', borderBottom: '1px solid rgba(20,20,20,0.12)' }}
        >
          {faqs.map((item, i) => (
            <FAQRow
              key={item.q}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
