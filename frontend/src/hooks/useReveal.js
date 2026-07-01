import { useEffect } from 'react'

/**
 * Initializes IntersectionObserver-based reveal animations.
 * Call this inside a useEffect with [] deps on any page that has
 * `.reveal`, `.reveal-l`, or `.reveal-r` elements.
 */
export function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach((el) => {
      if (!el.classList.contains('visible')) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])
}
