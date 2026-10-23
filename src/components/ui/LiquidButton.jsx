import { useRef } from 'react'

/**
 * Liquid-glass button.
 *
 * variant:
 *   'dark'  (default) — white pill, for placement on dark sections or imagery
 *   'light'           — near-black pill, for placement on white sections
 *   'solid'           — white pill, the primary/highest-emphasis action
 *
 * One flat fill per variant. The frosted-glass treatment it used to carry
 * (backdrop blur, translucent tint, inset top edge and drop shadow) is gone.
 */

const VARIANTS = {
  dark:  { color: '#080808', background: '#ffffff', borderColor: '#ffffff',
           hoverBackground: '#dadedf', hoverBorder: '#dadedf' },
  light: { color: '#ffffff', background: '#141414', borderColor: '#141414',
           hoverBackground: '#080808', hoverBorder: '#080808' },
  solid: { color: '#080808', background: '#ffffff', borderColor: '#ffffff',
           hoverBackground: '#dadedf', hoverBorder: '#dadedf' },
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
    transition: 'background 0.25s ease, border-color 0.25s ease, transform 0.2s ease',
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
      {children}
    </Tag>
  )
}
