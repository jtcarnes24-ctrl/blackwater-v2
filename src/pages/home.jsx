import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { HeroSection } from '../components/HeroSection'
import { ResultsSection } from '../components/ResultsSection'
import { ServicesSection } from '../components/ServicesSection'
import { FlowGroup1 } from '../components/FlowGroup1'
import { ProofSection } from '../components/ProofSection'
import { FlowGroup2 } from '../components/FlowGroup2'
import { FounderSection } from '../components/FounderSection'
import { FAQSection } from '../components/FAQSection'
import { ContactSection } from '../components/ContactSection'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout showPreloader>
      <HeroSection />
      <ResultsSection />
      <ServicesSection />
      <FlowGroup1 />
      <ProofSection />
      <FlowGroup2 />
      <FounderSection />
      <FAQSection />
      <ContactSection />
    </Layout>
  </StrictMode>
)
