export function LiquidButton({ children, href, target, rel, onClick, style = {} }) {
  const Tag = href ? 'a' : 'button'

  const base = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '0.85rem 2rem',
    borderRadius: '100px',
    cursor: 'pointer',
    border: '1px solid rgba(242,237,228,0.35)',
    textDecoration: 'none',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#f2ede4',
    background: 'transparent',
    transition: 'border-color 0.2s, background 0.2s, transform 0.2s',
    ...style,
  }

  return (
    <Tag
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      style={base}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(242,237,228,0.08)'
        e.currentTarget.style.borderColor = 'rgba(242,237,228,0.65)'
        e.currentTarget.style.transform = 'scale(1.03)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = style.background || 'transparent'
        e.currentTarget.style.borderColor = style.borderColor || 'rgba(242,237,228,0.35)'
        e.currentTarget.style.color = style.color || '#f2ede4'
        e.currentTarget.style.transform = 'scale(1)'
      }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1.03)' }}
    >
      {children}
    </Tag>
  )
}
