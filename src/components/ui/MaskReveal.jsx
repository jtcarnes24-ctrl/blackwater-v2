import { useRef, useEffect } from 'react'

export function MaskReveal({ colorSrc, bwSrc, size = 560 }) {
  const canvasRef = useRef(null)
  const posRef = useRef({ x: size / 2, y: size / 2 })
  const smoothRef = useRef({ x: size / 2, y: size / 2 })
  const activeRef = useRef(false)
  const trailRef = useRef([])
  const particlesRef = useRef([])
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
    const RADIUS = size * 0.14
    const TRAIL_MAX_AGE = 160
    const PARTICLE_MAX_AGE = 80

    const drawLiquidPath = (cx, cy, r, t) => {
      const pts = 90
      ctx.beginPath()
      for (let i = 0; i <= pts; i++) {
        const angle = (i / pts) * Math.PI * 2
        const wave =
          Math.sin(angle * 3 + t * 2.2) * 0.08 +
          Math.sin(angle * 5 - t * 1.6) * 0.04 +
          Math.sin(angle * 8 + t * 3.1) * 0.018
        const pr = r * (1 + wave)
        i === 0
          ? ctx.moveTo(cx + Math.cos(angle) * pr, cy + Math.sin(angle) * pr)
          : ctx.lineTo(cx + Math.cos(angle) * pr, cy + Math.sin(angle) * pr)
      }
      ctx.closePath()
    }

    const spawnParticle = (x, y) => {
      const angle = Math.random() * Math.PI * 2
      const speed = (0.6 + Math.random() * 1.8) * (size / 560)
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        maxAge: PARTICLE_MAX_AGE * (0.5 + Math.random() * 0.5),
        radius: RADIUS * (0.15 + Math.random() * 0.3),
      })
    }

    const startLoop = () => {
      const draw = () => {
        const { color, bw } = imagesRef.current
        timeRef.current += 0.018
        const t = timeRef.current

        smoothRef.current.x = lerp(smoothRef.current.x, posRef.current.x, 0.07)
        smoothRef.current.y = lerp(smoothRef.current.y, posRef.current.y, 0.07)

        if (activeRef.current) {
          trailRef.current.push({ x: smoothRef.current.x, y: smoothRef.current.y, age: 0 })
          if (Math.random() < 0.3) spawnParticle(smoothRef.current.x, smoothRef.current.y)
        }

        trailRef.current = trailRef.current
          .map(p => ({ ...p, age: p.age + 1 }))
          .filter(p => p.age < TRAIL_MAX_AGE)

        particlesRef.current = particlesRef.current
          .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vx: p.vx * 0.96, vy: p.vy * 0.96, age: p.age + 1 }))
          .filter(p => p.age < p.maxAge)

        ctx.clearRect(0, 0, size, size)

        // Base: always show B&W — no edge issues since B&W is the foundation
        ctx.drawImage(bw, 0, 0, size, size)

        // Reveal color inside cursor trail + particles
        const hasReveal = trailRef.current.length > 0 || activeRef.current || particlesRef.current.length > 0
        if (hasReveal) {
          ctx.save()
          ctx.beginPath()

          // Trail — full size at start, shrink slowly
          for (const pt of trailRef.current) {
            const progress = pt.age / TRAIL_MAX_AGE
            const r = Math.max(RADIUS * (1 - progress * 0.5), 3)
            ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2)
          }

          // Water droplet particles
          for (const p of particlesRef.current) {
            const progress = p.age / p.maxAge
            const r = Math.max(p.radius * (1 - progress * 0.75), 1)
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
          }

          // Leading liquid blob at cursor
          if (activeRef.current) {
            drawLiquidPath(smoothRef.current.x, smoothRef.current.y, RADIUS, t)
          }

          ctx.clip()
          ctx.drawImage(color, 0, 0, size, size)
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
