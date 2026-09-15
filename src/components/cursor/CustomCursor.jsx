import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const followerRef = useRef(null)
  const textRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Disable on touch devices and mobile viewports
    const isTouch = window.matchMedia('(hover: none)').matches || window.innerWidth < 768
    setIsMobile(isTouch)
    if (isTouch) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let mouseX = 0, mouseY = 0
    let followerX = 0, followerY = 0
    let rafId = null

    const dot = dotRef.current
    const follower = followerRef.current
    const cursorText = textRef.current

    if (!dot || !follower || !cursorText) return

    const lerp = (a, b, t) => a + (b - a) * t

    const moveCursor = () => {
      // Central Dot follows mouse exactly
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`

      // Follower trails behind with inertia lerp
      followerX = lerp(followerX, mouseX, 0.12)
      followerY = lerp(followerY, mouseY, 0.12)

      follower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`
      cursorText.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`

      rafId = requestAnimationFrame(moveCursor)
    }

    rafId = requestAnimationFrame(moveCursor)

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onMouseEnter = (e) => {
      const el = e.target.closest('[data-cursor]')
      if (!el) return
      const type = el.dataset.cursor

      if (type === 'view') {
        dot.classList.add('cursor-hover')
        follower.classList.add('cursor-hover')
        cursorText.classList.add('cursor-hover')
        cursorText.textContent = 'VIEW'
      } else if (type === 'image') {
        dot.classList.add('cursor-hover')
        follower.classList.add('cursor-hover')
        cursorText.classList.add('cursor-hover')
        cursorText.textContent = 'ZOOM'
      } else if (type === 'link') {
        dot.classList.add('cursor-link')
        follower.classList.add('cursor-link')
      }
    }

    const onMouseLeave = () => {
      dot.classList.remove('cursor-hover', 'cursor-link')
      follower.classList.remove('cursor-hover', 'cursor-link')
      cursorText.classList.remove('cursor-hover')
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseover', onMouseEnter)
    document.addEventListener('mouseout', onMouseLeave)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseEnter)
      document.removeEventListener('mouseout', onMouseLeave)
    }
  }, [])

  if (isMobile) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={followerRef} className="cursor-follower" aria-hidden="true" />
      <div ref={textRef} className="cursor-text" aria-hidden="true" />
    </>
  )
}
