import { useRef, useEffect } from 'react'

export function MaskReveal({ colorSrc, bwSrc, size = 560 }) {
  const canvasRef = useRef(null)
  const posRef = useRef({ x: size / 2, y: size / 2 })
  const smoothRef = useRef({ x: size / 2, y: size / 2 })
  const activeRef = useRef(false)
  const radiusRef = useRef(0)
  const trailRef = useRef([])
  const timeRef = useRef(0)
  const imagesRef = useRef({ color: null, bw: null })
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = size
    canvas.height = size

    let loaded = 0
    const onLoad = () => { loaded++; if (loaded === 2) startLoop() }

    const colorImg = new window.Image()
    const bwImg = new window.Image()
    colorImg.onload = onLoad
    bwImg.onload = onLoad
    colorImg.src = colorSrc
    bwImg.src = bwSrc
    imagesRef.current = { color: colorImg, bw: bwImg }

    const lerp = (a, b, t) => a + (b - a) * t
    const MAX_RADIUS = size * 0.13
    const TRAIL_MAX_AGE = 120

    const drawLiquidPath = (cx, cy, r, t) => {
      const pts = 90
      // NOTE: no ctx.beginPath() here, caller owns the path
      for (let i = 0; i <= pts; i++) {
        const angle = (i / pts) * Math.PI * 2
        const wave =
          Math.sin(angle * 3 + t * 1.8) * 0.13 +
          Math.sin(angle * 5 - t * 1.3) * 0.08 +
          Math.sin(angle * 7 + t * 2.5) * 0.05 +
          Math.sin(angle * 11 - t * 3.1) * 0.03
        const pr = r * (1 + wave)
        i === 0
          ? ctx.moveTo(cx + Math.cos(angle) * pr, cy + Math.sin(angle) * pr)
          : ctx.lineTo(cx + Math.cos(angle) * pr, cy + Math.sin(angle) * pr)
      }
      ctx.closePath()
    }

    const startLoop = () => {
      const draw = () => {
        const { color, bw } = imagesRef.current
        timeRef.current += 0.016
        const t = timeRef.current

        // Smooth cursor follow for main blob
        smoothRef.current.x = lerp(smoothRef.current.x, posRef.current.x, 0.09)
        smoothRef.current.y = lerp(smoothRef.current.y, posRef.current.y, 0.09)

        // Radius grows in / out
        const targetRadius = activeRef.current ? MAX_RADIUS : 0
        radiusRef.current = lerp(radiusRef.current, targetRadius, activeRef.current ? 0.1 : 0.06)

        // Trail at raw cursor position every frame
        if (activeRef.current) {
          trailRef.current.push({ x: posRef.current.x, y: posRef.current.y, age: 0 })
        }
        trailRef.current = trailRef.current
          .map(p => ({ ...p, age: p.age + 1 }))
          .filter(p => p.age < TRAIL_MAX_AGE)

        // Scale color image up so it aligns with the silhouette
        const CS = 1.38
        const cOff = -(size * (CS - 1)) / 2

        ctx.clearRect(0, 0, size, size)
        ctx.drawImage(color, cOff, cOff, size * CS, size * CS)

        const hasReveal = radiusRef.current > 1 || trailRef.current.length > 0
        if (hasReveal) {
          ctx.save()
          ctx.beginPath()

          // Trail circles shrink as they age
          for (const pt of trailRef.current) {
            const r = Math.max(MAX_RADIUS * (1 - pt.age / TRAIL_MAX_AGE * 0.7), 2)
            ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2)
          }

          // Leading liquid blob
          if (radiusRef.current > 1) {
            drawLiquidPath(smoothRef.current.x, smoothRef.current.y, radiusRef.current, t)
          }

          ctx.clip()
          ctx.drawImage(bw, 0, 0, size, size)
          ctx.restore()
        }

        rafRef.current = requestAnimationFrame(draw)
      }
      rafRef.current = requestAnimationFrame(draw)
    }

    return () => cancelAnimationFrame(rafRef.current)
  }, [colorSrc, bwSrc, size])

  const onMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    posRef.current = {
      x: (e.clientX - rect.left) / rect.width * size,
      y: (e.clientY - rect.top) / rect.height * size,
    }
    activeRef.current = true
  }

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => { activeRef.current = false }}
      style={{
        width: `${size}px`,
        maxWidth: '100%',
        aspectRatio: '1 / 1',
        cursor: 'none',
        display: 'block',
      }}
    />
  )
}
