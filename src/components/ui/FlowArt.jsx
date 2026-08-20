/* The GSAP pin + rotate-in effect was removed Aug 19 2026 at Jack's request.
   Sections used to pin in place while the next one rotated up over the top of
   them, which read as the page swapping rather than scrolling. They now sit in
   normal document flow and scroll past one another. Per-element text
   animations (clipReveal, fadeUp) live in the section components and are
   deliberately untouched. */

export function FlowSection({ id, className, style = {}, children, 'aria-label': ariaLabel }) {
  return (
    <section
      id={id}
      data-flow-section
      aria-label={ariaLabel}
      style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
      className={className}
    >
      <div
        data-flow-inner
        className="flow-art-container"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '2.5rem',
          width: '100%',
          padding: 'clamp(2rem,8vw,4vw) clamp(1.5rem,8vw,7rem)',
          ...style,
        }}
      >
        {children}
      </div>
    </section>
  )
}

function FlowArt({ children, 'aria-label': ariaLabel }) {
  return (
    <div aria-label={ariaLabel} style={{ width: '100%', overflowX: 'hidden' }}>
      {children}
    </div>
  )
}

export default FlowArt
