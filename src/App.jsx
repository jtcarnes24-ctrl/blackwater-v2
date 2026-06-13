import { Nav } from './components/Nav'
import { HeroSection } from './components/HeroSection'
import { FlowGroup1 } from './components/FlowGroup1'
import { ServicesSection } from './components/ServicesSection'
import { ResultsSection } from './components/ResultsSection'
import { FlowGroup2 } from './components/FlowGroup2'
import { ContactSection } from './components/ContactSection'

function App() {
  return (
    <>
      <Nav />
      <main style={{ background: '#080808' }}>
        <HeroSection />
        <FlowGroup1 />
        <ServicesSection />
        <ResultsSection />
        <FlowGroup2 />
        <ContactSection />
      </main>
    </>
  )
}

export default App
