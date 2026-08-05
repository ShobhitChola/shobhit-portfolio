import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from './SectionHead'
import { ABOUT_STATEMENT, SNAPSHOT, STATS } from '../content'

gsap.registerPlugin(ScrollTrigger)

// *word* → accent, ~word~ → serif italic
function parseStatement(src) {
  const words = src.split(' ')
  const out = []
  let mode = null
  for (const raw of words) {
    let m = mode
    if (!m && (raw.startsWith('*') || raw.startsWith('~'))) {
      m = raw[0] === '*' ? 'accent' : 'serif'
    }
    const marker = m === 'accent' ? '*' : '~'
    let text = raw
    if (m && !mode) text = text.slice(1)
    let closes = false
    if (m && text.endsWith(marker)) {
      closes = true
      text = text.slice(0, -1)
    }
    out.push({ text, mode: m })
    mode = m && !closes ? m : null
  }
  return out
}

export default function About() {
  const scope = useRef(null)
  const words = useMemo(() => parseStatement(ABOUT_STATEMENT), [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // word-by-word ink-in, scrubbed to scroll
      gsap.to('.about-statement .w', {
        opacity: 1,
        duration: 1,
        stagger: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.about-statement',
          start: 'top 80%',
          end: 'bottom 45%',
          scrub: true,
        },
      })

      gsap.fromTo(
        '.about-aside',
        { y: 44, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.about-aside', start: 'top 85%' },
        }
      )

      // stat counters
      gsap.utils.toArray('.stat').forEach((el) => {
        const num = el.querySelector('.stat-num')
        const value = parseFloat(num.dataset.value)
        const decimals = parseInt(num.dataset.decimals || '0', 10)
        const suffix = num.dataset.suffix || ''
        const obj = { v: 0 }
        gsap.fromTo(
          el,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          }
        )
        gsap.to(obj, {
          v: value,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          onUpdate: () => {
            num.textContent = obj.v.toFixed(decimals) + suffix
          },
        })
      })
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section className="about section" id="about" ref={scope}>
      <div className="container">
        <SectionHead index="01" tag="ABOUT" />

        <div className="about-grid">
          <p className="about-statement">
            {words.map((w, i) => (
              <span key={i}>
                <span
                  className={`w ${w.mode === 'accent' ? 'w-accent' : ''} ${
                    w.mode === 'serif' ? 'w-serif' : ''
                  }`}
                >
                  {w.text}
                </span>{' '}
              </span>
            ))}
          </p>

          <aside className="about-aside">
            <p className="about-aside-title">SNAPSHOT</p>
            <dl>
              {SNAPSHOT.map((row) => (
                <div className="about-row" key={row.k}>
                  <dt>{row.k}</dt>
                  <dd>{row.v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <div className="about-stats">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <p
                className="stat-num"
                data-value={s.value}
                data-decimals={s.decimals}
                data-suffix={s.suffix}
              >
                0{s.suffix}
              </p>
              <p className="stat-label">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
