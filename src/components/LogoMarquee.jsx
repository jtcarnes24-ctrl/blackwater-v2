// Display height is fixed at 40px; width below is each logo's real aspect
// ratio at that height (computed from the processed 160px-tall source PNGs
// in public/client-logos/), so the browser can reserve layout space and
// avoid any shift while the images load.
const logos = [
  { src: '/client-logos/logo-1.png', width: 53, height: 40 },
  { src: '/client-logos/logo-2.png', width: 40, height: 40 },
  { src: '/client-logos/logo-3.png', width: 41, height: 40 },
  { src: '/client-logos/logo-4.png', width: 74, height: 40 },
  { src: '/client-logos/logo-5.png', width: 57, height: 40 },
  { src: '/client-logos/logo-6.png', width: 64, height: 40 },
  { src: '/client-logos/logo-7.png', width: 170, height: 40 },
  { src: '/client-logos/logo-8.png', width: 32, height: 40 },
]

const repeated = [...logos, ...logos, ...logos]

export function LogoMarquee() {
  return (
    <div style={{
      background: '#ffffff',
      borderTop: '1px solid rgba(8,8,8,0.08)',
      borderBottom: '1px solid rgba(8,8,8,0.08)',
      padding: '2rem 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex',
        gap: '4.5rem',
        width: 'max-content',
        animation: 'logo-marquee-scroll 48s linear infinite',
        willChange: 'transform',
      }}>
        {repeated.map((logo, i) => (
          <img
            key={i}
            src={logo.src}
            alt=""
            aria-hidden="true"
            width={logo.width}
            height={logo.height}
            decoding="async"
            draggable={false}
            style={{
              height: '40px',
              width: 'auto',
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}
