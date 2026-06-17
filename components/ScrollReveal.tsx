'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
  animation?: 'fade-up' | 'fade-in' | 'scale-up'
}

export default function ScrollReveal({ 
  children, 
  delay = 0, 
  className, 
  style,
  animation = 'fade-up'
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('reveal-active')
          }, delay * 1000)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    el.classList.add('reveal-hidden', `reveal-${animation}`)
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, animation])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
