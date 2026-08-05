import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Magnetic from './Magnetic'
import { Chars } from './SplitText'
import { LINKS } from '../content'
import { reducedMotion } from '../hooks/useMedia'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const scope = useRef(null)

  useEffect(() => {
    const reduced = reducedMotion()
    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo(
          '.contact-title .split-char',
          { yPercent: 120 },
          {
            yPercent: 0,
            duration: 1.05,
            ease: 'power4.out',
            stagger: 0.022,
            scrollTrigger: { trigger: '.contact-title', start: 'top 82%' },
          }
        )
      }
      gsap.fromTo(
        '.contact-fade',
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: '.contact-title', start: 'top 75%' },
        }
      )

      // slow drifting backdrop text
      if (!reducedMotion()) {
        gsap.to('.contact-bg-track', {
          xPercent: -50,
          ease: 'none',
          duration: 40,
          repeat: -1,
        })
      }
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section className="contact section" id="contact" ref={scope}>
      <div className="contact-orb" aria-hidden="true" />
      <div className="contact-bg" aria-hidden="true">
        <div className="contact-bg-track">
          <span>GET IN TOUCH ✦ GET IN TOUCH ✦ GET IN TOUCH ✦ GET IN TOUCH ✦ </span>
          <span>GET IN TOUCH ✦ GET IN TOUCH ✦ GET IN TOUCH ✦ GET IN TOUCH ✦ </span>
        </div>
      </div>

      <div className="container contact-inner">
        <p className="contact-tag contact-fade">
          <span className="accent">06</span> / CONTACT
        </p>

        <h2 className="contact-title">
          <span className="contact-line">
            <Chars text="LET'S BUILD" />
          </span>
          <span className="contact-line contact-line--accent">
            <Chars text="SOMETHING WILD" />
          </span>
        </h2>

        <p className="contact-note contact-fade">
          Internships, SDE roles, GenAI experiments, or a wall of unread Kafka logs:{' '}
          <span className="serif-it">my inbox is open.</span>
        </p>

        <div className="contact-actions contact-fade">
          <Magnetic strength={0.3}>
            <a className="btn btn--solid" href={`mailto:${LINKS.email}`} data-cursor="SAY HI">
              Email me
            </a>
          </Magnetic>
          <Magnetic strength={0.3}>
            <a className="btn btn--ghost" href={LINKS.resume} target="_blank" rel="noreferrer">
              Resume ↗
            </a>
          </Magnetic>
        </div>

        <div className="contact-links contact-fade">
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            GITHUB ↗
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
            LINKEDIN ↗
          </a>
          <a href={LINKS.leetcode} target="_blank" rel="noreferrer">
            LEETCODE ↗
          </a>
          <a href={LINKS.phoneHref}>{LINKS.phone}</a>
        </div>
      </div>
    </section>
  )
}
