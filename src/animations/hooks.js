import { useEffect, useRef, useCallback } from 'react'

/**
 * Attach IntersectionObserver-based scroll reveal to elements with .reveal class.
 * Called once in the Layout component.
 */
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .clip-reveal, .clip-reveal-circle')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}

/**
 * Efficient scroll progress tracker.
 * Uses requestAnimationFrame to avoid scroll jank.
 * Returns a ref containing the current scroll progress (0-1).
 * Also accepts an optional callback for direct DOM manipulation.
 */
export function useScrollProgress(callback) {
  const progressRef = useRef(0)
  const rafRef = useRef(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let ticking = false

    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) {
        progressRef.current = 0
      } else {
        progressRef.current = Math.min(1, Math.max(0, window.scrollY / scrollHeight))
      }
      if (callbackRef.current) {
        callbackRef.current(progressRef.current)
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        rafRef.current = requestAnimationFrame(updateProgress)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Initial calculation
    updateProgress()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return progressRef
}

/**
 * IntersectionObserver hook for section visibility.
 * Returns a ref to attach to the target element and a visibility ref.
 */
export function useSectionVisibility(options = {}) {
  const elementRef = useRef(null)
  const isVisibleRef = useRef(false)
  const callbackRef = useRef(options.onChange)

  useEffect(() => {
    callbackRef.current = options.onChange
  }, [options.onChange])

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
        if (callbackRef.current) {
          callbackRef.current(entry.isIntersecting, entry)
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return { ref: elementRef, isVisibleRef }
}

/**
 * Card tilt effect on mouse move.
 * Returns ref to attach to the card element.
 */
export function useCardTilt(intensity = 8) {
  const ref = useRef(null)

  useEffect(() => {
    const card = ref.current
    if (!card) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const handleMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = ((y - centerY) / centerY) * -intensity
      const rotateY = ((x - centerX) / centerX) * intensity

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
    }

    const handleLeave = () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)'
    }

    card.addEventListener('mousemove', handleMove, { passive: true })
    card.addEventListener('mouseleave', handleLeave)

    return () => {
      card.removeEventListener('mousemove', handleMove)
      card.removeEventListener('mouseleave', handleLeave)
    }
  }, [intensity])

  return ref
}

/**
 * Parallax effect based on scroll position.
 * Uses RAF for performance.
 */
export function useParallax(speed = 0.3) {
  const ref = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const handleScroll = () => {
      if (frameRef.current) return
      frameRef.current = requestAnimationFrame(() => {
        const el = ref.current
        if (!el) {
          frameRef.current = null
          return
        }
        const scrollY = window.scrollY
        const rect = el.getBoundingClientRect()
        const offset = (scrollY - (scrollY + rect.top - window.innerHeight / 2)) * speed
        el.style.transform = `translateY(${offset}px)`
        frameRef.current = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [speed])

  return ref
}

/**
 * Animated counter that counts up to a value when visible.
 */
export function useCounter(target, duration = 2000) {
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const animate = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // cubic ease-out
            el.textContent = Math.round(target * eased).toLocaleString('en-IN')
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return ref
}

/**
 * Magnetic button effect.
 * Returns ref to attach to the button element.
 */
export function useMagneticButton(strength = 0.3) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const isTouch = window.matchMedia('(hover: none)').matches
    if (isTouch) return

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
    }

    const handleLeave = () => {
      el.style.transform = 'translate(0, 0)'
      el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      setTimeout(() => { el.style.transition = '' }, 400)
    }

    el.addEventListener('mousemove', handleMove, { passive: true })
    el.addEventListener('mouseleave', handleLeave)

    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength])

  return ref
}
