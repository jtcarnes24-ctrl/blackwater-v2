/* The BlackWater mark, exactly as Jack supplied it (Oct 23 2026): his own
   black-on-white artwork turned into an alpha cut-out at /brand/mark.png and
   used as a mask, so the shape is his pixels, never a redraw. An earlier
   version redrew it from public/logo.svg, which has rounded ends and the
   wrong proportions. The fill is `currentColor`, so it takes the text colour
   of wherever it sits. */
export function BrandMark({ className = '', style }) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: 'block',
        aspectRatio: '673 / 626',
        backgroundColor: 'currentColor',
        WebkitMask: 'url(/brand/mark.png) center / contain no-repeat',
        mask: 'url(/brand/mark.png) center / contain no-repeat',
        ...style,
      }}
    />
  )
}
