import { motion } from 'framer-motion'

/* Staggered reveal: each word rises and unblurs a beat after the one before
   it, so a heading assembles left to right instead of appearing at once.

   Written directly against Framer Motion, which the site already ships,
   rather than pulling the shadcn component in. That registry would have added
   a dependency and a Tailwind class layer for an effect that is twenty lines,
   and the codebase styles with inline objects rather than utility classes.

   Splitting on words rather than characters is deliberate: per-letter stagger
   on a six-word heading reads as a gimmick and hurts screen readers. The
   whole string stays in the DOM as one accessible label. */

/* The blur is dropped on phones and on any reduced-motion preference.
   Animating filter: blur() per word forces a fresh rasterisation of that word
   every frame; opacity and transform are composited and effectively free. The
   reveal reads almost the same without it. */
const CHEAP =
  typeof window !== 'undefined' &&
  window.matchMedia(
    '(hover: none), (max-width: 860px), (prefers-reduced-motion: reduce)'
  ).matches

const wordVariants = CHEAP
  ? {
      hidden: { opacity: 0, y: '0.42em' },
      show: {
        opacity: 1,
        y: '0em',
        transition: { duration: 0.62, ease: [0.25, 0.46, 0.45, 0.94] },
      },
    }
  : {
      hidden: { opacity: 0, y: '0.42em', filter: 'blur(7px)' },
      show: {
        opacity: 1,
        y: '0em',
        filter: 'blur(0px)',
        transition: { duration: 0.62, ease: [0.25, 0.46, 0.45, 0.94] },
      },
    }

export function StaggeredText({
  text,
  as: Tag = 'span',
  stagger = 0.055,
  delay = 0,
  className,
  style,
  once = true,
  /* 'view' waits for the element to scroll into view. 'mount' fires straight
     away, which is required inside FlowSection: those panels sit in a clipped
     flow container where whileInView never fires, a landmine already noted in
     FlowGroup2. */
  trigger = 'view',
  /* Optional single word to carry the serif-italic .emph treatment, so a
     heading can keep its editorial accent while still animating per word. */
  emph,
}) {
  const words = String(text).split(' ')

  return (
    <Tag className={className} style={{ ...style }} aria-label={text}>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        {...(trigger === 'mount'
          ? { animate: 'show' }
          : { whileInView: 'show', viewport: { once, margin: '-12%' } })}
        transition={{ staggerChildren: stagger, delayChildren: delay }}
        style={{ display: 'inline' }}
      >
        {words.map((word, i) => (
          // The wrapper clips the rise so words emerge from their own line
          // rather than sliding over the one above.
          <span
            key={i}
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}
          >
            <motion.span variants={wordVariants} style={{ display: 'inline-block', willChange: 'transform, filter, opacity' }}>
              {emph && word.toLowerCase() === String(emph).toLowerCase()
                ? <span className="emph">{word.toLowerCase()}</span>
                : word}
            </motion.span>
            {i < words.length - 1 && ' '}
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

export default StaggeredText
