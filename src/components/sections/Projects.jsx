import { useEffect, useRef } from 'react'
import { PROJECTS } from '../../data/site'
import s from './Projects.module.css'

export default function Projects() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          ref.current?.querySelectorAll('.reveal').forEach((el, i) =>
            setTimeout(() => el.classList.add('visible'), i * 80)
          )
        }
      })
    }, { threshold: 0.05 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className={`${s.section} ${s.projects}`} id="projects">
      <div className={`${s.header} reveal`}>
        <div>
          <div className={s.label}>Selected Work</div>
          <h2>Featured<br />Projects</h2>
        </div>
      </div>
      <div className={s.list}>
        {PROJECTS.map(p => (
          <a key={p.id} href={p.url} className={`${s.item} reveal`} data-hover
            target={p.url !== '#' ? '_blank' : undefined}
            rel={p.url !== '#' ? 'noopener noreferrer' : undefined}>
            <span className={s.num}>{p.id}</span>
            <div className={s.info}>
              <div className={s.name}>{p.name}</div>
              <div className={s.tags}>
                {p.tags.map(t => <span key={t} className={s.tag}>{t}</span>)}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
