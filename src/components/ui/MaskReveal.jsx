import { useRef, useEffect } from 'react'

export function MaskReveal({ colorSrc, bwSrc, height = '560px' }) {
  const containerRef = useRef(null)
  const topRef = useRef(null)
  const posRef = useRef({ x: 50, y: 50 })
  const smoothRef = useRef({ x: 50, y: 50 })
  const activeRef = useRef(false)
  const rafRef = useRef(null)

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t

    const tick = () => {
      smoothRef.current.x = lerp(smoothRef.current.x, posRef.current.x, 0.09)
      smoothRef.current.y = lerp(smoothRef.current.y, posRef.current.y, 0.09)

      if (topRef.current) {
        const { x, y } = smoothRef.current
        const size = activeRef.current ? '34%' : '0%'
        const mask = `radial-gradient(circle ${size} at ${x}% ${y}%, transparent 20%, black 70%)`
        topRef.current.style.maskImage = mask
        topRef.current.style.webkitMaskImage = mask
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const onMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect()
    posRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    }
    activeRef.current = true
  }

  const onMouseLeave = () => {
    activeRef.current = false
  }

  const imgStyle = {
    height,
    width: 'auto',
    maxWidth: '100%',
    objectFit: 'contain',
    objectPosition: 'top center',
    display: 'block',
    mixBlendMode: 'multiply',
    userSelect: 'none',
    pointerEvents: 'none',
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'crosshair',
        flexShrink: 0,
      }}
    >
      {/* B&W hat photo — bottom layer, always visible */}
      <img src={bwSrc} alt="Jack Carnes" style={imgStyle} />

      {/* Color photo — top layer, masked by cursor */}
      <img
        ref={topRef}
        src={colorSrc}
        alt=""
        aria-hidden="true"
        style={{
          ...imgStyle,
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          objectFit: 'contain',
          maskImage: 'radial-gradient(circle 0% at 50% 50%, transparent 20%, black 70%)',
          WebkitMaskImage: 'radial-gradient(circle 0% at 50% 50%, transparent 20%, black 70%)',
        }}
      />
    </div>
  )
}
