import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gaddafi Kasimu Ali | Official Portfolio',
  description: 'The official portfolio, novels, and poetry of Gaddafi Kasimu Ali.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <footer className="py-8 text-center text-sm text-slate-500 border-t mt-20">
          © {new Date().getFullYear()} Gaddafi Kasimu Ali. All rights reserved.
        </footer>
      </body>
    </html>
  )
}