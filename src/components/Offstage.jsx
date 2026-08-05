import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from './SectionHead'
import { OFFSTAGE } from '../content'

gsap.registerPlugin(ScrollTrigger)

export default function Offstage() {
  const scope = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.offstage-fade',
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.95,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '.offstage-grid', start: 'top 85%' },
        }
      )
      gsap.fromTo(
        '.bass-wrap',
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.bass-wrap', start: 'top 88%' },
        }
      )
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section className="offstage section" id="offstage" ref={scope}>
      <div className="container">
        <SectionHead index="05" tag="OFFSTAGE" title="THE LOW END" />

        <div className="offstage-grid">
          <div className="offstage-fade">
            <p className="offstage-band">
              <span className="eq" aria-hidden="true">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} style={{ animationDelay: `${i * 0.11}s` }} />
                ))}
              </span>
              {OFFSTAGE.band}
            </p>
            <p className="offstage-copy">
              When the terminal closes, the amp turns on. I hold down the low end on bass for
              RudraDhwani, a fusion rock band.{' '}
              <span className="serif-it">All groove, no merge conflicts.</span>
            </p>
          </div>

          <div className="podium offstage-fade">
            {OFFSTAGE.podiums.map((p) => (
              <div className="podium-row" key={`${p.place}-${p.host}-${p.year}`}>
                <span className="podium-place">{p.place}</span>
                <span className="podium-event">
                  {p.event} · {p.host}
                  {p.year ? ` · ${p.year}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bass-wrap">
          <img
            className="bass-img"
            src="/bass.png"
            alt="Ibanez SR Prestige five-string bass guitar"
            width="1276"
            height="385"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
