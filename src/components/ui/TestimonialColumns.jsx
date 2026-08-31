import React from 'react'
import { motion } from 'framer-motion'

/**
 * Vertically scrolling testimonial columns.
 *
 * Each column renders its list TWICE and travels exactly -50%, so the moment
 * the first copy scrolls out the second sits precisely where it began and the
 * loop is seamless. Same trick the horizontal marquee used, rotated 90deg.
 *
 * Columns take different durations so they drift out of sync, which is what
 * stops it reading as one block sliding.
 */
export function TestimonialsColumn({ testimonials, duration = 10, className = '' }) {
  return (
    <div className={'tc-col ' + className}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        className="tc-track"
      >
        {[0, 1].map(copy => (
          <React.Fragment key={copy}>
            {testimonials.map(({ quote, image, name, role }, i) => (
              <figure className="tc-card" key={copy + '-' + i} aria-hidden={copy === 1}>
                <blockquote className="tc-quote">{quote}</blockquote>
                <figcaption className="tc-person">
                  {image && (
                    <img
                      src={image}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      decoding="async"
                      className="tc-avatar"
                    />
                  )}
                  <span className="tc-meta">
                    <span className="tc-name">{name}</span>
                    {role && <span className="tc-role">{role}</span>}
                  </span>
                </figcaption>
              </figure>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}

/** Splits the list across N columns and renders the whole grid. */
export function TestimonialColumns({ testimonials, columns = 3 }) {
  const cols = Array.from({ length: columns }, () => [])
  testimonials.forEach((t, i) => cols[i % columns].push(t))

  // Deliberately uneven so the columns never line up with each other.
  const durations = [22, 28, 25, 31]

  return (
    <div className="tc-wrap" aria-label="Client testimonials">
      <style>{`
        .tc-wrap{
          display:flex; justify-content:center; gap:1.5rem;
          height:min(78vh,760px); overflow:hidden; margin-top:3rem;
          -webkit-mask-image:linear-gradient(180deg,transparent,#000 12%,#000 88%,transparent);
                  mask-image:linear-gradient(180deg,transparent,#000 12%,#000 88%,transparent);
        }
        .tc-col{ flex:0 0 auto; }
        .tc-track{ display:flex; flex-direction:column; gap:1.5rem; padding-bottom:1.5rem; will-change:transform; }
        /* Hovering holds every column, and releasing resumes in place. */
        .tc-wrap:hover .tc-track{ animation-play-state:paused; }

        .tc-card{
          width:clamp(280px,24vw,340px);
          margin:0; padding:2rem;
          background:#ffffff; color:#141414;
          border:1px solid rgba(20,20,20,0.08);
          border-radius:24px;
          box-shadow:0 10px 30px -12px rgba(20,20,20,0.16);
        }
        .tc-quote{
          margin:0; font-size:1rem; line-height:1.6;
          color:rgba(20,20,20,0.9);
        }
        .tc-person{ display:flex; align-items:center; gap:0.75rem; margin-top:1.5rem; }
        .tc-avatar{
          width:40px; height:40px; flex:0 0 40px;
          border-radius:9999px; object-fit:cover; display:block;
          background:rgba(20,20,20,0.06);
        }
        .tc-meta{ display:flex; flex-direction:column; min-width:0; }
        .tc-name{ font-weight:600; letter-spacing:-0.01em; line-height:1.25; }
        .tc-role{ line-height:1.25; opacity:0.6; letter-spacing:-0.01em; font-size:0.95rem; }

        /* Two columns on tablet, one on phone. Hiding the extra columns keeps
           the cards full width instead of letting them shrink to nothing. */
        @media (max-width:1024px){
          .tc-wrap{ gap:1rem; height:min(70vh,620px); }
          .tc-col:nth-child(3){ display:none; }
        }
        @media (max-width:680px){
          .tc-col:nth-child(2){ display:none; }
          .tc-card{ width:min(88vw,340px); padding:1.5rem; }
        }

        @media (prefers-reduced-motion:reduce){
          .tc-wrap{ height:auto; overflow:visible; mask-image:none; -webkit-mask-image:none; }
          .tc-track{ transform:none !important; }
        }
      `}</style>

      {cols.map((group, i) => (
        <TestimonialsColumn key={i} testimonials={group} duration={durations[i % durations.length]} />
      ))}
    </div>
  )
}
