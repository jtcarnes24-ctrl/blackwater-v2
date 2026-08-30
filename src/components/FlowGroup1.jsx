import { motion } from 'framer-motion'
import FlowArt, { FlowSection } from './ui/FlowArt'
import { easeOut, viewport } from '../lib/animations'
import { StaggeredText } from './ui/StaggeredText'
import ScrollStack, { ScrollStackItem } from './ui/ScrollStack/ScrollStack'

const pillars = [
  { num: '01', title: 'A Method, Not a Template', desc: 'Built by studying the top-performing strategies across the industry and keeping only what actually produces results. Every campaign runs on the same foundation, so performance is repeatable instead of lucky.' },
  { num: '02', title: 'Audiences Built on Real Intent', desc: 'Most agencies pick interests and hope. We use intent data to build and target audiences already in the market for what you sell, then feed it into lookalikes. Very few agencies work this way.' },
  { num: '03', title: 'Creators On Demand', desc: 'Winning ads take volume, and volume takes people on camera. We pull from a network of UGC creators to get brands real content at the pace testing actually requires. No casting, no filming on your end.' },
  /* Fourth pillar written to complete the 2x2 grid. Describes the testing
     cadence Jack already runs; confirm the wording before it stays. */
  { num: '04', title: 'Testing On A Schedule', desc: 'New creative goes live every week, winners get more budget, and anything that stops working comes off. You get the numbers twice a week, so you always know what changed and why.' },
]

export function FlowGroup1() {
  return (
    <FlowArt aria-label="About and Method">
      {/* About */}
      <FlowSection
        id="about"
        aria-label="About us"
        style={{ background: '#000000', color: '#ffffff' }}
      >
        {/* A real box, not display:contents. useScroll measures the target's
            rect, and an element with no box always reports zero, which left
            the reveal frozen. This reproduces the flow container's own column
            layout so nothing shifts. */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          gap: '1.5rem', flex: 1, width: '100%',
        }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: easeOut }} viewport={viewport}
            style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}
          >
            About Us
          </motion.p>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {[
              { text: 'REDEFINING', delay: 0 },
              { text: 'MARKETING FOR', delay: 0.26 },
              { text: 'THE DIGITAL AGE', delay: 0.52, emph: 'digital' },
            ].map((line) => (
              <StaggeredText
                key={line.text}
                as="h2"
                text={line.text}
                delay={line.delay}
                stagger={0.075}
                emph={line.emph}
                style={{
                  fontSize: 'clamp(2.5rem, 6.5vw, 7rem)', fontWeight: 700,
                  letterSpacing: '-0.03em', lineHeight: 0.92, color: '#ffffff',
                  textTransform: 'uppercase', margin: 0,
                }}
              />
            ))}
          </div>

          {/* Lands after the heading has finished assembling. */}
          <motion.p
            initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.95 }} viewport={viewport}
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', color: 'rgba(255,255,255,0.68)',
              lineHeight: 1.7, maxWidth: '55ch',
            }}
          >
            BlackWater Marketing is a full-stack partner for e-commerce brands. Most agencies take one channel, run it, and hand everything around it back to you. We take on the whole growth side, so the ads, the funnel they point at, the creative that fills them, and the site that converts all get decided together. One partner accountable for the outcome instead of six vendors pointing at each other.
          </motion.p>
        </div>
      </FlowSection>

      {/* Method. Pulled out of the 2x2 grid and the GSAP logo zoom on
          Aug 27 2026: it is a stack of cards that pin and compress as you
          scroll. Black ground, white cards. */}
      <FlowSection
        id="method"
        aria-label="The Method"
        style={{ background: '#000000', color: '#ffffff', padding: 0 }}
      >
        <div style={{ padding: 'clamp(4rem, 9vw, 7rem) 0 0' }}>
          {/* The orange tile mark was removed Aug 27 2026. Jack is reworking
              the brand kit; until an accent colour is chosen the site is
              black, white and greys only, and that mark was the single
              saturated element left on the page. */}
          <div style={{
            padding: '0 clamp(1.25rem, 5vw, 4rem)', marginBottom: '1.5rem',
          }}>
            <motion.p
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut }} viewport={viewport}
              style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 600, margin: 0 }}
            >
              How We Work
            </motion.p>
          </div>

          <ScrollStack
            useWindowScroll
            itemDistance={90}
            itemStackDistance={26}
            stackPosition="22%"
            scaleEndPosition="12%"
            baseScale={0.88}
            itemScale={0.025}
            /* Blur off. An animated filter: blur() on four full-width white
               cards is recomposited every frame while scrolling, which is a
               real cost for a very subtle depth cue. Set it back to ~0.6 if
               the stack ever feels too flat. */
            blurAmount={0}
          >
            {pillars.map((p) => (
              <ScrollStackItem key={p.num} itemClassName="scroll-stack-card--light">
                <p className="ss-num">{p.num}</p>
                <h3 className="ss-title">{p.title}</h3>
                <p className="ss-desc">{p.desc}</p>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </FlowSection>
    </FlowArt>
  )
}
