import { ApplyProvider } from './components/ui/ApplyModal'
import { Preloader } from './components/ui/Preloader'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { useSmoothScroll } from './lib/useSmoothScroll'

/**
 * Shared shell for every page entry.
 *
 * showPreloader is false by default: the preloader is a first-impression
 * device for the landing page. Firing it on every navigation in a multi-page
 * build would put a curtain between the visitor and the content they just
 * clicked through to.
 */
export function Layout({ children, showPreloader = false }) {
  useSmoothScroll()
  return (
    <ApplyProvider>
      {showPreloader && <Preloader />}
      <Nav />
      <main style={{ background: '#ffffff' }}>{children}</main>
      <Footer />
    </ApplyProvider>
  )
}
