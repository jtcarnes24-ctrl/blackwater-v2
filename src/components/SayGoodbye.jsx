import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * "Say goodbye to..." vertical phrase rotator (orza-style).
 * The list steps up one line every tick; the centered line is highlighted
 * (lime→green gradient), neighbours fade out via a top/bottom mask. Loops
 * seamlessly using a duplicated head and an instant, non-animated reset.
 */

const PHRASES = [
  'wasted ad spend',
  'guessing on your ads',
  'creative that flops',
  'agencies that ghost you',
  'climbing cost per sale',
  'dead ad accounts',
]

export function SayGoodbye() {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [instant, setInstant] = useState(false)
  const [visible, setVisible] = useState(false)
  const [rootEl, setRootEl] = useState(null)

  // only tick while the section is actually on screen (saves battery/CPU)
  useEffect(() => {
    if (!rootEl) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 })
    io.observe(rootEl)
    return () => io.disconnect()
  }, [rootEl])

  useEffect(() => {
    if (reduce || !visible) return
    const t = setInterval(() => { setInstant(false); setI(p => p + 1) }, 1900)
    return () => clearInterval(t)
  }, [reduce, visible])

  // seamless loop: once we've stepped past the last phrase, snap back with no anim
  useEffect(() => {
    if (i === PHRASES.length) {
      const t = setTimeout(() => { setInstant(true); setI(0) }, 640)
      return () => clearTimeout(t)
    }
  }, [i])

  const items = reduce ? PHRASES : [...PHRASES, ...PHRASES.slice(0, 2)]

  return (
    <section ref={setRootEl} style={{ background: '#ffffff', padding: 'clamp(4rem, 10vw, 8rem) clamp(1.5rem, 8vw, 7rem)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'clamp(0.5rem, 3vw, 2.5rem)', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 'clamp(1.9rem, 4.5vw, 3.4rem)', letterSpacing: '-0.02em', color: '#080808', margin: 0, whiteSpace: 'nowrap' }}>
          Say goodbye to<span style={{ color: '#C8D746' }}>...</span>
        </h2>

        <div style={{
          '--row': 'clamp(2.6rem, 7vw, 4.2rem)',
          height: 'calc(3 * var(--row))',
          overflow: 'hidden',
          flex: '1 1 320px', minWidth: '260px',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 24%, #000 76%, transparent)',
          maskImage: 'linear-gradient(to bottom, transparent, #000 24%, #000 76%, transparent)',
        }}>
          <div style={{
            transform: `translateY(calc(${-i} * var(--row)))`,
            transition: instant ? 'none' : 'transform 0.6s cubic-bezier(0.76, 0, 0.24, 1)',
            paddingTop: 'var(--row)',
          }}>
            {items.map((p, k) => {
              const active = reduce ? k === 0 : k === i
              return (
                <div key={k} style={{
                  height: 'var(--row)', display: 'flex', alignItems: 'center',
                  fontFamily: "'Syne', sans-serif", fontWeight: 700,
                  fontSize: 'calc(var(--row) * 0.6)', letterSpacing: '-0.02em', lineHeight: 1,
                  whiteSpace: 'nowrap',
                  ...(active
                    ? { backgroundImage: 'linear-gradient(90deg, #C8D746, #2f8f5f)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }
                    : { color: 'rgba(8,8,8,0.22)' }),
                }}>
                  {p}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
