import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'Raven Store | Minecraft Plugins & Assets',
  description: 'Temukan plugin Minecraft, asset digital, dan jasa profesional terbaik untuk servermu di Raven Store.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="id" className="scroll-smooth">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
