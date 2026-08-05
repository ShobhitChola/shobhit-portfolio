import { lazy, Suspense, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Chars } from './SplitText'
import { reducedMotion } from '../hooks/useMedia'

const HeroScene = lazy(() => import('../three/HeroScene'))

gsap.registerPlugin(ScrollTrigger)

export default function Hero({ loaded }) {
  const scope = useRef(null)
  const scatterRef = useRef(0)

  // Intro choreography, runs when the preloader starts lifting
  useEffect(() => {
    if (!loaded) return
    const reduced = reducedMotion()
    const title = scope.current?.querySelector('.hero-title')
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.hero .split-char, .hero-eyebrow, .hero-sub, .hero-scroll', {
          clearProps: 'all',
          opacity: 1,
          yPercent: 0,
        })
        title?.classList.add('is-live')
        return
      }
      gsap
        .timeline({
          defaults: { ease: 'power4.out' },
          // hand transforms back to CSS so per-letter hover styles can kick in
          onComplete: () => {
            gsap.set('.hero-title .split-char', { clearProps: 'transform' })
            title?.classList.add('is-live')
          },
        })
        .fromTo(
          '.hero-title .split-char',
          { yPercent: 120 },
          { yPercent: 0, duration: 1.25, stagger: 0.032 }
        )
        .fromTo(
          '.hero-eyebrow',
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9 },
          0.45
        )
        .fromTo(
          '.hero-sub > *',
          { y: 30, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.09 },
          0.6
        )
        .fromTo('.hero-scroll', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9 }, 1)
    }, scope)
    return () => ctx.revert()
  }, [loaded])

  // Scroll-out: particles scatter, content parallaxes away
  useEffect(() => {
    const reduced = reducedMotion()
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: scope.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          scatterRef.current = reduced ? 0 : self.progress
        },
      })
      if (!reduced) {
        gsap.to('.hero-inner, .hero-scroll', {
          yPercent: -14,
          autoAlpha: 0.15,
          ease: 'none',
          scrollTrigger: {
            trigger: scope.current,
            start: 'top top',
            end: 'bottom 25%',
            scrub: true,
          },
        })
      }
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="top" ref={scope}>
      <Suspense fallback={<div className="hero-canvas" aria-hidden="true" />}>
        <HeroScene scatterRef={scatterRef} on={loaded} />
      </Suspense>
      <div className="hero-tint" aria-hidden="true" />

      <div className="hero-inner container">
        <p className="hero-eyebrow">
          <span className="pulse-dot" aria-hidden="true" />
          OPEN TO SDE / GENAI ROLES · CLASS OF '27
        </p>

        <h1 className="hero-title">
          <span className="hero-line hero-line--solid">
            <Chars text="SHOBHIT" />
          </span>
          <span className="hero-line hero-line--outline">
            <Chars text="CHOLA" />
            <span className="hero-star" aria-hidden="true">
              ✦
            </span>
          </span>
        </h1>

        <div className="hero-sub">
          <p className="hero-role">
            Software Engineer · GenAI &amp; Full-Stack.
            <br />
            <span className="serif-it">building intelligent systems that ship.</span>
          </p>
        </div>
      </div>

      <p className="hero-scroll" aria-hidden="true">
        SCROLL
        <span className="hero-scroll-line" />
      </p>
    </section>
  )
}
