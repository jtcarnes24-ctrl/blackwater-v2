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

    // Offscreen canvas for compositing B&W without cream bleed
    const offscreen = document.createElement('canvas')
    offscreen.width = size
    offscreen.height = size
    const offCtx = offscreen.getContext('2d')

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
    const RADIUS = size * 0.13
    const TRAIL_MAX_AGE = 140
    const PARTICLE_MAX_AGE = 90

    const drawLiquidPath = (actx, cx, cy, r, t) => {
      const pts = 80
      actx.beginPath()
      for (let i = 0; i <= pts; i++) {
        const angle = (i / pts) * Math.PI * 2
        const wave =
          Math.sin(angle * 3 + t * 2.2) * 0.07 +
          Math.sin(angle * 5 - t * 1.6) * 0.035 +
          Math.sin(angle * 8 + t * 3.0) * 0.015
        const pr = r * (1 + wave)
        const px = cx + Math.cos(angle) * pr
        const py = cy + Math.sin(angle) * pr
        i === 0 ? actx.moveTo(px, py) : actx.lineTo(px, py)
      }
      actx.closePath()
    }

    const spawnParticle = (x, y) => {
      const angle = Math.random() * Math.PI * 2
      const speed = (0.4 + Math.random() * 1.2) * (size / 560)
      particlesRef.current.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        maxAge: PARTICLE_MAX_AGE * (0.5 + Math.random() * 0.5),
        radius: RADIUS * (0.18 + Math.random() * 0.28),
      })
    }

    const startLoop = () => {
      const draw = () => {
        const { color, bw } = imagesRef.current
        timeRef.current += 0.018
        const t = timeRef.current

        smoothRef.current.x = lerp(smoothRef.current.x, posRef.current.x, 0.07)
        smoothRef.current.y = lerp(smoothRef.current.y, posRef.current.y, 0.07)

        // Add trail point every frame while active
        if (activeRef.current) {
          trailRef.current.push({ x: smoothRef.current.x, y: smoothRef.current.y, age: 0 })
          // Spawn particles occasionally
          if (Math.random() < 0.25) spawnParticle(smoothRef.current.x, smoothRef.current.y)
        }

        // Age + cull trail
        trailRef.current = trailRef.current
          .map(p => ({ ...p, age: p.age + 1 }))
          .filter(p => p.age < TRAIL_MAX_AGE)

        // Update + cull particles
        particlesRef.current = particlesRef.current
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vx: p.vx * 0.97,
            vy: p.vy * 0.97,
            age: p.age + 1,
          }))
          .filter(p => p.age < p.maxAge)

        // --- Draw to offscreen: mask shape only ---
        offCtx.clearRect(0, 0, size, size)

        const hasReveal = trailRef.current.length > 0 || activeRef.current || particlesRef.current.length > 0
        if (hasReveal) {
          offCtx.save()
          offCtx.beginPath()

          // Trail circles
          for (const pt of trailRef.current) {
            const progress = pt.age / TRAIL_MAX_AGE
            const r = Math.max(RADIUS * (1 - progress * 0.55), 3)
            offCtx.arc(pt.x, pt.y, r, 0, Math.PI * 2)
          }

          // Particles
          for (const p of particlesRef.current) {
            const progress = p.age / p.maxAge
            const r = Math.max(p.radius * (1 - progress * 0.7), 1)
            offCtx.arc(p.x, p.y, r, 0, Math.PI * 2)
          }

          // Leading liquid blob
          if (activeRef.current) {
            drawLiquidPath(offCtx, smoothRef.current.x, smoothRef.current.y, RADIUS, t)
          }

          offCtx.clip()
          offCtx.drawImage(bw, 0, 0, size, size)
          offCtx.restore()
        }

        // --- Composite onto main canvas ---
        ctx.clearRect(0, 0, size, size)
        ctx.drawImage(color, 0, 0, size, size)

        // Use destination-out to punch holes where B&W will go, then draw B&W
        // Actually: just draw offscreen on top. Where offscreen is transparent, color shows.
        // B&W transparent areas → offscreen transparent → color shows.
        // That means color bleeds at B&W edges — acceptable since photos are same crop.
        ctx.drawImage(offscreen, 0, 0, size, size)

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
