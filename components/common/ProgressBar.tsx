
'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/**
 * A YouTube-style progress bar that trickles realistically.
 */
export default function ProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null)

  const startLoading = () => {
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
    
    setVisible(true)
    setProgress(10) // Initial jump

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev + 0.1 // Very slow trickle at the end
        }
        if (prev >= 70) {
          return prev + 0.5
        }
        return prev + 2 // Faster jump initially
      })
    }, 200)
  }

  const stopLoading = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    setProgress(100)
    
    fadeTimerRef.current = setTimeout(() => {
      setVisible(false)
      setTimeout(() => setProgress(0), 400) // Reset after fade
    }, 400)
  }

  useEffect(() => {
    // Start on mount/change
    startLoading()
    
    // In Next.js App Router, we don't have a reliable way to know when the route finished loading 
    // unless we use a wrapper around all link clicks. 
    // However, for most pages, a short delay feels right.
    const finishTimer = setTimeout(stopLoading, 600)

    return () => {
      clearTimeout(finishTimer)
      if (timerRef.current) clearInterval(timerRef.current)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
    }
  }, [pathname, searchParams])

  if (!visible && progress === 0) return null

  return (
    <div className="fixed top-0 left-0 w-full z-[99999] pointer-events-none">
      <div 
        className="h-[3px] bg-[#FF6B4A] shadow-[0_0_10px_#FF6B4A,0_0_5px_#FF6B4A] transition-all duration-300 ease-out"
        style={{ 
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
          transitionProperty: progress === 100 ? 'width, opacity' : 'width'
        }}
      />
    </div>
  )
}
