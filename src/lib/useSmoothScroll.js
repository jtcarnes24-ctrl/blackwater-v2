import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Lenis rides GSAP's ticker so ScrollTrigger pins and scrubs update in the
 * same frame as the smoothed scroll position. Lifted out of App.jsx so every
 * page entry gets identical scroll behaviour.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    // Exposed so Nav can drive smooth anchor scrolling through the same
    // instance — native scrollIntoView gets overridden by Lenis every frame
    window.__lenis = lenis
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])
}
