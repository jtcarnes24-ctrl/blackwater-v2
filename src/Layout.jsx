import { useEffect } from 'react'
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
export function Layout({ children, showPreloader = false, dark = false }) {
  useSmoothScroll()
  // A dark page has to be dark all the way down, or the header's
  // surface sampling can catch the white body between sections.
  useEffect(() => {
    if (!dark) return
    const prev = document.body.style.background
    document.body.style.background = '#080808'
    return () => { document.body.style.background = prev }
  }, [dark])
  return (
    <ApplyProvider>
      {showPreloader && <Preloader />}
      <Nav />
      <main style={{ background: dark ? '#080808' : '#ffffff' }}>{children}</main>
      <Footer />
    </ApplyProvider>
  )
}
