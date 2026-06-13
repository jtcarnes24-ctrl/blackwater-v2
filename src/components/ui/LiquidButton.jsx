import { useRef } from 'react'

function GlassFilter() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <filter id="container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="1" result="turbulence" />
          <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
          <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  )
}

export function LiquidButton({ children, href, target, rel, onClick, style = {} }) {
  const Tag = href ? 'a' : 'button'

  return (
    <>
      <GlassFilter />
      <Tag
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.9rem 2rem',
          borderRadius: '100px',
          cursor: 'pointer',
          border: 'none',
          textDecoration: 'none',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.8rem',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#ffffff',
          background: 'transparent',
          boxShadow: '0 0 6px rgba(0,0,0,0.03), 0 2px 6px rgba(0,0,0,0.08), inset 3px 3px 0.5px -3px rgba(255,255,255,0.09), inset -3px -3px 0.5px -3px rgba(255,255,255,0.85), inset 1px 1px 1px -0.5px rgba(255,255,255,0.6), inset -1px -1px 1px -0.5px rgba(255,255,255,0.6), inset 0 0 6px 6px rgba(255,255,255,0.08), inset 0 0 2px 2px rgba(255,255,255,0.04), 0 0 12px rgba(0,0,0,0.15)',
          transition: 'transform 0.25s cubic-bezier(0.1,0.4,0.2,1), box-shadow 0.25s',
          overflow: 'hidden',
          ...style,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
        onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.04)' }}
      >
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '100px',
          backdropFilter: 'url("#container-glass") blur(0px)',
          zIndex: 0,
        }} />
        <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      </Tag>
    </>
  )
}
