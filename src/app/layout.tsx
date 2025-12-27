import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import AuthProvider from '@/components/AuthProvider'

export const metadata: Metadata = {
  title: 'Political Strategy Workbench',
  description: 'Australian Government Policy Intelligence Platform - Unite expert insight and live political signals into decision-grade strategy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-commbank-gray-50">
        <AuthProvider>
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
