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
      smoothRef.current.x = lerp(smoothRef.current.x, posRef.current.x, 0.1)
      smoothRef.current.y = lerp(smoothRef.current.y, posRef.current.y, 0.1)

      if (topRef.current) {
        if (activeRef.current) {
          const { x, y } = smoothRef.current
          // Transparent hole at cursor → reveals B&W below, black = color photo visible
          const mask = `radial-gradient(circle 30% at ${x}% ${y}%, transparent 0%, transparent 25%, black 60%)`
          topRef.current.style.maskImage = mask
          topRef.current.style.webkitMaskImage = mask
        } else {
          // No mask = color photo fully visible
          topRef.current.style.maskImage = 'none'
          topRef.current.style.webkitMaskImage = 'none'
        }
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
    if (!activeRef.current) activeRef.current = true
  }

  const onMouseLeave = () => {
    activeRef.current = false
  }

  const baseStyle = {
    height,
    width: 'auto',
    maxWidth: '100%',
    objectFit: 'contain',
    objectPosition: 'top center',
    display: 'block',
    userSelect: 'none',
    draggable: false,
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: 'none',
        flexShrink: 0,
      }}
    >
      {/* B&W hat — bottom, always visible */}
      <img
        src={bwSrc}
        alt="Jack Carnes"
        style={{ ...baseStyle, pointerEvents: 'none' }}
      />

      {/* Color — top layer, mask cuts hole at cursor to reveal B&W */}
      <img
        ref={topRef}
        src={colorSrc}
        alt=""
        aria-hidden="true"
        style={{
          ...baseStyle,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          maskImage: 'none',
          WebkitMaskImage: 'none',
        }}
      />
    </div>
  )
}
