import { LiquidButton } from '../ui/LiquidButton'
import { useApply } from '../ui/ApplyModal'

/**
 * Shared layout for the individual service pages. Each page supplies its own
 * copy — the SEO value is in those pages being genuinely different, not in
 * there being more of them.
 */
export function ServicePage({ eyebrow, title, emph, intro, sections, faqs, work }) {
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

        /* Recent work. Cards show the site itself rather than its address:
           a hero preview reads as a portfolio, a URL reads as a link list. */
        .svc-work { margin-top:4.5rem; }
        .svc-work-grid { --work-gap:clamp(1.5rem,3vw,2.25rem);
                         display:grid; gap:var(--work-gap); margin-top:2rem; }
        @media (min-width:760px){
          .svc-work-grid { grid-template-columns:1fr 1fr; }
          /* An odd number of cards leaves the last one alone on its row, which
             reads as a mistake pinned to the left. Centre it at column width. */
          .svc-work-card:last-child:nth-child(odd) {
            grid-column:1 / -1;
            width:calc(50% - var(--work-gap) / 2);
            margin-inline:auto;
          }
        }
        .svc-work-card { display:block; text-decoration:none; color:inherit; }
        .svc-work-shot { position:relative; overflow:hidden; border-radius:14px;
                         border:1px solid rgba(8,8,8,.1); background:#eceef0;
                         aspect-ratio:8/5; }
        .svc-work-shot img { width:100%; height:100%; object-fit:cover; display:block;
                             transition:transform .5s cubic-bezier(.22,1,.36,1); }
        .svc-work-card:hover .svc-work-shot img { transform:scale(1.03); }
        .svc-work-meta { display:flex; align-items:center; justify-content:space-between;
                         gap:1rem; margin-top:.9rem; }
        .svc-work-name { font-family:'Space Grotesk',sans-serif; font-size:.95rem; font-weight:600;
                         color:#080808; margin:0; }
        .svc-work-kind { font-family:'Space Grotesk',sans-serif; font-size:.68rem; font-weight:600;
                         letter-spacing:.16em; text-transform:uppercase; color:#5b6675;
                         margin:.2rem 0 0; }
        .svc-work-go { flex:none; width:34px; height:34px; border-radius:50%;
                       border:1px solid rgba(8,8,8,.18); display:flex; align-items:center;
                       justify-content:center; font-size:.9rem; color:#080808;
                       transition:background .3s ease, border-color .3s ease, transform .3s cubic-bezier(.22,1,.36,1); }
        .svc-work-card:hover .svc-work-go { background:#080808; border-color:#080808;
                                            color:#fff; transform:translate(3px,-3px); }
        .svc-work-card:focus-visible .svc-work-shot { outline:2px solid #080808; outline-offset:3px; }
        @media (prefers-reduced-motion: reduce){
          .svc-work-shot img, .svc-work-go { transition:none; }
          .svc-work-card:hover .svc-work-shot img { transform:none; }
        }
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

          {work && work.items && work.items.length > 0 && (
            <section className="svc-work">
              <h2>{work.heading}</h2>
              {work.intro && <p>{work.intro}</p>}
              <div className="svc-work-grid">
                {work.items.map((w) => (
                  <a
                    className="svc-work-card"
                    key={w.name}
                    href={w.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${w.name}, opens in a new tab`}
                  >
                    <div className="svc-work-shot">
                      <img src={w.img} alt={w.alt} loading="lazy" width="800" height="500" />
                    </div>
                    <div className="svc-work-meta">
                      <div>
                        <p className="svc-work-name">{w.name}</p>
                        {w.kind && <p className="svc-work-kind">{w.kind}</p>}
                      </div>
                      <span className="svc-work-go" aria-hidden="true">&#8599;</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

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
