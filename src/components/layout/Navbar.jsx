import { useState, useEffect } from 'react'
import { SITE } from '../../data/site'
import s from './Navbar.module.css'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#github', label: 'GitHub' },
  { href: '#workflow', label: 'Workflow' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = (e, href) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className={`${s.nav} ${scrolled ? s.scrolled : ''}`}>
      <div className={s.logo} data-hover>{SITE.logo}</div>
      <ul className={s.links}>
        {LINKS.map(({ href, label }) => (
          <li key={href}>
            <a href={href} className={s.link} data-hover onClick={e => go(e, href)}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
