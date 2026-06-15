import { useRef, useEffect } from 'react'

export function MaskReveal({ colorSrc, bwSrc, size = 560 }) {
  const canvasRef = useRef(null)
  const posRef = useRef({ x: 0.5, y: 0.4 })
  const smoothRef = useRef({ x: 0.5, y: 0.4 })
  const activeRef = useRef(false)
  const radiusRef = useRef(0)
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
    const maxRadius = size * 0.3

    const drawLiquidPath = (cx, cy, r, t) => {
      const pts = 90
      ctx.beginPath()
      for (let i = 0; i <= pts; i++) {
        const angle = (i / pts) * Math.PI * 2
        const wave =
          Math.sin(angle * 3 + t * 2.2) * 0.06 +
          Math.sin(angle * 5 - t * 1.6) * 0.032 +
          Math.sin(angle * 8 + t * 3.0) * 0.014
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

        ctx.clearRect(0, 0, size, size)
        ctx.drawImage(bw, 0, 0, size, size)

        // Cursor lerp — slow/laggy on purpose
        smoothRef.current.x = lerp(smoothRef.current.x, posRef.current.x, 0.055)
        smoothRef.current.y = lerp(smoothRef.current.y, posRef.current.y, 0.055)

        // Radius animates in on hover, slowly drains out on leave
        const targetRadius = activeRef.current ? maxRadius : 0
        const lerpSpeed = activeRef.current ? 0.07 : 0.04
        radiusRef.current = lerp(radiusRef.current, targetRadius, lerpSpeed)

        if (radiusRef.current > 2) {
          const cx = smoothRef.current.x * size
          const cy = smoothRef.current.y * size

          ctx.save()
          ctx.beginPath()
          ctx.rect(0, 0, size, size)
          drawLiquidPath(cx, cy, radiusRef.current, t)
          ctx.clip('evenodd')
          ctx.drawImage(color, 0, 0, size, size)
          ctx.restore()
        } else {
          ctx.drawImage(color, 0, 0, size, size)
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
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
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
        cursor: 'crosshair',
        display: 'block',
      }}
    />
  )
}
