import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from 'framer-motion'
import { useId } from 'react'

function GridSVG({ offsetX, offsetY, patternId, color }) {
  return (
    <svg style={{ width: '100%', height: '100%' }}>
      <defs>
        <motion.pattern
          id={patternId}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={color} strokeWidth="0.6" />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  )
}

export function InfiniteGrid({ color = 'rgba(242,237,228,1)' }) {
  const uid = useId().replace(/:/g, '')
  const mouseX = useMotionValue(-9999)
  const mouseY = useMotionValue(-9999)
  const gridOffsetX = useMotionValue(0)
  const gridOffsetY = useMotionValue(0)

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.4) % 40)
    gridOffsetY.set((gridOffsetY.get() + 0.4) % 40)
  })

  const maskImage = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, black, transparent)`

  const handleMouseMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  const handleMouseLeave = () => {
    mouseX.set(-9999)
    mouseY.set(-9999)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ position: 'absolute', inset: 0, zIndex: 1 }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06 }}>
        <GridSVG offsetX={gridOffsetX} offsetY={gridOffsetY} patternId={`${uid}a`} color={color} />
      </div>
      <motion.div style={{ position: 'absolute', inset: 0, opacity: 0.45, maskImage, WebkitMaskImage: maskImage }}>
        <GridSVG offsetX={gridOffsetX} offsetY={gridOffsetY} patternId={`${uid}b`} color={color} />
      </motion.div>
    </div>
  )
}
