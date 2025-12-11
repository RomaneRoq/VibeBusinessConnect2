import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Heart,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  Info,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'
import { useMessagesStore } from '@/store/messagesStore'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/participants', icon: Users, label: 'Participants' },
  { to: '/preferences', icon: Heart, label: 'Mes préférences' },
  { to: '/agenda', icon: Calendar, label: 'Mon agenda' },
  { to: '/programme', icon: FileText, label: 'Programme' },
  { to: '/messages', icon: MessageSquare, label: 'Messages', badge: true },
  { to: '/infos', icon: Info, label: 'Infos pratiques' },
  { to: '/settings', icon: Settings, label: 'Paramètres' },
]

export default function Sidebar() {
  const { logout, user } = useAuthStore()
  const unreadCount = useMessagesStore(state => state.getTotalUnreadCount())

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r">
      {/* Logo */}
      <div className="flex items-center gap-2 h-16 px-6 border-b">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">BC</span>
        </div>
        <span className="font-bold text-primary">BusinessConnect</span>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-4 border-b">
          <div className="flex items-center gap-3">
            <img
              src={user.participant.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${user.participant.name}&backgroundColor=1E3A5F`}
              alt={user.participant.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{user.participant.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.participant.type === 'startup' ? 'Startup' : 'Entreprise'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="flex-1">{label}</span>
            {badge && unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
