'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function ProgressBar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Start loading
    setVisible(true)
    setProgress(30)
    
    const timer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 300)
    }, 400)

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  if (!visible) return null

  return (
    <div 
      className="fixed top-0 left-0 h-1 bg-[#ff6b4a] z-[9999] transition-all duration-300 ease-out"
      style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
    />
  )
}
