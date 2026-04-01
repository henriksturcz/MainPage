import { useState, useEffect } from 'react'
import s from './PageLoader.module.css'

export default function PageLoader({ onComplete }) {
  const [count, setCount] = useState(0)
  const [status, setStatus] = useState('INITIALIZING')
  const [out, setOut] = useState(false)

  useEffect(() => {
    let start = null, raf
    const duration = 2400

    const ease = t => t < 0.5
      ? Math.pow(2, 20 * t - 10) / 2
      : (2 - Math.pow(2, -20 * t + 10)) / 2

    const animate = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const v = Math.floor(ease(p) * 100)
      setCount(v)
      if (v < 30) setStatus('INITIALIZING')
      else if (v < 60) setStatus('LOADING ASSETS')
      else if (v < 90) setStatus('BUILDING INTERFACE')
      else setStatus('READY')
      if (p < 1) { raf = requestAnimationFrame(animate) }
      else {
        setCount(100)
        setStatus('READY')
        setTimeout(() => { setOut(true); setTimeout(() => onComplete?.(), 700) }, 300)
      }
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  return (
    <div className={`${s.loader} ${out ? s.out : ''}`}>
      <div className={s.scanlines} />
      <div className={s.corner} data-pos="tl" />
      <div className={s.corner} data-pos="tr" />
      <div className={s.corner} data-pos="bl" />
      <div className={s.corner} data-pos="br" />

      <div className={s.inner}>
        <div className={s.nameRow}>
          <span className={s.nameLeft}>Henrik</span>
          <span className={s.nameSep} />
          <span className={s.nameRight}>Sturcz</span>
        </div>

        <div className={s.countBlock}>
          <div className={s.countDisplay}>
            <span className={s.countNum}>{String(count).padStart(3, '0')}</span>
            <span className={s.countPct}>%</span>
          </div>
          <div className={s.trackWrap}>
            <div className={s.track}>
              <div className={s.bar} style={{ width: `${count}%` }} />
              <div className={s.barGlow} style={{ width: `${count}%` }} />
            </div>
            <div className={s.trackLabels}>
              {['0', '25', '50', '75', '100'].map(l => <span key={l}>{l}</span>)}
            </div>
          </div>
        </div>

        <div className={s.statusRow}>
          <span className={s.statusDot} />
          <span className={s.statusText}>{status}</span>
          <span className={s.statusLine} />
        </div>
      </div>
    </div>
  )
}
