import { Suspense, lazy, useEffect, useState } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

export function SplineScene({ scene, className }) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (isMobile) return null

  return (
    <Suspense fallback={
      <div className="w-full h-full flex items-center justify-center">
        <span className="loader" />
      </div>
    }>
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
