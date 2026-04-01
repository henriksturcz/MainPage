import { useEffect, useRef } from 'react'
import s from './Capabilities.module.css'

const CARDS = [
  {
    id: 'exo',
    size: 'wide',
    num: '01',
    title: 'Soft Robotic\nExoskeleton',
    tags: ['Wearable', 'Assistive', 'Biomimetic'],
    desc: 'End-to-end design of soft wearable exoskeletons — from biomechanical analysis to actuator integration.',
    icon: 'EXO',
  },
  {
    id: 'cad',
    size: 'tall',
    num: '02',
    title: 'CAD &\n3D Printing',
    tags: ['NX', 'FDM', 'SLA'],
    desc: 'Parametric modelling and rapid prototyping with industrial & desktop printers.',
    icon: '3D',
  },
  {
    id: 'bio',
    size: 'sm',
    num: '03',
    title: 'Biomechanics',
    tags: ['Anatomy', 'Motion', 'Ergonomics'],
    desc: 'Joint analysis, muscle mapping and motion capture for human-centred design.',
    icon: 'BIO',
  },
  {
    id: 'mat',
    size: 'sm',
    num: '04',
    title: 'Materials &\nTextiles',
    tags: ['Silicone', 'Fabric', 'Composites'],
    desc: 'Material selection and textile pattern-cutting for soft actuator enclosures.',
    icon: 'MAT',
  },
  {
    id: 'fe',
    size: 'wide',
    num: '05',
    title: 'Frontend\nEngineering',
    tags: ['React', 'Next.js', 'TypeScript', 'Three.js'],
    desc: 'Production-grade UIs — from design systems to WebGL-powered interactive experiences.',
    icon: 'FE',
  },
  {
    id: 'ros',
    size: 'sm',
    num: '06',
    title: 'ROS2 &\nFirmware',
    tags: ['C++', 'Real-time', 'CAN Bus'],
    desc: 'Robot OS node architecture, sensor fusion and real-time hardware control.',
    icon: 'ROS',
  },
  {
    id: 'cloud',
    size: 'sm',
    num: '07',
    title: 'Cloud &\nBackend',
    tags: ['Firebase', 'Vercel', 'CI/CD'],
    desc: 'Auth, Firestore, cloud functions and automated deploy pipelines.',
    icon: 'CLD',
  },
]

export default function Capabilities() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('[data-card]').forEach((el, i) => {
            setTimeout(() => el.classList.add(s.visible), i * 80)
          })
          obs.unobserve(e.target)
        }
      })
    }, { threshold: 0.08 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={s.section} id="capabilities">
      <div className={s.fadeTop} />
      <div className={s.bg} />
      <div className={s.inner}>
        <div className={s.header}>
          <span className={s.label}>Expertise</span>
          <h2 className={s.heading}>Capabilities</h2>
        </div>
        <div className={s.grid}>
          {CARDS.map(card => (
            <article key={card.id} data-card className={`${s.card} ${s[card.size]}`}>
              <span className={s.num}>{card.num}</span>
              <div className={s.icon}>{card.icon}</div>
              <h3 className={s.cardTitle}>
                {card.title.split('\n').map((l, i) => <span key={i}>{l}<br /></span>)}
              </h3>
              <div className={s.tags}>
                {card.tags.map(t => <span key={t} className={s.tag}>{t}</span>)}
              </div>
              <p className={s.desc}>{card.desc}</p>
              <div className={s.cornerTL} />
              <div className={s.cornerBR} />
            </article>
          ))}
        </div>
      </div>
      <div className={s.fadeBot} />
    </section>
  )
}