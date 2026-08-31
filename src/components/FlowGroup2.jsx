import { motion } from 'framer-motion'
import { TestimonialColumns } from './ui/TestimonialColumns'
import FlowArt, { FlowSection } from './ui/FlowArt'
import { LiquidButton } from './ui/LiquidButton'
import { easeOut, easeInOut, viewport } from '../lib/animations'
import { useApply } from './ui/ApplyModal'

const testimonials = [
  { quote: "Jack and the team don't just run ads and disappear. They're constantly testing stuff, sending updates, and actually explaining what's working. It feels like having another team in our business instead of another agency.", name: 'Luca Moretti', role: '', image: '/testimonials/luca.webp' },
  { quote: "I've worked with agencies before and this was a completely different experience. The communication is fast, they're straight up about what's working, and our numbers have looked better every month since we started.", name: 'Priya Narayanan', role: '', image: '/testimonials/priya.webp' },
  { quote: "One thing I noticed right away was how much they actually cared about the outcome. They weren't just trying to spend our budget. Every change had a reason behind it and it paid off.", name: 'Mateo Álvarez', role: '', image: '/testimonials/mateo.webp' },
  { quote: "These guys are lowkey obsessed with improving everything. Every week there was something new being tested or optimized. It made me feel like our account was actually getting attention instead of being forgotten.", name: 'Zain Al-Haddad', role: '', image: '/testimonials/zain.webp' },
  { quote: "I was honestly skeptical because everyone says they can scale brands. BlackWater actually backed it up. We finally have a system that brings in sales consistently instead of random good weeks.", name: 'Anika Sørensen', role: '', image: '/testimonials/anika.webp' },
  { quote: "The response time is crazy. I don't think I've ever waited more than a couple hours for an answer. Having three people working together on our account definitely makes a difference.", name: 'Thiago Carvalho', role: '', image: '/testimonials/thiago.webp' },
  { quote: "I've never had an agency send this many ideas without me asking. New creatives, landing page feedback, ad angles, offers. They helped improve way more than just our Meta ads.", name: 'Sofia Petrovic', role: '', image: '/testimonials/sofia.webp' },
  { quote: "Probably the easiest agency we've worked with. No confusing reports or fluff. They just tell you what happened, what's changing next, and keep pushing to get better results. Love that.", name: "Kieran O'Donnell", role: '', image: '/testimonials/kieran.webp' },
  { quote: "Our CPA kept creeping up and we couldn't figure out why. BlackWater came in, cleaned everything up, and within a few weeks we were finally profitable again. Wish we found them sooner lol.", name: 'Nikolai Varga', role: '', image: '/testimonials/nikolai.webp' },
  { quote: "Shout out to the whole BlackWater crew. It never felt like one person trying to juggle everything. There was always someone available, ideas were flowing, and they treated our brand like it was their own.", name: 'Yara Ben Salem', role: '', image: '/testimonials/yara.webp' },
]

export function FlowGroup2() {
  const { openApply } = useApply()
  return (
    <FlowArt aria-label="Our system and testimonials">
      <FlowSection
        id="testimonials"
        aria-label="Client testimonials"
        style={{ background: '#ffffff', color: '#141414' }}
      >
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

        <TestimonialColumns testimonials={testimonials} />

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
