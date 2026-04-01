import { useEffect, useRef } from 'react'

export function useMouse() {
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return mouse
}
