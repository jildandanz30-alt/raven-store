'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}

export default function ScrollReveal({ children, delay = 0, className, style }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay = `${delay}s`
          el.classList.add('panel-animate')
          el.style.opacity = '1'
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )

    el.style.opacity = '0'
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
