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
        eyebrow="[ Get In Touch ]"
        title="Tell Us About Your"
        emph="brand."
        sub="Apply below. We will tell you honestly whether we are the right fit, and what we would do first."
      />
      <ContactSection />
      <FAQSection />
    </Layout>
  </StrictMode>
)
