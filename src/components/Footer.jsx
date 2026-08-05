import Magnetic from './Magnetic'
import { useScrollTo } from '../ScrollContext'
import { useISTTime } from '../hooks/useClock'

export default function Footer() {
  const scrollTo = useScrollTo()
  const time = useISTTime()

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© 2026 SHOBHIT CHOLA</p>
        <p className="footer-dim">NEW DELHI, IN · {time} IST</p>
        <p className="footer-dim">REACT ✦ THREE.JS ✦ GSAP</p>
        <Magnetic strength={0.4}>
          <button className="footer-top" onClick={() => scrollTo(0)} aria-label="Back to top">
            TOP ↑
          </button>
        </Magnetic>
      </div>
    </footer>
  )
}
