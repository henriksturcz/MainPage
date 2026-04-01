import { useEffect, useRef } from 'react'

export function useReveal(threshold = 0.1) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const items = el.querySelectorAll('.reveal')
            items.forEach((item, i) => {
              setTimeout(() => item.classList.add('visible'), i * 80)
            })
          }
        })
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return ref
}
