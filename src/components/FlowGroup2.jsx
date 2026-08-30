import { motion } from 'framer-motion'
import FlowArt, { FlowSection } from './ui/FlowArt'
import { LiquidButton } from './ui/LiquidButton'
import { easeOut, easeInOut, viewport } from '../lib/animations'
import { useApply } from './ui/ApplyModal'

const testimonials = [
  { quote: "Jack and the team don't just run ads and disappear. They're constantly testing stuff, sending updates, and actually explaining what's working. It feels like having another team in our business instead of another agency.", name: 'Luca Moretti' },
  { quote: "I've worked with agencies before and this was a completely different experience. The communication is fast, they're straight up about what's working, and our numbers have looked better every month since we started.", name: 'Priya Narayanan' },
  { quote: "One thing I noticed right away was how much they actually cared about the outcome. They weren't just trying to spend our budget. Every change had a reason behind it and it paid off.", name: 'Mateo Álvarez' },
  { quote: "These guys are lowkey obsessed with improving everything. Every week there was something new being tested or optimized. It made me feel like our account was actually getting attention instead of being forgotten.", name: 'Zain Al-Haddad' },
  { quote: "I was honestly skeptical because everyone says they can scale brands. BlackWater actually backed it up. We finally have a system that brings in sales consistently instead of random good weeks.", name: 'Anika Sørensen' },
  { quote: "The response time is crazy. I don't think I've ever waited more than a couple hours for an answer. Having three people working together on our account definitely makes a difference.", name: 'Thiago Carvalho' },
  { quote: "I've never had an agency send this many ideas without me asking. New creatives, landing page feedback, ad angles, offers. They helped improve way more than just our Meta ads.", name: 'Sofia Petrovic' },
  { quote: "Probably the easiest agency we've worked with. No confusing reports or fluff. They just tell you what happened, what's changing next, and keep pushing to get better results. Love that.", name: "Kieran O'Donnell" },
  { quote: "Our CPA kept creeping up and we couldn't figure out why. BlackWater came in, cleaned everything up, and within a few weeks we were finally profitable again. Wish we found them sooner lol.", name: 'Nikolai Varga' },
  { quote: "Shout out to the whole BlackWater crew. It never felt like one person trying to juggle everything. There was always someone available, ideas were flowing, and they treated our brand like it was their own.", name: 'Yara Ben Salem' },
]

function TestimonialMarquee() {
  // Two identical tracks side by side. The first scrolls exactly its own
  // width, at which point the second sits where the first began, so the
  // restart is invisible and the loop never shows a gap.
  const lane = [...testimonials, ...testimonials]

  return (
    <div className="tm-viewport" aria-label="Client testimonials">
      <div className="tm-track">
        {lane.map((t, i) => (
          <figure className="tm-card" key={i} aria-hidden={i >= testimonials.length}>
            <blockquote className="tm-quote">{t.quote}</blockquote>
            <figcaption className="tm-name">{t.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}

export function FlowGroup2() {
  const { openApply } = useApply()
  return (
    <FlowArt aria-label="Our system and testimonials">
      <FlowSection
        id="testimonials"
        aria-label="Client testimonials"
        style={{ background: '#ffffff', color: '#141414' }}
      >
        <style>{`
          /* Breaks out of the section's horizontal padding so the cards run
             to both screen edges. */
          .tm-viewport {
            width: 100vw;
            margin-left: calc(50% - 50vw);
            overflow: hidden;
            padding: 1.5rem 0;
            -webkit-mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
                    mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
          }
          .tm-track {
            display: flex; width: max-content; gap: 1.25rem;
            animation: tm-scroll 68s linear infinite;
            will-change: transform;
          }
          /* Hovering anywhere on the strip holds it, and releasing resumes
             from the same position rather than snapping back. */
          .tm-viewport:hover .tm-track { animation-play-state: paused; }
          @keyframes tm-scroll {
            from { transform: translate3d(0, 0, 0); }
            to   { transform: translate3d(-50%, 0, 0); }
          }
          .tm-card {
            flex: 0 0 clamp(280px, 26vw, 400px);
            margin: 0; padding: 1.75rem;
            background: #141414; color: #ffffff;
            border-radius: 16px;
            display: flex; flex-direction: column; justify-content: space-between;
            gap: 1.25rem;
          }
          .tm-quote {
            margin: 0; font-size: 0.95rem; line-height: 1.65;
            color: rgba(255,255,255,0.82);
          }
          .tm-name {
            font-size: 0.8rem; font-weight: 700; letter-spacing: 0.05em;
            color: #ffffff;
          }
          @media (prefers-reduced-motion: reduce) {
            .tm-track { animation: none; }
            .tm-viewport { overflow-x: auto; }
          }
        `}</style>
        <motion.p
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }} viewport={viewport}
          style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(20,20,20,0.4)', fontWeight: 600 }}
        >
          Client Feedback
        </motion.p>

        {['WHAT OUR', 'CLIENTS SAY'].map((line, i) => (
          <div key={line} style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
              transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.08 }}
              viewport={viewport}
              style={{ fontSize: 'clamp(2.5rem, 6vw, 6.5rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.92, color: '#141414', textTransform: 'uppercase', margin: 0 }}
            >
              {line}
            </motion.h2>
          </div>
        ))}

        <TestimonialMarquee />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          viewport={viewport}
          style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
        >
          <LiquidButton onClick={openApply} variant="light" style={{ color: '#141414', borderColor: '#141414' }}>
            Apply Now →
          </LiquidButton>
        </motion.div>
      </FlowSection>
    </FlowArt>
  )
}
