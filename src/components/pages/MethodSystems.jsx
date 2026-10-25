import { StatementBeats } from './StatementBeats'

/**
 * /the-method/ (Oct 24 2026): rebuilt on the About page's format so the two
 * read as one site. An opening title set like the About hero, then each
 * pillar as a statement row: label and big heading on the left, the lead and
 * closing lines as plain paragraphs on the right (StatementBeats).
 */
export function MethodSystems({ eyebrow, heading, emph, standfirst, systems }) {
  const beats = systems.map((s) => ({
    kicker: s.label,
    h: s.title,
    p: [s.lead, s.close].filter(Boolean),
  }))

  return (
    <section id="method" aria-label={`${heading} ${emph}`} style={{ background: '#080808' }}>
      <style>{`
        .ms-open { min-height:86svh; display:flex; flex-direction:column; justify-content:center;
                   max-width:1240px; margin:0 auto;
                   padding: clamp(7rem,12vw,9rem) clamp(1.5rem,5vw,4rem) clamp(3rem,6vw,5rem); }
        .ms-eyebrow { font-family:'Space Grotesk',sans-serif; font-size:.7rem; font-weight:600;
                      letter-spacing:.3em; text-transform:uppercase; color:rgba(255,255,255,.6); margin:0 0 1.5rem; }
        .ms-h1 { font-family:'Syne',sans-serif; font-weight:800; text-transform:uppercase;
                 font-size:clamp(2.6rem,8vw,7rem); line-height:.95; letter-spacing:-.035em;
                 color:#ffffff; margin:0; max-width:14ch; }
        .ms-standfirst { font-family:'Space Grotesk',sans-serif; font-size:clamp(1rem,1.5vw,1.15rem);
                         line-height:1.65; color:rgba(255,255,255,.75); margin:2rem 0 0; max-width:42ch; }
        .ms-open > * { animation: ms-rise .9s cubic-bezier(.22,1,.36,1) both; }
        .ms-open > *:nth-child(2) { animation-delay:.08s; }
        .ms-open > *:nth-child(3) { animation-delay:.16s; }
        @keyframes ms-rise { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:none; } }
        @media (prefers-reduced-motion: reduce) { .ms-open > * { animation:none; } }
      `}</style>

      <header className="ms-open">
        {eyebrow && <p className="ms-eyebrow">{eyebrow}</p>}
        <h1 className="ms-h1">
          {heading} <span className="emph">{emph}</span>
        </h1>
        <p className="ms-standfirst">{standfirst}</p>
      </header>

      <StatementBeats beats={beats} />
    </section>
  )
}
