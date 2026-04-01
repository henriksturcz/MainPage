import { useEffect, useRef } from 'react'
import { SITE } from '../../data/site'
import s from './Contact.module.css'

const LINKS = [
  { label: 'Email',    href: `mailto:${SITE.email}` },
  { label: 'LinkedIn', href: SITE.socials.linkedin },
  { label: 'GitHub',   href: SITE.socials.github }
]

const STREAM_LINES = [
  'ros2 topic pub /joint_state', 'git commit -m "feat: exo control loop"',
  'npm run build -- --prod', 'IMU calibration complete ✓',
  'firebase deploy --only functions', 'PID tuning: Kp=1.2 Ki=0.3 Kd=0.05',
  'yarn dev --port 3000', 'sensorFusion.update(accel, gyro)',
  'vercel --prod', '3D print: layer 124/340',
  'next build ✓ compiled successfully', 'CAN bus heartbeat OK',
  'git push origin main', 'exo.setTorque(0.45 Nm)',
  'tsc --noEmit ✓ no errors', 'slicing model: 12% infill TPU',
  'firebase.auth().onAuthStateChanged', 'ros2 launch exo_bringup',
  'webpack --mode production', 'servo PWM: 1520μs',
  'useEffect(() => { … }, [])', 'biomech analysis: 87% ROM',
  'docker build -t softexo:latest', 'pattern cut: size M adjusted',
]

export default function Contact() {
  const sectionRef = useRef(null)
  const canvasRef  = useRef(null)
  const animRef    = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sectionRef.current?.querySelectorAll('.reveal').forEach((el, i) =>
            setTimeout(() => el.classList.add('visible'), i * 110)
          )
        }
      })
    }, { threshold: 0.12 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, dpr
    const COLS  = []
    const COL_W = 200
    const LINE_H = 16

    const initColumns = () => {
      COLS.length = 0
      const count = Math.ceil(W / COL_W) + 1
      for (let i = 0; i < count; i++) {
        COLS.push({
          x:      i * COL_W + Math.random() * 30 - 15,
          y:      Math.random() * H * 0.5,
          speed:  1.2 + Math.random() * 1.4,
          lines:  [...STREAM_LINES].sort(() => Math.random() - 0.5),
          offset: Math.floor(Math.random() * STREAM_LINES.length),
          alpha:  0.055 + Math.random() * 0.07,
        })
      }
    }

    const resize = () => {
      dpr = window.devicePixelRatio || 1
      W   = canvas.offsetWidth
      H   = canvas.offsetHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      ctx.scale(dpr, dpr)
      initColumns()
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      animRef.current = requestAnimationFrame(draw)
      ctx.fillStyle = 'rgba(5,5,5,0.18)'
      ctx.fillRect(0, 0, W, H)
      ctx.font = '400 10px "Space Grotesk",monospace'
      ctx.textBaseline = 'top'
      COLS.forEach(col => {
        col.y += col.speed
        for (let j = 0; j < 32; j++) {
          const lineY = col.y - j * LINE_H
          if (lineY < -LINE_H || lineY > H + LINE_H) continue
          const lineIdx = (col.offset + j) % col.lines.length
          ctx.fillStyle = `rgba(224,27,36,${col.alpha * (1 - (j / 28) * 0.85)})`
          ctx.fillText(col.lines[lineIdx], col.x, lineY)
        }
        if (col.y - 32 * LINE_H > H) {
          col.y = -LINE_H * 2
          col.offset = Math.floor(Math.random() * STREAM_LINES.length)
        }
      })
    }
    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section ref={sectionRef} className={s.section} id="contact">
      <div className={s.fadeTop} />
      <div className={s.bg} />
      <canvas ref={canvasRef} className={s.canvas} aria-hidden="true" />
      <div className={s.content}>
        <div className={`${s.label} reveal`}>Get in Touch</div>
        <h2 className={`${s.heading} reveal`}>
          Let&apos;s build<br />
          <span className={s.outline}>something</span><br />
          extraordinary
        </h2>
        <p className={`${s.body} reveal`}>
          Have a project in mind or want to collaborate?
          I&apos;m always open to discussing new opportunities
          and creative challenges.
        </p>
        <div className={`${s.links} reveal`}>
          {LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel={href.startsWith('mailto')    ? undefined : 'noopener noreferrer'}
              className={s.link}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}