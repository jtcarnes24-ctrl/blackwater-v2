import { motion } from 'framer-motion'
import { clipReveal, staggerContainer, easeOut, easeInOut, viewport } from '../lib/animations'
import { LiquidButton } from './ui/LiquidButton'
import { useApply } from './ui/ApplyModal'
import AccordionGallery from './ui/AccordionGallery/AccordionGallery'

/* Meta Ads and TikTok Ads used to be two separate line items. They were the
   same sale described twice, so they are one "Paid Ads" card now, with
   Google folded in alongside them. */
const services = [
  { label: 'Paid Ads',                       desc: 'Meta, TikTok, and Google run as one budget instead of three disconnected accounts. Built to convert, optimized to grow, and reported on so you always know which platform is carrying the month.' },
  { label: 'Funnel Creation & Optimization', desc: 'We build and optimize the full customer journey, from ad click to checkout. Every step is structured to reduce drop-off and increase revenue.' },
  { label: 'Ad Creative Generation',         desc: 'Scroll-stopping creatives and ad concepts built to improve engagement, lower acquisition costs, and drive results that show in the numbers.' },
  { label: 'Email & SMS Marketing',          desc: 'Retention campaigns that keep your customers coming back. Automated flows and broadcast campaigns built to generate revenue between ad pushes.' },
  { label: 'B2B Marketing & CRM',            desc: 'Full-service CRM setup and automation for targeted email campaigns. We reach your ideal prospects, build the sequences, and drive revenue from the top of the funnel down.' },
  { label: 'Conversion Optimization',        desc: 'Landing pages, offers, and post-click experiences refined to turn traffic into revenue and push your ROAS higher.' },
  { label: 'Web Design',                     desc: 'Modern, high-converting websites built around your brand, designed to look the part and close the deal.' },
]

export function ServicesSection() {
  const { openApply } = useApply()

  return (
    <section id="services" style={{ background: '#ffffff', padding: 'clamp(5rem, 12vw, 10rem) clamp(1.5rem, 8vw, 7rem)' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
        <motion.div variants={staggerContainer(0.08)} initial="hidden" whileInView="show" viewport={viewport}>
          {['OUR', <span className="emph">services</span>].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <motion.h2
                variants={clipReveal}
                transition={{ duration: 0.8, ease: easeInOut, delay: i * 0.08 }}
                style={{ fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.92, color: '#141414', textTransform: 'uppercase', margin: 0 }}
              >
                {line}
              </motion.h2>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: easeOut }} viewport={viewport}>
          <LiquidButton
            onClick={openApply}
            variant="light"
            style={{ color: '#141414', borderColor: '#141414' }}
          >
            Apply Now
          </LiquidButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: easeOut }}
        viewport={viewport}
      >
        {/* No images on these panels, so grayscale/parallax have nothing to
            act on and are switched off. tilt stays: it is what keeps seven
            flat black slats from reading as a barcode.

            expandRatio 0.58 rather than the demo's 0.52 because seven items
            leave the open panel narrower than the demo's five, and the
            description needs the width to stay on a readable measure. */}
        <AccordionGallery
          items={services}
          defaultIndex={0}
          expandRatio={0.58}
          trigger="hover"
          height={400}
          gap={10}
          radius={18}
          tilt={5}
          parallax={0}
          grayscale={false}
          accentColor="#ffffff"
          textColor="#ffffff"
        />
      </motion.div>
    </section>
  )
}
