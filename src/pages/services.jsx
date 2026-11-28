import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { PageHero } from '../components/pages/PageHero'
import { PAGE_HEROES } from '../lib/pageHeroes'
import { ServicesGrid } from '../components/pages/ServicesGrid'
import { ContactSection } from '../components/ContactSection'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <PageHero {...PAGE_HEROES.services} />
      <ServicesGrid headingLevel="h2" />
      <ContactSection />
    </Layout>
  </StrictMode>
)
