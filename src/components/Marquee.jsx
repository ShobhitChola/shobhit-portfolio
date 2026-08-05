import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MARQUEE_ITEMS } from '../content'
import { reducedMotion } from '../hooks/useMedia'

gsap.registerPlugin(ScrollTrigger)

// Lime kinetic strip — speeds up and flips with scroll velocity.
export default function Marquee() {
  const trackRef = useRef(null)

  useEffect(() => {
    if (reducedMotion()) return
    const tween = gsap.to(trackRef.current, {
      xPercent: -33.3333,
      ease: 'none',
      duration: 22,
      repeat: -1,
    })
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const v = self.getVelocity()
        const boost = gsap.utils.clamp(1, 5, 1 + Math.abs(v) / 900)
        gsap.to(tween, {
          timeScale: v < -10 ? -boost : boost,
          duration: 0.4,
          overwrite: true,
        })
      },
    })
    return () => {
      st.kill()
      tween.kill()
    }
  }, [])

  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" ref={trackRef}>
        {row.map((item, i) => (
          <span className="marquee-item" key={i}>
            {item} <span className="marquee-star">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
