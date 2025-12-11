import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Heart,
  Calendar,
  MessageSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMessagesStore } from '@/store/messagesStore'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Accueil' },
  { to: '/participants', icon: Users, label: 'Participants' },
  { to: '/preferences', icon: Heart, label: 'Préférences' },
  { to: '/agenda', icon: Calendar, label: 'Agenda' },
  { to: '/messages', icon: MessageSquare, label: 'Messages', badge: true },
]

export default function BottomNav() {
  const unreadCount = useMessagesStore(state => state.getTotalUnreadCount())

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t-0 z-50 pb-safe">
      <div className="flex items-center justify-around h-18 px-2">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-2xl mx-1 transition-all duration-200',
                isActive
                  ? 'text-white gradient-primary shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:bg-muted'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={cn("h-5 w-5 transition-transform", isActive && "scale-110")} />
                  {badge && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 flex items-center justify-center text-[10px] font-bold text-white bg-destructive rounded-full px-1 shadow-sm">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
