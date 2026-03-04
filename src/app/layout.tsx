import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Resume-to-Visual',
  description: 'Upload a PDF resume, AI extracts structured data, download a visual HTML resume',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
