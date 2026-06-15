import { useRef, useEffect } from 'react'

export function MaskReveal({ colorSrc, bwSrc, size = 560 }) {
  const canvasRef = useRef(null)
  const posRef = useRef({ x: size / 2, y: size / 2 })
  const smoothRef = useRef({ x: size / 2, y: size / 2 })
  const activeRef = useRef(false)
  const trailRef = useRef([]) // { x, y, age, maxAge }
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
    const RADIUS = size * 0.1        // smaller leading circle
    const TRAIL_MAX_AGE = 90         // frames trail persists
    const TRAIL_ADD_EVERY = 3        // add trail point every N frames
    let frameCount = 0

    const drawLiquidPath = (cx, cy, r, t) => {
      const pts = 80
      ctx.beginPath()
      for (let i = 0; i <= pts; i++) {
        const angle = (i / pts) * Math.PI * 2
        const wave =
          Math.sin(angle * 3 + t * 2.2) * 0.07 +
          Math.sin(angle * 5 - t * 1.6) * 0.035 +
          Math.sin(angle * 8 + t * 3.0) * 0.015
        const pr = r * (1 + wave)
        const px = cx + Math.cos(angle) * pr
        const py = cy + Math.sin(angle) * pr
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath()
    }

    const startLoop = () => {
      const draw = () => {
        const { color, bw } = imagesRef.current
        timeRef.current += 0.018
        const t = timeRef.current
        frameCount++

        // Lerp cursor — slow, laggy
        smoothRef.current.x = lerp(smoothRef.current.x, posRef.current.x, 0.07)
        smoothRef.current.y = lerp(smoothRef.current.y, posRef.current.y, 0.07)

        // Add trail point
        if (activeRef.current && frameCount % TRAIL_ADD_EVERY === 0) {
          trailRef.current.push({
            x: smoothRef.current.x,
            y: smoothRef.current.y,
            age: 0,
            maxAge: TRAIL_MAX_AGE,
          })
        }

        // Age trail, remove dead points
        trailRef.current = trailRef.current
          .map(p => ({ ...p, age: p.age + 1 }))
          .filter(p => p.age < p.maxAge)

        ctx.clearRect(0, 0, size, size)

        // Base: full color — no B&W visible by default
        ctx.drawImage(color, 0, 0, size, size)

        // Reveal B&W only where trail circles + active cursor are
        const hasReveal = trailRef.current.length > 0 || activeRef.current

        if (hasReveal) {
          ctx.save()
          ctx.beginPath()

          // Trail circles — shrink and fade out as they age
          for (const pt of trailRef.current) {
            const progress = pt.age / pt.maxAge          // 0→1
            const r = RADIUS * (1 - progress * 0.55)    // shrinks to 45% at end
            ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2)
          }

          // Leading liquid blob at cursor
          if (activeRef.current) {
            drawLiquidPath(smoothRef.current.x, smoothRef.current.y, RADIUS, t)
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
        height: `${size}px`,
        maxWidth: '100%',
        cursor: 'none',
        display: 'block',
      }}
    />
  )
}
