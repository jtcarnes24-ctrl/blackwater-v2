import { LiquidButton } from '../ui/LiquidButton'
import { useApply } from '../ui/ApplyModal'

/**
 * Shared layout for the individual service pages. Each page supplies its own
 * copy — the SEO value is in those pages being genuinely different, not in
 * there being more of them.
 */
export function ServicePage({ eyebrow, title, emph, intro, sections, faqs }) {
  const { openApply } = useApply()

  return (
    <>
      <style>{`
        .svc-wrap { max-width: 1100px; margin: 0 auto; padding: clamp(7rem,12vw,10rem) clamp(1.5rem,5vw,4rem) clamp(4rem,8vw,6rem); }
        .svc-eyebrow { font-family:'Space Grotesk',sans-serif; font-size:.72rem; letter-spacing:.2em; text-transform:uppercase; color:#5b6675; font-weight:600; margin:0 0 1rem; }
        .svc-h1 { font-family:'Syne',sans-serif; font-size:clamp(2.4rem,6vw,4.6rem); font-weight:800; line-height:1.02; letter-spacing:-.03em; color:#080808; text-transform:uppercase; margin:0 0 1.5rem; }
        .svc-intro { font-family:'Space Grotesk',sans-serif; font-size:clamp(1.05rem,1.7vw,1.3rem); line-height:1.6; color:rgba(8,8,8,.72); max-width:62ch; margin:0 0 2.5rem; }
        .svc-body h2 { font-family:'Syne',sans-serif; font-size:clamp(1.5rem,3vw,2.2rem); font-weight:700; letter-spacing:-.02em; color:#080808; text-transform:uppercase; margin:3.5rem 0 1rem; }
        .svc-body p { font-family:'Space Grotesk',sans-serif; font-size:1.02rem; line-height:1.75; color:rgba(8,8,8,.75); max-width:70ch; margin:0 0 1.1rem; }
        .svc-body li { font-family:'Space Grotesk',sans-serif; font-size:1.02rem; line-height:1.7; color:rgba(8,8,8,.75); margin-bottom:.6rem; max-width:70ch; }
        .svc-body ul { padding-left:1.15rem; margin:0 0 1.5rem; }
        .svc-cta { margin-top:4rem; padding:clamp(2rem,4vw,3rem); border:1px solid rgba(8,8,8,.12); border-radius:18px; background:#f7f8f9; }
        .svc-cta h2 { margin-top:0 !important; }
      `}</style>

      <div className="svc-wrap">
        <p className="svc-eyebrow">{eyebrow}</p>
        <h1 className="svc-h1">
          {title} <span className="emph">{emph}</span>
        </h1>
        <p className="svc-intro">{intro}</p>

        <div className="svc-body">
          {sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {s.p.map((para, i) => <p key={i}>{para}</p>)}
              {s.list && (
                <ul>{s.list.map((li, i) => <li key={i}>{li}</li>)}</ul>
              )}
            </section>
          ))}

          {faqs && faqs.length > 0 && (
            <section>
              <h2>Common questions</h2>
              {faqs.map((f) => (
                <div key={f.q}>
                  <p style={{ fontWeight: 700, color: '#080808', marginBottom: '.35rem' }}>{f.q}</p>
                  <p>{f.a}</p>
                </div>
              ))}
            </section>
          )}

          <div className="svc-cta">
            <h2>Want this run on your account?</h2>
            <p style={{ marginBottom: '1.75rem' }}>
              Every account runs through the same tested framework, so performance is
              repeatable instead of lucky. Apply and we will tell you honestly whether
              we are the right fit.
            </p>
            <LiquidButton onClick={openApply} variant="light">Apply Now →</LiquidButton>
          </div>
        </div>
      </div>
    </>
  )
}
