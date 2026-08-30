import { useRef } from 'react'

/**
 * Liquid-glass button.
 *
 * variant:
 *   'dark'  (default) — frosted glass for placement on #141414 / dark imagery
 *   'light'           — frosted glass for placement on cream / white sections
 *   'solid'           — opaque white pill, the primary/highest-emphasis action
 *
 * The glass look is three stacked layers: a blurred+saturated backdrop, a
 * translucent tint, and a top-edge specular highlight that brightens on hover.
 * Browsers without backdrop-filter fall back to the tint alone, which still
 * reads as a normal translucent button.
 */

const VARIANTS = {
  dark: {
    color: '#ffffff',
    background: 'rgba(255,255,255,0.07)',
    borderColor: 'rgba(255,255,255,0.22)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 24px rgba(0,0,0,0.28)',
    hoverBackground: 'rgba(255,255,255,0.15)',
    hoverBorder: 'rgba(255,255,255,0.45)',
    highlight: 'linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 55%)',
  },
  light: {
    color: '#141414',
    background: 'rgba(20,20,20,0.05)',
    borderColor: 'rgba(20,20,20,0.16)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 8px 24px rgba(20,20,20,0.08)',
    hoverBackground: 'rgba(20,20,20,0.10)',
    hoverBorder: 'rgba(20,20,20,0.34)',
    highlight: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 55%)',
  },
  solid: {
    color: '#141414',
    background: 'rgba(255,255,255,0.94)',
    borderColor: 'rgba(255,255,255,0.9)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 8px 26px rgba(0,0,0,0.22)',
    hoverBackground: '#ffffff',
    hoverBorder: '#ffffff',
    highlight: 'linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 60%)',
  },
}

export function LiquidButton({
  children,
  href,
  target,
  rel,
  onClick,
  variant = 'dark',
  style = {},
  ...rest
}) {
  const Tag = href ? 'a' : 'button'
  const v = VARIANTS[variant] || VARIANTS.dark
  const ref = useRef(null)

  // Caller-supplied style wins, so existing per-usage overrides keep working.
  const base = {
    position: 'relative',
    isolation: 'isolate',
    overflow: 'hidden',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.85rem 2rem',
    borderRadius: '100px',
    cursor: 'pointer',
    textDecoration: 'none',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: v.color,
    background: v.background,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: v.borderColor,
    boxShadow: v.boxShadow,
    backdropFilter: 'blur(14px) saturate(180%)',
    WebkitBackdropFilter: 'blur(14px) saturate(180%)',
    transition: 'background 0.25s ease, border-color 0.25s ease, transform 0.2s ease, box-shadow 0.25s ease',
    ...style,
  }

  const restBackground = style.background || v.background
  const restBorder = style.borderColor || v.borderColor

  return (
    <Tag
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      style={base}
      onMouseEnter={e => {
        e.currentTarget.style.background = style.background || v.hoverBackground
        e.currentTarget.style.borderColor = v.hoverBorder
        e.currentTarget.style.transform = 'scale(1.03)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = restBackground
        e.currentTarget.style.borderColor = restBorder
        e.currentTarget.style.color = style.color || v.color
        e.currentTarget.style.transform = 'scale(1)'
      }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.03)' }}
      {...rest}
    >
      {/* Specular top edge — purely decorative, sits under the label */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, zIndex: -1,
          borderRadius: 'inherit', pointerEvents: 'none',
          background: v.highlight,
        }}
      />
      {children}
    </Tag>
  )
}
