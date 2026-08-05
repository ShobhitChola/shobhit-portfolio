import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from './SectionHead'
import { PROJECTS } from '../content'
import { hoverCapable } from '../hooks/useMedia'

gsap.registerPlugin(ScrollTrigger)

export default function Work() {
  const scope = useRef(null)
  const floatRef = useRef(null)
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.work-row').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 54, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        )
      })
      // drop the hover card when the section scrolls out from under the cursor
      ScrollTrigger.create({
        trigger: scope.current,
        start: 'top bottom',
        end: 'bottom top',
        onLeave: () => setActiveId(null),
        onLeaveBack: () => setActiveId(null),
      })
    }, scope)
    return () => ctx.revert()
  }, [])

  // Floating preview chases the cursor (desktop only)
  useEffect(() => {
    if (!hoverCapable()) return
    const float = floatRef.current
    const list = scope.current
    // hover card floats up-right of the pointer
    gsap.set(float, { xPercent: 7, yPercent: -110 })
    const xTo = gsap.quickTo(float, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(float, 'y', { duration: 0.5, ease: 'power3' })
    const move = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    list.addEventListener('mousemove', move, { passive: true })
    return () => list.removeEventListener('mousemove', move)
  }, [])

  useEffect(() => {
    if (!hoverCapable()) return
    gsap.to(floatRef.current, {
      autoAlpha: activeId ? 1 : 0,
      scale: activeId ? 1 : 0.75,
      rotate: activeId ? -4 : 6,
      duration: 0.45,
      ease: 'power3.out',
    })
  }, [activeId])

  const rowInner = (p) => (
    <>
      <span className="work-idx">{p.index}</span>
      <span className="work-main">
        <span className="work-title">{p.title}</span>
        <span className="work-sub">{p.subtitle}</span>
        <span className="work-desc">{p.desc}</span>
        <span className="work-tags">
          {p.tags.map((t) => (
            <span className="work-tag" key={t}>
              {t}
            </span>
          ))}
        </span>
      </span>
      <span className="work-side">
        <span className="work-year">{p.year}</span>
        <span className="work-label">{p.linkLabel}</span>
        <span className="work-arrow" aria-hidden="true">
          ↗
        </span>
      </span>
    </>
  )

  return (
    <section className="work section" id="work" ref={scope}>
      <div className="container">
        <SectionHead index="03" tag="SELECTED WORK" title="THINGS I'VE BUILT" />

        <div className="work-list" onMouseLeave={() => setActiveId(null)}>
          {PROJECTS.map((p) =>
            p.link ? (
              <a
                key={p.id}
                className="work-row"
                href={p.link}
                target="_blank"
                rel="noreferrer"
                data-cursor="OPEN"
                onMouseEnter={() => setActiveId(p.id)}
                onFocus={() => setActiveId(p.id)}
              >
                {rowInner(p)}
              </a>
            ) : (
              <div
                key={p.id}
                className="work-row"
                data-cursor="VIEW"
                onMouseEnter={() => setActiveId(p.id)}
              >
                {rowInner(p)}
              </div>
            )
          )}
        </div>
      </div>

      <div className="work-float" ref={floatRef} aria-hidden="true">
        {PROJECTS.map((p) => (
          <div
            key={p.id}
            className={`work-card ${activeId === p.id ? 'is-active' : ''}`}
            style={{ backgroundImage: p.gradient }}
          >
            <span className="work-card-mono">{p.monogram}</span>
            <span className="work-card-chip">
              {p.title} · {p.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
