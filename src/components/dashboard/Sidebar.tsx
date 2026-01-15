'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const nav = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Reviews', href: '/dashboard/reviews' },
  { name: 'News', href: '/dashboard/pr' },
  { name: 'Social', href: '/dashboard/social' },
  { name: 'Competitors', href: '/dashboard/competitors' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-48 border-r border-border flex flex-col">
      <div className="p-4">
        <Link href="/dashboard" className="text-[13px] font-medium">
          Brand Monitor
        </Link>
      </div>

      <nav className="flex-1 px-2">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'block px-3 py-1.5 text-[13px] rounded transition-colors',
              pathname === item.href
                ? 'bg-secondary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/dashboard/settings"
          className="text-[13px] text-muted-foreground hover:text-foreground"
        >
          Settings
        </Link>
      </div>
    </aside>
  )
}
