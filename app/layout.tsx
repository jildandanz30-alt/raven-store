import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import './globals-patch.css'

export const metadata: Metadata = {
  title: 'Raven Store',
  description: 'Minecraft Plugins, Assets & Jasa',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="id">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
