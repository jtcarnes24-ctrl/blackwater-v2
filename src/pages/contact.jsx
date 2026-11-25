import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../index.css'
import { Layout } from '../Layout'
import { PageHeader } from '../components/pages/PageHeader'
import { ContactSection } from '../components/ContactSection'
import { FAQSection } from '../components/FAQSection'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Layout>
      <PageHeader
        title="Tell Us About Your"
        emph="brand."
        sub="Apply below. We'll tell you honestly if we're the right fit, and what we'd do first."
      />
      <ContactSection />
      <FAQSection />
    </Layout>
  </StrictMode>
)
