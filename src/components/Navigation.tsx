'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, clearAuth } = useAuthStore()

  // Don't render navigation on login page
  if (pathname === '/login') {
    return null
  }

  const handleLogout = () => {
    clearAuth()
    router.push('/login')
  }

  const navItems = [
    { href: '/news', label: 'News Intelligence', active: pathname === '/news' },
    { href: '/', label: 'Thought Leadership', active: pathname === '/' },
    { href: '/moat-finder', label: 'Strategic Moat Finder', active: pathname === '/moat-finder' },
    { href: '/disruption-radar', label: 'Disruption Radar', active: pathname === '/disruption-radar' },
  ]

  return (
    <nav className="bg-gradient-to-r from-commbank-black via-gray-900 to-commbank-black border-b-4 border-commbank-yellow shadow-2xl">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center py-6">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h1 className="text-commbank-yellow text-2xl font-extrabold tracking-tight animate-fade-in">
              Australian Government Media Intelligence Studio
            </h1>
            <p className="text-gray-300 text-sm mt-2 font-medium">
              Political Strategy & Media Analysis Workbench
            </p>
          </div>

          <div className="flex gap-3 flex-wrap justify-center items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={item.active ? 'nav-link-active' : 'nav-link-inactive'}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-700">
                <span className="text-gray-300 text-sm">
                  {user.email || user.firstName || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pb-6 text-gray-300 text-sm border-t border-gray-800 pt-6 leading-relaxed">
          <p className="max-w-5xl">
            Unite expert insight and live media signals into a single decision-grade political strategy platform.
            Thought Leadership converts interviews into policy-ready insights, Strategic Moat Finder identifies
            defensible political positions with evidence, and Disruption Radar quantifies emerging threats to
            policy objectives, giving government officials clear levers for strategic communications and public messaging.
          </p>
        </div>

        <div className="flex gap-8 pb-6 text-xs flex-wrap">
          <span className="text-commbank-gray-400 hover:text-commbank-yellow transition-colors cursor-default flex items-center gap-2">
            <span className="w-2 h-2 bg-commbank-yellow rounded-full"></span>
            Political strategy dossiers
          </span>
          <span className="text-commbank-gray-400 hover:text-commbank-yellow transition-colors cursor-default flex items-center gap-2">
            <span className="w-2 h-2 bg-commbank-yellow rounded-full"></span>
            Policy position intelligence
          </span>
          <span className="text-commbank-gray-400 hover:text-commbank-yellow transition-colors cursor-default flex items-center gap-2">
            <span className="w-2 h-2 bg-commbank-yellow rounded-full"></span>
            Media disruption insights
          </span>
          <span className="text-commbank-gray-400 hover:text-commbank-yellow transition-colors cursor-default flex items-center gap-2">
            <span className="w-2 h-2 bg-commbank-yellow rounded-full"></span>
            Minister-ready briefings
          </span>
        </div>
      </div>
    </nav>
  )
}
