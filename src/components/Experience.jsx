import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionHead from './SectionHead'
import { EXPERIENCE } from '../content'

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const scope = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.xp-item').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 48, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 86%' },
          }
        )
      })
    }, scope)
    return () => ctx.revert()
  }, [])

  return (
    <section className="xp section" id="experience" ref={scope}>
      <div className="container">
        <SectionHead index="02" tag="EXPERIENCE" title="WHERE I'VE SHIPPED" />

        <div className="xp-list">
          {EXPERIENCE.map((job) => (
            <article className="xp-item" key={job.role + job.org}>
              <div className="xp-meta">
                <p className="xp-period">{job.period}</p>
                <p className="xp-loc">{job.loc}</p>
              </div>
              <div className="xp-body">
                <h3 className="xp-role">{job.role}</h3>
                {job.orgLink ? (
                  <a
                    className="xp-org"
                    href={job.orgLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {job.org} ↗
                  </a>
                ) : (
                  <p className="xp-org">{job.org}</p>
                )}
                <ul className="xp-points">
                  {job.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
              {job.tech && (
                <div className="xp-tech">
                  {job.tech.map((t) => (
                    <span className="xp-tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
