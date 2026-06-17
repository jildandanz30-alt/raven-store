'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

const HERO_WORDS = ['PLUGIN', 'PREMIUM', 'UNTUK', 'SERVER', 'MINECRAFT', 'KAMU!']

export default function HeroSection() {
  const wordsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    wordsRef.current.forEach((el, i) => {
      if (!el) return
      el.style.opacity = '0'
      el.style.animationDelay = `${0.1 + i * 0.12}s`
      el.classList.add('word-reveal')
    })
  }, [])

  return (
    <section
      style={{
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        padding: '6rem 1.5rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background comic panel lines */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 79px, #1a1a1a 79px, #1a1a1a 80px)',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      {/* Big decorative "BOOM" text */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          right: '-2rem',
          top: '10%',
          fontFamily: 'Bangers, cursive',
          fontSize: 'clamp(8rem, 20vw, 18rem)',
          color: 'transparent',
          WebkitTextStroke: '2px #222',
          letterSpacing: '-0.05em',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        POW!
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', position: 'relative' }}>
        <div style={{ maxWidth: 760 }}>
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-block',
              fontFamily: 'Bangers, cursive',
              letterSpacing: '0.15em',
              fontSize: '0.9rem',
              padding: '3px 14px',
              border: '3px solid #E8E8E0',
              boxShadow: '4px 4px 0 #E8E8E0',
              background: '#1A1A1A',
              marginBottom: '1.5rem',
              animation: 'wordReveal 0.4s ease forwards',
              animationDelay: '0s',
              opacity: 0,
            }}
          >
            ⚡ RAVEN STORE — PREMIUM MINECRAFT ASSETS
          </div>

          {/* Main headline */}
          <h1
            style={{
              fontFamily: 'Bangers, cursive',
              fontSize: 'clamp(3.2rem, 8vw, 6.5rem)',
              lineHeight: 1.05,
              letterSpacing: '0.04em',
              color: '#F5F5F0',
              marginBottom: '0.5rem',
            }}
          >
            {HERO_WORDS.map((word, i) => (
              <span key={i} style={{ display: 'inline-block', marginRight: '0.25em' }}>
                <span
                  ref={(el) => { if (el) wordsRef.current[i] = el }}
                  className="word-reveal"
                  style={{ display: 'inline-block', animationDelay: `${0.1 + i * 0.12}s` }}
                >
                  {/* Highlight specific words */}
                  {i === 1 || i === 5 ? (
                    <span
                      style={{
                        background: '#F5F5F0',
                        color: '#0A0A0A',
                        padding: '0 6px',
                        border: '3px solid #E8E8E0',
                        boxShadow: '5px 5px 0 #E8E8E0',
                      }}
                    >
                      {word}
                    </span>
                  ) : (
                    word
                  )}
                </span>
              </span>
            ))}
          </h1>

          {/* Subtext */}
          <p
            style={{
              color: '#AAAAAA',
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              lineHeight: 1.7,
              maxWidth: 520,
              margin: '1.5rem 0 2.5rem',
              animation: 'wordReveal 0.4s ease forwards',
              animationDelay: '0.85s',
              opacity: 0,
            }}
          >
            Plugin premium, asset ItemAdder & Oraxen, plus jasa setup profesional. Satu tempat,
            semua yang server kamu butuhkan.
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              animation: 'wordReveal 0.4s ease forwards',
              animationDelay: '1s',
              opacity: 0,
            }}
          >
            <Link
              href="/products"
              className="btn-comic btn-comic-white"
              style={{
                fontFamily: 'Bangers, cursive',
                letterSpacing: '0.08em',
                fontSize: '1.2rem',
                padding: '0.7rem 2rem',
                border: '3px solid #E8E8E0',
                boxShadow: '5px 5px 0 #E8E8E0',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block',
                background: '#F5F5F0',
                color: '#0A0A0A',
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px,-3px)'
                e.currentTarget.style.boxShadow = '7px 8px 0 #E8E8E0'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = '5px 5px 0 #E8E8E0'
              }}
            >
              Lihat Produk →
            </Link>
            <Link
              href="/jasa"
              className="btn-comic btn-comic-outline"
              style={{
                fontFamily: 'Bangers, cursive',
                letterSpacing: '0.08em',
                fontSize: '1.2rem',
                padding: '0.7rem 2rem',
                border: '3px solid #E8E8E0',
                boxShadow: '5px 5px 0 #E8E8E0',
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-block',
                background: 'transparent',
                color: '#F5F5F0',
                transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-2px,-3px)'
                e.currentTarget.style.boxShadow = '7px 8px 0 #E8E8E0'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = '5px 5px 0 #E8E8E0'
              }}
            >
              Order Jasa
            </Link>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: 'flex',
              gap: '2rem',
              flexWrap: 'wrap',
              marginTop: '3rem',
              animation: 'wordReveal 0.4s ease forwards',
              animationDelay: '1.2s',
              opacity: 0,
            }}
          >
            {[
              { n: '50+', label: 'Plugin & Asset' },
              { n: '200+', label: 'Customer' },
              { n: '4.9★', label: 'Rating' },
            ].map(({ n, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: 'Bangers, cursive',
                    fontSize: '2rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {n}
                </div>
                <div style={{ color: '#AAAAAA', fontSize: '0.85rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
