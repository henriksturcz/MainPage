import { useEffect, useRef } from 'react'
import { SKILLS } from '../../data/site'
import s from './About.module.css'

export default function About() {
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
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const onCardMove = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%')
    e.currentTarget.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%')
  }

  return (
    <section ref={ref} className={`${s.section} ${s.about}`} id="about">
      <div className={`${s.label} reveal`}>Presentation</div>
      <div className={s.grid}>
        <div className={`${s.text} reveal`}>
          <h2>
            Designing the<br />
            <span className={s.outline}>future</span> of<br />
            digital spaces
          </h2>
          <p>I am a student of computer science and really passionate about webdesign and robotics, I specialize in merging aesthetics with functionality. Every project is an opportunity to push boundaries and create something that resonates deeply with users while achieving measurable results.</p>
        </div>
        <div className={s.skillsGrid}>
          {SKILLS.map(skill => (
            <div key={skill.num} className={`${s.card} reveal`} onMouseMove={onCardMove}>
              <div className={s.num}>{skill.num}</div>
              <div className={s.skillName}>{skill.name}</div>
              <div className={s.skillDesc}>{skill.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
