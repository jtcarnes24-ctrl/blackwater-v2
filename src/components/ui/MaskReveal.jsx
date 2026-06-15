import { useRef, useEffect } from 'react'

export function MaskReveal({ colorSrc, bwSrc, size = 560 }) {
  const canvasRef = useRef(null)
  const posRef = useRef({ x: 0.5, y: 0.4 })
  const smoothRef = useRef({ x: 0.5, y: 0.4 })
  const activeRef = useRef(false)
  const imagesRef = useRef({ color: null, bw: null })
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = size
    canvas.height = size

    let loaded = 0
    const onLoad = () => {
      loaded++
      if (loaded === 2) startLoop()
    }

    const colorImg = new window.Image()
    const bwImg = new window.Image()
    colorImg.onload = onLoad
    bwImg.onload = onLoad
    colorImg.src = colorSrc
    bwImg.src = bwSrc
    imagesRef.current = { color: colorImg, bw: bwImg }

    const lerp = (a, b, t) => a + (b - a) * t
    const radius = size * 0.28

    const startLoop = () => {
      const draw = () => {
        const { color, bw } = imagesRef.current
        ctx.clearRect(0, 0, size, size)

        // Base: B&W hat photo
        ctx.drawImage(bw, 0, 0, size, size)

        // Smooth cursor
        smoothRef.current.x = lerp(smoothRef.current.x, posRef.current.x, 0.1)
        smoothRef.current.y = lerp(smoothRef.current.y, posRef.current.y, 0.1)

        if (activeRef.current) {
          const cx = smoothRef.current.x * size
          const cy = smoothRef.current.y * size

          // Clip to everything EXCEPT the circle (even-odd winding)
          ctx.save()
          ctx.beginPath()
          ctx.rect(0, 0, size, size)
          ctx.arc(cx, cy, radius, 0, Math.PI * 2, true)
          ctx.clip('evenodd')
          ctx.drawImage(color, 0, 0, size, size)
          ctx.restore()
        } else {
          // Default: full color on top
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
