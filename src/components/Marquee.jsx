export function Marquee({ text = 'DRIVEN BY THE METHOD', reverse = false }) {
  const items = Array(8).fill(text);
  return (
    <div className="top-marquee" style={{
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,255,255,0.12)',
      borderBottom: '1px solid rgba(255,255,255,0.12)',
      padding: '1rem 0',
      background: '#080808',
      position: 'relative',
      zIndex: 1,
    }}>
      <div className="marquee-track" style={{ animationDirection: reverse ? 'reverse' : 'normal' }}>
        {items.map((t, i) => (
          <span key={i} className="marquee-text">{t}<span style={{ padding: '0 2.5rem', opacity: 0.6 }}>■</span></span>
        ))}
        {items.map((t, i) => (
          <span key={`b${i}`} className="marquee-text">{t}<span style={{ padding: '0 2.5rem', opacity: 0.6 }}>■</span></span>
        ))}
      </div>
    </div>
  );
}
