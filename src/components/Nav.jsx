import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOGO = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAQ5lWElmTU0AKgAAAAgABwESAAMAAAABAAEAAAEaAAUAAAABAAAAYgEbAAUAAAABAAAAagEoAAMAAAABAAIAAAExAAIAAABBAAAAcgE7AAIAAAAMAAAAtIdpAAQAAAABAAAAwAAAAAAAAAEsAAAAAQAAASwAAAABQ2FudmEgZG9jPURBSERGMmgwQzRFIHVzZXI9VUFFcTdpX1ZYLUUgYnJhbmQ9QW5keSBCcmFuZHQncyBDbGFzcwAASmFjayBDYXJuZXMAAAaQAAAHAAAABDAyMTCRAQAHAAAABAECAwCgAAAHAAAABDAxMDCgAQADAAAAAQABAACgAgAEAAAAAQAAAFCgAwAEAAAAAQAAAFAAAAAAeBMAgQAAAAlwSFlzAAAuIwAALiMBeKU/dgAABkVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDYuMC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+NjU1MzU8L2V4aWY6Q29sb3JTcGFjZT4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjYyNTA8L2V4aWY6UGl4ZWxYRGltZW5zaW9uPgogICAgICAgICA8ZXhpZjpFeGlmVmVyc2lvbj4wMjEwPC9leGlmOkV4aWZWZXJzaW9uPgogICAgICAgICA8ZXhpZjpGbGFzaFBpeFZlcnNpb24+MDEwMDwvZXhpZjpGbGFzaFBpeFZlcnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj42MjUwPC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29tcG9uZW50c0NvbmZpZ3VyYXRpb24+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpPjE8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaT4yPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGk+MzwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpPjA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L2V4aWY6Q29tcG9uZW50c0NvbmZpZ3VyYXRpb24+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+Q2FudmEgZG9jPURBSERGMmgwQzRFIHVzZXI9VUFFcTdpX1ZYLUUgYnJhbmQ9QW5keSBCcmFuZHQncyBDbGFzczwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj4zMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjMwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGRjOnRpdGxlPgogICAgICAgICAgICA8cmRmOkFsdD4KICAgICAgICAgICAgICAgPHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5VbnRpdGxlZCBkZXNpZ24gLSAxPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOkFsdD4KICAgICAgICAgPC9kYzp0aXRsZT4KICAgICAgICAgPGRjOmNyZWF0b3I+CiAg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`

const navLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'The Method', href: '#method' },
  { label: 'Our Services', href: '#services' },
  { label: 'Talk to Us', href: 'https://calendly.com/blkwtrenterprises/30min', external: true },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleNavClick = (href, external) => {
    setOpen(false)
    if (!external) {
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem clamp(1.5rem, 5vw, 4rem)',
        background: scrolled ? 'rgba(255,255,255,0.12)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.18)' : '1px solid transparent',
        transition: 'background 0.5s cubic-bezier(0.32,0.72,0,1), border-color 0.5s cubic-bezier(0.32,0.72,0,1)',
      }}>
        <a href="#" aria-label="BlackWater Marketing" style={{ display: 'flex', alignItems: 'center' }}>
          <img src={LOGO} alt="BlackWater Marketing" style={{ height: '64px', width: '64px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </a>

        <button
          onClick={() => setOpen(o => !o)}
          aria-label="Menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 101, position: 'relative' }}
        >
          <motion.span animate={open ? { width: 26, rotate: 45, y: 9 } : { width: 28, rotate: 0, y: 0 }}
            style={{ display: 'block', height: '1.5px', background: '#fff', transformOrigin: 'center', transition: 'all 0.3s ease' }} />
          <motion.span animate={open ? { width: 26, rotate: -45, y: -3 } : { width: 20, rotate: 0, y: 0 }}
            style={{ display: 'block', height: '1.5px', background: '#fff', transformOrigin: 'center', transition: 'all 0.3s ease' }} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 99,
              background: '#080808',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'center',
              padding: 'clamp(2rem, 8vw, 6rem)',
            }}
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.external ? link.href : undefined}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  onClick={() => handleNavClick(link.href, link.external)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
                  style={{
                    fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 700,
                    letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.35)',
                    textDecoration: 'none', lineHeight: 1.1,
                    cursor: 'pointer', textTransform: 'uppercase',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.color = '#ffffff'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.5 }}
              style={{ marginTop: '3rem', fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff' }}
            >
              BlackWater Marketing © 2025
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
