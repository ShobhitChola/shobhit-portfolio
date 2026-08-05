import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { hoverCapable, reducedMotion } from '../hooks/useMedia'

// Custom cursor: a lime dot with a lagging ring.
// Elements can set data-cursor="LABEL" to expand the ring with a caption.
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const [enabled] = useState(() => hoverCapable() && !reducedMotion())

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')

    const dot = dotRef.current
    const ring = ringRef.current
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -200, y: -200 })

    const dx = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3' })
    const dy = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3' })
    const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' })
    const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' })

    const move = (e) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }

    const over = (e) => {
      const target = e.target.closest('[data-cursor], a, button')
      const label = target?.dataset?.cursor || ''
      ring.classList.toggle('is-link', !!target && !label)
      ring.classList.toggle('is-label', !!label)
      dot.classList.toggle('is-hidden', !!label)
      if (labelRef.current) labelRef.current.textContent = label
    }

    const down = () => ring.classList.add('is-down')
    const up = () => ring.classList.remove('is-down')

    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)

    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <span className="cursor-label" ref={labelRef} />
      </div>
    </>
  )
}
