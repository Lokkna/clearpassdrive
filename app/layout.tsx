import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ClearPass Drive — California Traffic School',
  description: 'Complete your California traffic school requirement online. DMV-licensed, $24.95. Fresno County and statewide.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
