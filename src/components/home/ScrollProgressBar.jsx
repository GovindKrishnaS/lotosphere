import React, { useRef } from 'react'
import { useScrollProgress } from '../../animations/hooks'

export default function ScrollProgressBar() {
  const barRef = useRef(null)

  useScrollProgress((progress) => {
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${progress})`
    }
  })

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-white/5 pointer-events-none">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-emerald-600 via-emerald-400 to-amber-400"
        style={{ transform: 'scaleX(0)', willChange: 'transform' }}
      />
    </div>
  )
}
