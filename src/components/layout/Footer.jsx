import { SITE } from '../../data/site'
import s from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={s.footer}>
      <span>© {new Date().getFullYear()} {SITE.name}</span>
      <span>All Rights Reserved</span>
    </footer>
  )
}
