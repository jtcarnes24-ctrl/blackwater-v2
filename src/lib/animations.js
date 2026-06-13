export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
}

export const clipReveal = {
  hidden: { clipPath: 'inset(0 0 100% 0)', opacity: 1 },
  show: { clipPath: 'inset(0 0 0% 0)', opacity: 1 },
}

export const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0 },
}

export const slideRight = {
  hidden: { opacity: 0, x: 40 },
  show: { opacity: 1, x: 0 },
}

export const staggerContainer = (stagger = 0.1, delay = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
})

export const viewport = { once: true, margin: '-80px' }

export const easeOut = [0.22, 1, 0.36, 1]
export const easeInOut = [0.76, 0, 0.24, 1]
