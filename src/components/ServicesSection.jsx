import { ServicesGrid } from './pages/ServicesGrid'

/**
 * Homepage services block.
 *
 * Renders the same bordered grid as the services page so the two cannot
 * drift apart, cut to the first six cards with a link through to the full
 * list. Replaced an AccordionGallery of seven flat slats, which showed one
 * description at a time and could not carry the orbs.
 */
export function ServicesSection() {
  return (
    <ServicesGrid
      headingLevel="h2"
      limit={6}
      title="Our"
      emph="services"
      lede="Ads, websites, emails and texts. One team does it all, so nothing gets missed between six different companies."
      footer={
        <a className="sg-viewall" href="/services/">
          View all services <span className="sg-arrow" aria-hidden="true">→</span>
        </a>
      }
    />
  )
}
