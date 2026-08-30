import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { ServicesGrid } from '../components/pages/ServicesGrid'
import { ContactSection } from '../components/ContactSection'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <ServicesGrid />
      <ContactSection />
    </Layout>
  </StrictMode>
)
