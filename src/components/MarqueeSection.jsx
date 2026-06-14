const items = [
  'META ADS', 'TIKTOK ADS', 'FUNNEL CREATION', 'AD CREATIVE',
  'EMAIL & SMS', 'B2B MARKETING', 'CONVERSION OPTIMIZATION', 'WEB DESIGN',
]

const repeated = [...items, ...items, ...items]

export function MarqueeSection() {
  return (
    <div style={{
      background: '#f2ede4',
      borderTop: '1px solid rgba(8,8,8,0.08)',
      borderBottom: '1px solid rgba(8,8,8,0.08)',
      padding: '1.5rem 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex',
        gap: '3rem',
        width: 'max-content',
        animation: 'marquee-scroll 28s linear infinite',
        willChange: 'transform',
      }}>
        {repeated.map((item, i) => (
          <span key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3rem',
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#080808',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {item}
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(8,8,8,0.3)', display: 'inline-block', flexShrink: 0 }} />
          </span>
        ))}
      </div>
    </div>
  )
}
