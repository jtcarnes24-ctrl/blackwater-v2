import { useEffect, useRef, useState } from 'react'

/**
 * Shared hero for the inner pages (Jack, Nov 27 2026), laid out after a
 * Pinterest reference ("TERRA cotta"): one giant word set in the homepage
 * hero's BLACK WATER style, sitting BEHIND the land in the photo, an italic
 * script word over its lower right, small labels above it, a point list top
 * right, a glass facts card tied to hotspot dots, two short paragraphs bottom
 * right and social icons bottom left.
 *
 * Every page passes its own words and photo. The photo comes as two files
 * cut from the same graded frame: `bg` (whole picture) and `fg` (only the land,
 * transparent sky). `foot` is where the word's baseline sits, as a fraction of
 * the photo's height; the land in `fg` then covers the bottom of the letters.
 *
 * Phones keep only the word, the script word, the labels and one short line.
 */
export function PageHero({
  word, script, title, kicker, meta = [], points = [], facts = [],
  paras = [], mobileLine, image, dots = [], orb,
}) {
  const rootRef = useRef(null)
  // The service orb plays its loop only while the hero is on screen (same rule
  // as the Services grid); otherwise, and under reduced motion, its still frame.
  const [live, setLive] = useState(false)
  useEffect(() => {
    const el = rootRef.current
    if (!el || !orb) return
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [orb])

  // Places the word's baseline on the photo's land, wherever object-fit:cover crops it
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const place = () => {
      const W = el.clientWidth, H = el.clientHeight
      const phone = W < 768
      const foot = phone && image.footMobile != null ? image.footMobile : image.foot
      const sc = Math.max(W / image.w, H / image.h)
      const top = (H - image.h * sc) / 2
      const left = (W - image.w * sc) / 2
      el.style.setProperty('--ph-foot', `${Math.round(top + foot * image.h * sc)}px`)
      // Word size: the design size, shrunk only when a long word would not fit
      let size = phone ? W * 0.19 : Math.min(W * 0.17, H * 0.30)
      const wordEl = el.querySelector('.ph-word [aria-hidden]')
      if (wordEl) {
        el.style.setProperty('--ph-size', `${size}px`)
        const ww = wordEl.getBoundingClientRect().width
        // `maxRight` keeps the word left of a tall peak (fraction of screen width)
        const right = phone ? (image.maxRightMobile ?? 1) : (image.maxRight ?? 1)
        // `minLeft` keeps the word right of a tall hill (desktop only)
        const left = phone ? 0 : (image.minLeft ?? 0)
        const max = W * Math.min(phone ? 0.9 : 0.86, right - left - 0.04)
        if (ww > max) size *= max / ww
        el.style.setProperty('--ph-size', `${size}px`)
        el.style.setProperty('--ph-word-right', `${Math.round(W * (1 - right))}px`)
        el.style.setProperty('--ph-word-left', `${Math.round(W * left)}px`)
      }
      // Script word: never wider than most of the screen
      const scriptEl = el.querySelector('.ph-script')
      if (scriptEl) {
        el.style.setProperty('--ph-script', '1')
        const sw = scriptEl.getBoundingClientRect().width
        const smax = W * (phone ? 0.78 : 0.5)
        el.style.setProperty('--ph-script', sw > smax ? String(smax / sw) : '1')
        // Sits right after the big word, overlapping its last letters, so it
        // reads as one phrase ("PAID ads"); clamped to stay on screen
        if (wordEl) {
          const box = el.getBoundingClientRect()
          const wr = wordEl.getBoundingClientRect().right - box.left
          const sw2 = scriptEl.getBoundingClientRect().width
          const pad = Math.min(Math.max(20, W * 0.028), 40)
          const x = Math.min(wr - sw2 * (phone ? 0.42 : 0.3), W - pad - sw2)
          el.style.setProperty('--ph-script-left', `${Math.round(Math.max(pad, x))}px`)
        }
      }
      // The card's dot only makes sense above the card, on the land
      const cardTop = H * 0.69
      const d0 = dots[0]
      if (d0) {
        const y0 = top + d0.y * image.h * sc
        el.classList.toggle('no-dot', y0 > cardTop - 28)
      }
      // Hotspot dots live in photo coordinates, so they stay on the same rock
      dots.forEach((d, i) => {
        el.style.setProperty(`--ph-dot${i}-x`, `${Math.round(left + d.x * image.w * sc)}px`)
        el.style.setProperty(`--ph-dot${i}-y`, `${Math.round(top + d.y * image.h * sc)}px`)
      })
    }
    place()
    document.fonts?.ready.then(place)
    const ro = new ResizeObserver(place)
    ro.observe(el)
    requestAnimationFrame(() => el.classList.add('is-in'))
    return () => ro.disconnect()
  }, [image, dots])

  return (
    <section ref={rootRef} className="ph" aria-label={title}>
      <style>{CSS}</style>
      <img className="ph-bg" src={image.bg} alt="" width={image.w} height={image.h} fetchpriority="high" decoding="async" />

      <div className="ph-labels" aria-hidden="true">
        <p className="ph-kicker">{kicker}</p>
        {meta.length > 0 && (
          <p className="ph-meta">{meta.map((m) => <span key={m}>{m}</span>)}</p>
        )}
      </div>

      <h1 className="ph-word">
        <span className="sr-only">{title}</span>
        <span className="ph-word-text" aria-hidden="true">{word}</span>
      </h1>

      <img className="ph-fg" src={image.fg} alt="" width={image.w} height={image.h} decoding="async" />
      <span className="ph-scrim" aria-hidden="true" />

      {script && <p className="ph-script" aria-hidden="true">{script}</p>}

      {points.length > 0 && (
        <ul className="ph-points">
          {points.map((p) => <li key={p}>{p}</li>)}
        </ul>
      )}

      {dots.map((d, i) => (
        <span key={i} className={`ph-dot${d.toCard ? ' to-card' : ''}`} aria-hidden="true"
          style={{ left: `var(--ph-dot${i}-x)`, top: `var(--ph-dot${i}-y)` }} />
      ))}

      {dots[0]?.toCard && facts.length > 0 && <span className="ph-line" aria-hidden="true" />}

      {facts.length > 0 && (
        <dl className="ph-card">
          {facts.map(([k, v]) => (
            <div key={k}><dt>{k}:</dt> <dd>{v}</dd></div>
          ))}
        </dl>
      )}

      {paras.length > 0 && (
        <div className="ph-paras">
          {paras.map((p) => <p key={p}>{p}</p>)}
        </div>
      )}
      {mobileLine && <p className="ph-mline">{mobileLine}</p>}

      <ul className="ph-social" aria-label="Social links">
        {orb && (
          <li className="ph-orb" aria-hidden="true">
            <picture>
              <source srcSet={`/orbs/${orb}-still.webp`} media="(prefers-reduced-motion: reduce)" />
              <img src={`/orbs/${orb}${live ? '' : '-still'}.webp`} alt="" width="38" height="38" decoding="async" />
            </picture>
          </li>
        )}
        <li>
          <a href="https://www.instagram.com/blackwatermrkting/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </li>
        <li>
          <a href="https://www.youtube.com/@thejackcarnes" target="_blank" rel="noreferrer" aria-label="YouTube">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="M10 9.2v5.6l5-2.8z" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </li>
      </ul>
    </section>
  )
}

const CSS = `
.ph { --ph-pad:clamp(1.25rem,2.8vw,2.5rem); --ph-size:min(17vw, 30vh); --ph-cream:#f3efe8;
      position:relative; height:100svh; min-height:620px; max-height:1100px; overflow:hidden; background:#080808; color:var(--ph-cream);
      font-family:'Space Grotesk',sans-serif; isolation:isolate; }
.ph p, .ph ul, .ph dl { margin:0; }
.ph ul { list-style:none; padding:0; }
.ph-bg, .ph-fg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:50% 50%; pointer-events:none; }
.ph-bg { z-index:0; }
.ph-fg { z-index:2; }
/* Darkens the bottom edge so the small copy reads over bright water */
.ph-scrim { position:absolute; z-index:2; left:0; right:0; bottom:0; height:34%; pointer-events:none;
            background:linear-gradient(to bottom, rgba(8,8,8,0), rgba(8,8,8,.55) 70%, rgba(8,8,8,.7)); }

/* The word: same face and gradient as the homepage BLACK WATER, baseline on the land */
.ph-word { position:absolute; z-index:1; left:var(--ph-word-left, 0px); right:var(--ph-word-right, 0px); margin:0; text-align:center; white-space:nowrap; display:flex; justify-content:center;
           top:calc(var(--ph-foot, 60%) - .864 * var(--ph-size)); font-size:var(--ph-size); line-height:1;
           font-family:'Inter',system-ui,sans-serif; font-weight:400; text-transform:uppercase; letter-spacing:-.02em; }
/* Gradient on the visible word only: background-clip:text would also paint the screen-reader title */
.ph-word-text { background:linear-gradient(180deg, rgba(255,255,255,.95) 0%, rgba(243,239,232,.78) 70%);
                -webkit-background-clip:text; background-clip:text; color:transparent; }

.ph-labels { position:absolute; z-index:3; left:var(--ph-pad); right:var(--ph-pad);
             top:calc(var(--ph-foot, 60%) - .727 * var(--ph-size) - 3.1rem); display:flex; justify-content:space-between; align-items:flex-end;
             font-size:.78rem; color:rgba(243,239,232,.6); }
.ph-kicker { padding-left:calc(var(--ph-size) * .06); }
.ph-meta { display:flex; flex-direction:column; margin-right:auto !important; margin-left:clamp(2rem,40vw,48vw) !important; line-height:1.4; }

.ph-script { position:absolute; z-index:3; left:var(--ph-script-left, auto); right:auto; top:calc(var(--ph-foot, 60%) - .12 * var(--ph-size));
             font-family:'Playfair Display',serif; font-style:italic; font-weight:500; font-size:calc(var(--ph-size) * .44 * var(--ph-script, 1));
             line-height:1; color:#fff; letter-spacing:-.01em; white-space:nowrap; text-shadow:0 2px 30px rgba(0,0,0,.35); }

.ph-points { position:absolute; z-index:3; right:var(--ph-pad); top:calc(var(--ph-foot, 60%) - .727 * var(--ph-size) - 1rem);
             display:flex; flex-direction:column; align-items:flex-end; gap:.3rem; font-size:.8rem; color:rgba(243,239,232,.85); }
.ph-points li { display:flex; align-items:center; gap:.5rem; }
.ph-points li::before { content:''; width:.75rem; height:1px; background:currentColor; opacity:.8; }

/* Hotspots and the glass facts card */
.ph-dot { position:absolute; z-index:3; width:14px; height:14px; margin:-7px 0 0 -7px; border-radius:50%;
          background:rgba(243,239,232,.95); box-shadow:0 0 0 4px rgba(243,239,232,.22); }
.ph { --ph-card-top:69%; }
/* Thin leader from the first dot down to the card */
.ph.no-dot .ph-dot, .ph.no-dot .ph-line { display:none; }
.ph-line { position:absolute; z-index:3; left:var(--ph-dot0-x); top:calc(var(--ph-dot0-y) + 9px); width:1px;
           height:calc(var(--ph-card-top) - var(--ph-dot0-y) - 9px); background:rgba(243,239,232,.55); }
.ph-card { position:absolute; z-index:3; left:calc(var(--ph-dot0-x, 29%) - 7px); top:var(--ph-card-top);
           display:flex; flex-direction:column; gap:.22rem; padding:1rem 1.25rem; min-width:min(300px,26vw);
           border:1px solid rgba(243,239,232,.32); border-radius:14px; background:rgba(20,20,22,.28);
           -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px); font-size:.82rem; line-height:1.35; }
.ph-card div { display:flex; gap:.3rem; }
.ph-card dt { color:rgba(243,239,232,.7); }
.ph-card dd { margin:0; font-weight:600; color:#fff; }

.ph-paras { position:absolute; z-index:3; right:var(--ph-pad); bottom:clamp(1.5rem,5vh,3rem); width:min(43vw,620px);
            display:grid; grid-template-columns:1fr 1fr; gap:clamp(1.25rem,3vw,3rem); font-size:.84rem; line-height:1.5; color:rgba(243,239,232,.88); }
.ph-mline { display:none; }

.ph-social { position:absolute; z-index:3; left:var(--ph-pad); bottom:clamp(1.5rem,5vh,3rem); display:flex; gap:.6rem; }
.ph-orb img { display:block; width:38px; height:38px; object-fit:contain; }
.ph-social { align-items:center; }
.ph-social a { display:grid; place-items:center; width:38px; height:38px; border:1px solid rgba(243,239,232,.5); border-radius:9px; color:var(--ph-cream);
               transition:background .25s, color .25s; }
@media (hover:hover) { .ph-social a:hover { background:var(--ph-cream); color:#080808; } }

/* Entrance: the word rises from behind the land, the rest fades in after */
.ph-word { transform:translateY(22%); opacity:0; transition:transform 1.4s cubic-bezier(.16,1,.3,1), opacity 1s ease; }
.ph-labels, .ph-script, .ph-points, .ph-dot, .ph-line, .ph-card, .ph-paras, .ph-social, .ph-mline { opacity:0; transform:translateY(14px);
  transition:opacity .9s ease, transform 1s cubic-bezier(.16,1,.3,1); }
.ph.is-in .ph-word { transform:none; opacity:1; }
.ph.is-in :is(.ph-labels, .ph-script, .ph-points, .ph-dot, .ph-line, .ph-card, .ph-paras, .ph-social, .ph-mline) { opacity:1; transform:none; }
.ph.is-in .ph-script { transition-delay:.45s; }
.ph.is-in :is(.ph-labels, .ph-points) { transition-delay:.6s; }
.ph.is-in :is(.ph-dot, .ph-line, .ph-card) { transition-delay:.8s; }
.ph.is-in :is(.ph-paras, .ph-social, .ph-mline) { transition-delay:.95s; }

/* Phones: word, script word, labels and one short line. Nothing else. */
@media (max-width:767px) {
  .ph { min-height:560px; }
  .ph-meta, .ph-points, .ph-dot, .ph-line, .ph-card, .ph-paras { display:none; }
  .ph-labels { font-size:.72rem; }
  .ph-script { font-size:calc(var(--ph-size) * .52 * var(--ph-script, 1)); top:calc(var(--ph-foot, 60%) - .02 * var(--ph-size)); }
  .ph-mline { display:block; position:absolute; z-index:3; left:var(--ph-pad); right:calc(var(--ph-pad) + 60px); bottom:clamp(1.5rem,5vh,2.5rem);
              font-size:.95rem; line-height:1.45; color:rgba(243,239,232,.9); }
  .ph-social { left:auto; right:var(--ph-pad); flex-direction:column; }
}
@media (prefers-reduced-motion: reduce) {
  .ph-word, .ph-labels, .ph-script, .ph-points, .ph-dot, .ph-line, .ph-card, .ph-paras, .ph-social, .ph-mline { transition:none; transform:none; opacity:1; }
}
`

export default PageHero
