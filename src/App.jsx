import { lazy, Suspense, useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Nav } from './components/Nav'

gsap.registerPlugin(ScrollTrigger)
import { HeroSection } from './components/HeroSection'
import { FlowGroup1 } from './components/FlowGroup1'
import { Marquee } from './components/Marquee'

// Everything below the fold loads on demand
const ServicesSection    = lazy(() => import('./components/ServicesSection').then(m => ({ default: m.ServicesSection })))
const ResultsSection     = lazy(() => import('./components/ResultsSection').then(m => ({ default: m.ResultsSection })))
const MarqueeSection     = lazy(() => import('./components/MarqueeSection').then(m => ({ default: m.MarqueeSection })))
const ProofSection       = lazy(() => import('./components/ProofSection').then(m => ({ default: m.ProofSection })))
const FlowGroup2         = lazy(() => import('./components/FlowGroup2').then(m => ({ default: m.FlowGroup2 })))
const FounderSection     = lazy(() => import('./components/FounderSection').then(m => ({ default: m.FounderSection })))
const ContactSection     = lazy(() => import('./components/ContactSection').then(m => ({ default: m.ContactSection })))

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    // Single animation loop: Lenis rides GSAP's ticker so ScrollTrigger
    // pins/scrubs update in the same frame as the smoothed scroll position
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    // Exposed so Nav can drive smooth anchor scrolling through the same
    // instance — native scrollIntoView gets overridden by Lenis every frame
    window.__lenis = lenis
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  return (
    <>
      <div className="noise" />
      <Nav />
      <main style={{ background: '#080808' }}>
        <Marquee />
        <HeroSection />
        <FlowGroup1 />
        <Suspense fallback={null}>
          <ServicesSection />
          <ResultsSection />
          <MarqueeSection />
          <ProofSection />
          <FlowGroup2 />
          <FounderSection />
          <ContactSection />
        </Suspense>
      </main>
    </>
  )
}

export default App
