/**
 * Minimal page header. Exists so /services/, /results/ and /contact/ each
 * carry exactly one H1 — those pages compose existing sections, none of
 * which declare an H1, leaving the pages with no primary heading at all.
 */
export function PageHeader({ eyebrow, title, emph, sub }) {
  return (
    <header style={{ background: '#ffffff' }}>
      <style>{`
        .ph-wrap { max-width:1240px; margin:0 auto;
                   padding: clamp(7rem,12vw,10rem) clamp(1.5rem,5vw,4rem) clamp(2rem,4vw,3rem); }
        .ph-eyebrow { font-family:'Space Grotesk',sans-serif; font-size:.7rem; font-weight:600;
                      letter-spacing:.3em; text-transform:uppercase; color:rgba(8,8,8,.45); margin:0 0 1.25rem; }
        .ph-h1 { font-family:'Syne',sans-serif; font-size:clamp(2.2rem,5.5vw,4rem); font-weight:800;
                 line-height:1.02; letter-spacing:-.03em; color:#080808; text-transform:uppercase; margin:0; }
        .ph-sub { font-family:'Space Grotesk',sans-serif; font-size:clamp(1rem,1.5vw,1.18rem);
                  line-height:1.65; color:rgba(8,8,8,.65); margin:1.5rem 0 0; max-width:56ch; }
      `}</style>
      <div className="ph-wrap">
        {eyebrow && <p className="ph-eyebrow">{eyebrow}</p>}
        <h1 className="ph-h1">
          {title} {emph && <span className="emph">{emph}</span>}
        </h1>
        {sub && <p className="ph-sub">{sub}</p>}
      </div>
    </header>
  )
}
