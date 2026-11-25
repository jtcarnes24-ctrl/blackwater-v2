import { motion } from 'framer-motion'
import FlowArt, { FlowSection } from './ui/FlowArt'
import { easeOut, viewport } from '../lib/animations'
import { StaggeredText } from './ui/StaggeredText'
import ScrollStack, { ScrollStackItem } from './ui/ScrollStack/ScrollStack'

const pillars = [
  { num: '01', title: 'One Tested Playbook', desc: 'We studied what the best brands do and kept only what works. Every account runs on the same proven steps, so good results can be repeated, not lucky.' },
  { num: '02', title: 'Ads For People Ready To Buy', desc: 'Most agencies guess at interests and hope. We use real buying data to find people already shopping for what you sell, then reach more people like them.' },
  { num: '03', title: 'Creators Film Your Ads', desc: 'Winning takes a lot of ads, and that takes real people on camera. Our network of creators makes new videos as fast as we need them. You never have to film.' },
  /* Fourth pillar written to complete the 2x2 grid. Describes the testing
     cadence Jack already runs; confirm the wording before it stays. */
  { num: '04', title: 'New Ads Every Week', desc: 'We test new ads every week. Winners get more money and ads that stop working get turned off. You get your numbers twice a week, so you always know what changed.' },
]

export function FlowGroup1() {
  return (
    <FlowArt aria-label="About and Method">
      {/* About */}
      <FlowSection
        id="about"
        aria-label="About us"
        style={{ background: '#080808', color: '#ffffff' }}
      >
        {/* A real box, not display:contents. useScroll measures the target's
            rect, and an element with no box always reports zero, which left
            the reveal frozen. This reproduces the flow container's own column
            layout so nothing shifts. */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          gap: '1.5rem', flex: 1, width: '100%',
        }}>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {[
              { text: 'WE HELP', delay: 0 },
              { text: 'ONLINE BRANDS', delay: 0.26 },
              { text: 'SELL MORE', delay: 0.52, emph: 'more' },
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
            BlackWater Marketing is a growth partner for e-commerce brands. Most agencies run one thing, like your ads, and leave the rest to you. We handle all of it: the ads, the videos in them, the pages they send people to, and the emails after. One team owns the results, instead of six companies blaming each other.
          </motion.p>
        </div>
      </FlowSection>

      {/* Method. Pulled out of the 2x2 grid and the GSAP logo zoom on
          Aug 27 2026: it is a stack of cards that pin and compress as you
          scroll. Black ground, white cards. */}
      <FlowSection
        id="method"
        aria-label="The Method"
        style={{ background: '#080808', color: '#ffffff', padding: 0 }}
      >
        <div style={{ padding: 'clamp(4rem, 9vw, 7rem) 0 0' }}>

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
