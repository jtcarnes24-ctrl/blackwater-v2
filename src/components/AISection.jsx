import { motion } from 'framer-motion'
import { SplineScene } from './ui/SplineScene'
import { AIChart } from './ui/AIChart'

export function AISection() {
  return (
    <section
      id="ai"
      style={{
        background: '#080808',
        padding: '0',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ display: 'flex', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Left — copy */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true }}
          style={{
            flex: 1,
            padding: 'clamp(3rem, 8vw, 7rem) clamp(2rem, 5vw, 5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem', fontWeight: 600 }}>
            AI-Powered Advertising
          </p>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '1.5rem' }}>
            We don't just run ads.
            <br />
            <span style={{ color: '#f2ede4' }}>We engineer them.</span>
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '420px', marginBottom: '2rem' }}>
            Every campaign at BlackWater is powered by AI-driven creative analysis, audience modeling, and real-time budget optimization — so your ad spend works harder than the competition's.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ marginBottom: '2rem' }}>
              <AIChart />
            </div>

            {[
              { label: 'Creative Intelligence', desc: 'AI analyzes hooks, copy, and visuals to predict performance before launch.' },
              { label: 'Audience Modeling', desc: 'Machine learning clusters your best buyers and finds more like them at scale.' },
              { label: 'Real-Time Optimization', desc: 'Automated rules kill losers and scale winners 24/7 — no manual babysitting.' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * i }}
                viewport={{ once: true }}
                style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}
              >
                <div style={{ width: '6px', height: '6px', background: '#f2ede4', borderRadius: '50%', marginTop: '0.55rem', flexShrink: 0 }} />
                <div>
                  <p style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{item.label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.88rem', lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — 3D robot */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
          style={{ flex: 1, minHeight: '600px', position: 'relative' }}
          onWheel={e => e.stopPropagation()}
        >
          <div
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            onWheel={e => e.stopPropagation()}
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
