import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { HeroSection } from '../components/HeroSection'
import { ResultsSection } from '../components/ResultsSection'
import { ServicesSection } from '../components/ServicesSection'
import { FlowGroup1 } from '../components/FlowGroup1'
import { ProofSection } from '../components/ProofSection'
import { FounderLanyard } from '../components/FounderLanyard'
import { FAQSection } from '../components/FAQSection'
import { ContactSection } from '../components/ContactSection'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout showPreloader dark>
      <HeroSection />
      <ResultsSection dark />
      <ServicesSection />
      <FlowGroup1 />
      <ProofSection />
      <FounderLanyard />
      <FAQSection dark />
      <ContactSection />
    </Layout>
  </StrictMode>
)
