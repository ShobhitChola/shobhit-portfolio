import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// Counts to 100 while fonts load, then lifts the curtain.
// onReveal fires as the exit begins so the hero intro can overlap it.
export default function Preloader({ onReveal }) {
  const [gone, setGone] = useState(false)
  const rootRef = useRef(null)
  const innerRef = useRef(null)
  const countRef = useRef(null)
  const barRef = useRef(null)
  const firedRef = useRef(false)

  useEffect(() => {
    let alive = true
    const counter = { v: 0 }

    const fill = gsap.timeline().to(counter, {
      v: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (countRef.current)
          countRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
        if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`
      },
    })

    const fontsReady = Promise.race([
      document.fonts.ready,
      new Promise((r) => setTimeout(r, 2400)),
    ])
    const fillDone = new Promise((r) => fill.eventCallback('onComplete', r))

    Promise.all([fontsReady, fillDone]).then(() => {
      if (!alive) return
      if (!firedRef.current) {
        firedRef.current = true
        onReveal?.()
      }
      gsap
        .timeline({ onComplete: () => alive && setGone(true) })
        .to(innerRef.current, { yPercent: -30, autoAlpha: 0, duration: 0.45, ease: 'power3.in' })
        .to(rootRef.current, { yPercent: -100, duration: 0.85, ease: 'power4.inOut' }, 0.12)
    })

    // Absolute failsafe: never trap the site behind the loader.
    const failsafe = setTimeout(() => {
      if (!alive) return
      if (!firedRef.current) {
        firedRef.current = true
        onReveal?.()
      }
      setGone(true)
    }, 6000)

    return () => {
      alive = false
      fill.kill()
      clearTimeout(failsafe)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null

  return (
    <div className="preloader" ref={rootRef}>
      <div className="preloader-inner" ref={innerRef}>
        <p className="preloader-name">SHOBHIT CHOLA · PORTFOLIO ©2026</p>
        <p className="preloader-hint">
          calibrating <span className="serif-it">the particles</span>
        </p>
        <p className="preloader-count" ref={countRef}>
          000
        </p>
      </div>
      <div className="preloader-bar" ref={barRef} />
    </div>
  )
}
