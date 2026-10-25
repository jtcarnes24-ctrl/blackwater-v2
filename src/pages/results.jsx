import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ResultsHero } from '../components/pages/ResultsHero'
import { ResultsSection } from '../components/ResultsSection'
import { ProofSection } from '../components/ProofSection'
import { FlowGroup2 } from '../components/FlowGroup2'
import { ContactSection } from '../components/ContactSection'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ResultsHero
        title="Results That"
        emph="speak."
        sub="Real accounts and real outcomes. Every figure below comes from work we actually ran."
      />
      <ResultsSection heading={false} dark />
      <ProofSection />
      <FlowGroup2 />
      <ContactSection />
    </Layout>
  </StrictMode>
)
