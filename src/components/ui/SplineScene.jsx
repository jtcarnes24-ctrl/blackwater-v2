import { Suspense, lazy, useEffect, useState } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

export function SplineScene({ scene, className }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [activated, setActivated] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (isMobile) return null

  if (!activated) {
    return (
      <div
        style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(255,255,255,0.02)',
          cursor: 'pointer', gap: '1rem',
        }}
        onClick={() => setActivated(true)}
      >
        {/* Subtle animated rings hint */}
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.12)',
            animation: 'pulse-ring 2s ease-out infinite',
          }} />
          <div style={{
            position: 'absolute', inset: '12px', borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.18)',
            animation: 'pulse-ring 2s ease-out infinite 0.4s',
          }} />
          <div style={{
            position: 'absolute', inset: '24px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </div>
        <p style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
          Load 3D
        </p>
        <style>{`
          @keyframes pulse-ring {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(1.4); opacity: 0; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <Suspense fallback={
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="loader" />
      </div>
    }>
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
