import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { ScrollContext } from './ScrollContext'
import { reducedMotion } from './hooks/useMedia'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import About from './components/About'
import Offstage from './components/Offstage'
import Experience from './components/Experience'
import Work from './components/Work'
import Stack from './components/Stack'
import Contact from './components/Contact'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const lenisRef = useRef(null)

  // Always start at the top so the intro choreography lines up
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  // Smooth scrolling (skipped for reduced-motion users)
  useEffect(() => {
    if (reducedMotion()) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Lock scroll behind the preloader, refresh triggers once revealed
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', !loaded)
    if (loaded) {
      lenisRef.current?.start()
      requestAnimationFrame(() => ScrollTrigger.refresh())
    } else {
      lenisRef.current?.stop()
    }
  }, [loaded])

  const scrollTo = useCallback((target) => {
    const lenis = lenisRef.current
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.4, offset: typeof target === 'string' ? -8 : 0 })
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' })
    } else {
      document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <ScrollContext.Provider value={scrollTo}>
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <Preloader onReveal={() => setLoaded(true)} />
      <Navbar loaded={loaded} />
      <main>
        <Hero loaded={loaded} />
        <Marquee />
        <About />
        <Experience />
        <Work />
        <Stack />
        <Offstage />
        <Contact />
      </main>
      <Footer />
    </ScrollContext.Provider>
  )
}
