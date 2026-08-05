import { Fragment, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from './SectionHead'
import { STACK } from '../content'
import { reducedMotion } from '../hooks/useMedia'

gsap.registerPlugin(ScrollTrigger)

// Kinetic ghost-type bands: each group drifts as outlined display
// type (echoing the hero's outlined line). Hover a band to slow it
// and fill the words; hover a word to ignite it.
export default function Stack() {
  const scope = useRef(null)

  useEffect(() => {
    const reduced = reducedMotion()
    const listeners = []
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.skill-band').forEach((band, i) => {
        gsap.fromTo(
          band,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: band, start: 'top 92%' },
          }
        )

        if (reduced) return
        const track = band.querySelector('.skill-track')
        const duration = [52, 44, 58, 47][i % 4]
        const tween =
          i % 2 === 0
            ? gsap.to(track, { xPercent: -33.3333, ease: 'none', duration, repeat: -1 })
            : gsap.fromTo(
                track,
                { xPercent: -33.3333 },
                { xPercent: 0, ease: 'none', duration, repeat: -1 }
              )

        const slow = () => gsap.to(tween, { timeScale: 0.15, duration: 0.5, overwrite: true })
        const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.5, overwrite: true })
        band.addEventListener('mouseenter', slow)
        band.addEventListener('mouseleave', resume)
        listeners.push([band, slow, resume])
      })
    }, scope)
    return () => {
      listeners.forEach(([band, slow, resume]) => {
        band.removeEventListener('mouseenter', slow)
        band.removeEventListener('mouseleave', resume)
      })
      ctx.revert()
    }
  }, [])

  return (
    <section className="stack section" id="stack" ref={scope}>
      <div className="container">
        <SectionHead index="04" tag="STACK" title="THE ARSENAL" />
      </div>

      <div className="stack-index">
        {STACK.map((group) => (
          <div className="skill-band" key={group.group}>
            <div className="container">
              <p className="skill-band-label">{group.group}</p>
            </div>
            <div className="skill-viewport">
              <div className="skill-track">
                {[0, 1, 2].map((copy) => (
                  <Fragment key={copy}>
                    {group.items.map((item) => (
                      <Fragment key={`${copy}-${item}`}>
                        <span className="skill-item" aria-hidden={copy > 0}>
                          {item}
                        </span>
                        <span className="skill-star" aria-hidden="true">
                          ✦
                        </span>
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
