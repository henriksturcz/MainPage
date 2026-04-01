import { useEffect, useRef } from 'react'
import s from './Cursor.module.css'

export default function Cursor() {
  const cursorRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return
    let cx = 0, cy = 0, dx = 0, dy = 0, raf

    const onMove = e => {
      dx = e.clientX; dy = e.clientY
      dot.style.left = dx - 2.5 + 'px'
      dot.style.top = dy - 2.5 + 'px'
    }
    const animate = () => {
      cx += (dx - cx) * 0.12
      cy += (dy - cy) * 0.12
      cursor.style.left = cx - 10 + 'px'
      cursor.style.top = cy - 10 + 'px'
      raf = requestAnimationFrame(animate)
    }
    const onEnter = () => cursor.classList.add(s.hover)
    const onLeave = () => cursor.classList.remove(s.hover)

    window.addEventListener('mousemove', onMove, { passive: true })
    document.querySelectorAll('[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    raf = requestAnimationFrame(animate)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <>
      <div ref={cursorRef} className={s.cursor} />
      <div ref={dotRef} className={s.dot} />
    </>
  )
}
