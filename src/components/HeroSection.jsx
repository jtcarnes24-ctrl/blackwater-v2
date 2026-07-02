import { useRef, useEffect } from 'react'
import { LiquidButton } from './ui/LiquidButton'

export function HeroSection() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const progress = Math.min(window.scrollY / (window.innerHeight * 0.8), 1)
      el.style.setProperty('--scroll-y', `${progress * -120}px`)
      el.style.setProperty('--scroll-o', `${Math.max(0, 1 - progress * 1.6)}`)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={ref} style={{
      position: 'relative', minHeight: '100dvh', display: 'flex',
      flexDirection: 'column', overflow: 'hidden', background: '#080808',
      contain: 'layout style',
    }}>
      <style>{`
        @keyframes float-outer {
          0%,100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          25%     { transform: translate(-50%, -50%) translate(40px, -30px); }
          50%     { transform: translate(-50%, -50%) translate(-30px, 40px); }
          75%     { transform: translate(-50%, -50%) translate(25px, 35px); }
        }
        @keyframes float-inner {
          0%,100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          25%     { transform: translate(-50%, -50%) translate(-35px, 30px); }
          50%     { transform: translate(-50%, -50%) translate(30px, -35px); }
          75%     { transform: translate(-50%, -50%) translate(-20px, -25px); }
        }
        .circle-outer { animation: float-outer 10s ease-in-out infinite; }
        .circle-inner { animation: float-inner 7s ease-in-out infinite; }

        @keyframes hero-line { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes hero-bar  { from { opacity:0; transform:scaleX(0); } to { opacity:1; transform:scaleX(1); } }
        @keyframes hero-fade { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        .hero-content {
          transform: translateY(var(--scroll-y, 0px));
          opacity: var(--scroll-o, 1);
          will-change: transform, opacity;
        }
        .hero-eyebrow { animation: hero-fade 0.6s ease 0.05s both; }
        .hero-bar     { animation: hero-bar  0.6s cubic-bezier(0.76,0,0.24,1) 0.15s both; transform-origin: left; }
        .hero-h1      { animation: hero-line 0.85s cubic-bezier(0.76,0,0.24,1) 0.25s both; }
        .hero-tagline { animation: hero-fade 0.7s ease 0.4s both; }
        .hero-btns    { animation: hero-fade 0.6s ease 0.5s both; }
        .hero-desc    { animation: hero-fade 0.8s ease 0.6s both; }

        .hero-desc-mobile  { display: none; }
        .hero-desc-desktop { display: block; }
        @media (max-width: 768px) {
          .hero-desc-mobile  { display: block; }
          .hero-desc-desktop { display: none; }
        }
      `}</style>

      {/* Floating circles */}
      <div className="circle-outer" style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '82vw', height: '82vw',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 1,
      }} />
      <div className="circle-inner" style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '58vw', height: '58vw',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: '50%', pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Hero content */}
      <div className="hero-content" style={{
        position: 'relative', zIndex: 10,
        padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vw, 5rem)',
        flex: 1, display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', flexDirection: 'row',
      }}>
        {/* Top-left */}
        <div style={{ textAlign: 'left', maxWidth: '50vw' }}>
          <p className="hero-eyebrow" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '0.72rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#C8D746',
            fontWeight: 600, marginBottom: '1rem',
          }}>
            The AI-Powered Ads Agency
          </p>
          <div className="hero-bar" style={{
            width: '28px', height: '2px', background: '#C8D746', marginBottom: '1rem',
          }} />
          <div style={{ overflow: 'hidden', marginBottom: '2.5rem' }}>
            <h1 className="hero-h1" style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 5.5rem)',
              fontWeight: 700, lineHeight: 0.92,
              letterSpacing: '-0.03em', color: '#f2ede4',
              textTransform: 'uppercase', margin: 0,
            }}>
              BLACKWATER<br />MARKETING
            </h1>
          </div>
          <p className="hero-tagline" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1rem, 1.8vw, 1.35rem)',
            fontWeight: 500, color: '#f2ede4',
            lineHeight: 1.5, maxWidth: '32ch',
            marginBottom: '2rem',
          }}>
            Meta &amp; TikTok campaigns run by AI systems that test more creatives, kill losers faster, and scale winners around the clock.
          </p>
          <div className="hero-btns" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <LiquidButton href="https://calendly.com/blkwtrenterprises/45" target="_blank" rel="noopener noreferrer">
              Book a Call →
            </LiquidButton>
            <LiquidButton href="#services">Our Services</LiquidButton>
          </div>
          <p className="hero-desc hero-desc-mobile" style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(0.8rem, 1.1vw, 0.95rem)',
            fontWeight: 400, color: 'rgba(242,237,228,0.7)',
            lineHeight: 1.7, maxWidth: '320px',
            marginTop: '1.5rem',
          }}>
            A performance-driven system for brands ready to scale. From first ad to consistent revenue. No luck. Just strategy.
          </p>
        </div>

        {/* Bottom-right descriptor (desktop only) */}
        <p className="hero-desc hero-desc-desktop" style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(0.75rem, 1.1vw, 0.95rem)',
          fontWeight: 400, color: 'rgba(242,237,228,0.7)',
          lineHeight: 1.7, maxWidth: '220px',
          textAlign: 'right', alignSelf: 'flex-end', marginBottom: '4rem',
        }}>
          A performance-driven system for brands ready to scale. From first ad to consistent revenue. No luck. Just strategy.
        </p>
      </div>
    </section>
  )
}
