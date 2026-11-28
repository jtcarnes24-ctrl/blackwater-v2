import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { PageHero } from '../components/pages/PageHero'
import { PAGE_HEROES } from '../lib/pageHeroes'
import { ContactSection } from '../components/ContactSection'
import { FAQSection } from '../components/FAQSection'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <PageHero {...PAGE_HEROES.contact} />
      <ContactSection />
      <FAQSection />
    </Layout>
  </StrictMode>
)
