import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { PageHero } from '../components/pages/PageHero'
import { PAGE_HEROES } from '../lib/pageHeroes'
import { ResultsSection } from '../components/ResultsSection'
import { ProofSection } from '../components/ProofSection'
import { FlowGroup2 } from '../components/FlowGroup2'
import { ContactSection } from '../components/ContactSection'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <PageHero {...PAGE_HEROES.results} />
      <ResultsSection heading={false} dark />
      <ProofSection />
      <FlowGroup2 />
      <ContactSection />
    </Layout>
  </StrictMode>
)
