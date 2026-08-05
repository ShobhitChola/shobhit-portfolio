import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { NAV, LINKS } from '../content'
import { useScrollTo } from '../ScrollContext'
import { useISTTime } from '../hooks/useClock'

gsap.registerPlugin(ScrollTrigger)

export default function Navbar({ loaded }) {
  const navRef = useRef(null)
  const [open, setOpen] = useState(false)
  const scrollTo = useScrollTo()
  const time = useISTTime()

  // Intro drop-in once the preloader lifts
  useEffect(() => {
    if (!loaded) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.nav-item',
        { y: -18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.06, delay: 0.35 }
      )
    }, navRef)
    return () => ctx.revert()
  }, [loaded])

  // Hide on scroll down, show on scroll up, glass once scrolled
  useEffect(() => {
    const nav = navRef.current
    let hidden = false
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll()
        nav.classList.toggle('is-scrolled', y > 40)
        const shouldHide = y > 160 && self.direction === 1
        if (shouldHide !== hidden) {
          hidden = shouldHide
          gsap.to(nav, { yPercent: hidden ? -110 : 0, duration: 0.45, ease: 'power3.out' })
        }
      },
    })
    return () => st.kill()
  }, [])

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    return () => document.documentElement.classList.remove('menu-open')
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (e, href) => {
    e.preventDefault()
    setOpen(false)
    // let the overlay start closing before the scroll kicks in
    setTimeout(() => scrollTo(href), open ? 250 : 0)
  }

  return (
    <>
      <header className="nav" ref={navRef}>
        <a
          className="nav-logo nav-item"
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            setOpen(false)
            scrollTo(0)
          }}
        >
          SHOBHIT<span className="accent">©</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {NAV.map((l) => (
            <a key={l.href} className="nav-link nav-item" href={l.href} onClick={(e) => go(e, l.href)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-right">
          <span className="nav-time nav-item" aria-hidden="true">
            NEW DELHI · {time} IST
          </span>
          <a
            className="nav-resume nav-item"
            href={LINKS.resume}
            target="_blank"
            rel="noreferrer"
          >
            Resume ↗
          </a>
          <button
            className={`nav-burger nav-item ${open ? 'is-open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <button className="menu-close" aria-label="Close menu" onClick={() => setOpen(false)}>
          ✕
        </button>
        <nav className="menu-links" aria-label="Mobile">
          {NAV.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className="menu-link"
              style={{ transitionDelay: open ? `${0.08 + i * 0.05}s` : '0s' }}
              onClick={(e) => go(e, l.href)}
            >
              <span className="menu-idx">0{i + 1}</span>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="menu-foot">
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a href={LINKS.leetcode} target="_blank" rel="noreferrer">
            LeetCode ↗
          </a>
          <a href={LINKS.resume} target="_blank" rel="noreferrer">
            Resume ↗
          </a>
        </div>
      </div>
    </>
  )
}
