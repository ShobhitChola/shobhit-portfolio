import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Chars } from './SplitText'
import { reducedMotion } from '../hooks/useMedia'

gsap.registerPlugin(ScrollTrigger)

export default function SectionHead({ index, tag, title, note }) {
  const ref = useRef(null)

  useEffect(() => {
    if (reducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.shead-tag',
        { y: 14, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 88%' },
        }
      )
      if (title) {
        gsap.fromTo(
          '.shead-title .split-char',
          { yPercent: 120 },
          {
            yPercent: 0,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.02,
            scrollTrigger: { trigger: ref.current, start: 'top 85%' },
          }
        )
      }
      if (note) {
        gsap.fromTo(
          '.shead-note',
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.9,
            delay: 0.3,
            ease: 'power2.out',
            scrollTrigger: { trigger: ref.current, start: 'top 85%' },
          }
        )
      }
    }, ref)
    return () => ctx.revert()
  }, [note, title])

  return (
    <div className="shead" ref={ref}>
      <div>
        <p className="shead-tag">
          <span className="accent">{index}</span> / {tag}
        </p>
        {title && (
          <h2 className="shead-title">
            <Chars text={title} />
          </h2>
        )}
      </div>
      {note && <p className="shead-note">{note}</p>}
    </div>
  )
}
