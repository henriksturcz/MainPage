import { useEffect, useRef } from 'react'
import { SITE } from '../../data/site'
import s from './Hero.module.css'

export default function Hero() {
  const ref = useRef(null)

  useEffect(() => {
    const items = ref.current?.querySelectorAll('.reveal')
    items?.forEach((el, i) => setTimeout(() => el.classList.add('visible'), 200 + i * 120))
  }, [])

  const go = e => {
    e.preventDefault()
    document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section ref={ref} className={`${s.section} ${s.hero}`} id="hero">
      <div className={s.content}>
        <div className={`${s.tag} reveal`}>{SITE.title}</div>
        <h1 className={`${s.title} reveal`}>
          Novyx<br />
          <span className={s.outline}>Lab</span>
        </h1>
        <p className={`${s.desc} reveal`}>{SITE.tagline}</p>
        <a href="#projects" className={`${s.btn} reveal`} data-hover onClick={go}>
          View Projects <span className={s.arrow}>→</span>
        </a>
      </div>

      <div className={s.scrollIndicator} aria-hidden="true">
        <div className={s.scrollLine} />
        <span className={s.scrollText}>Scroll</span>
      </div>
    </section>
  )
}
