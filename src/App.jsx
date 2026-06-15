import { lazy, Suspense } from 'react'
import { Nav } from './components/Nav'
import { HeroSection } from './components/HeroSection'
import { FlowGroup1 } from './components/FlowGroup1'

// Everything below the fold loads on demand
const ServicesSection    = lazy(() => import('./components/ServicesSection').then(m => ({ default: m.ServicesSection })))
const ResultsSection     = lazy(() => import('./components/ResultsSection').then(m => ({ default: m.ResultsSection })))
const MarqueeSection     = lazy(() => import('./components/MarqueeSection').then(m => ({ default: m.MarqueeSection })))
const ProofSection       = lazy(() => import('./components/ProofSection').then(m => ({ default: m.ProofSection })))
const TestimonialsSection = lazy(() => import('./components/TestimonialsSection').then(m => ({ default: m.TestimonialsSection })))
const FlowGroup2         = lazy(() => import('./components/FlowGroup2').then(m => ({ default: m.FlowGroup2 })))
const FounderSection     = lazy(() => import('./components/FounderSection').then(m => ({ default: m.FounderSection })))
const ContactSection     = lazy(() => import('./components/ContactSection').then(m => ({ default: m.ContactSection })))

function App() {
  return (
    <>
      <Nav />
      <main style={{ background: '#080808' }}>
        <HeroSection />
        <FlowGroup1 />
        <Suspense fallback={null}>
          <ServicesSection />
          <ResultsSection />
          <MarqueeSection />
          <ProofSection />
          <TestimonialsSection />
          <FlowGroup2 />
          <FounderSection />
          <ContactSection />
        </Suspense>
      </main>
    </>
  )
}

export default App
