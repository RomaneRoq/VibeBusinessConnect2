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
  LogOut,
  Sparkles
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
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 glass border-r-0">
      {/* Logo */}
      <div className="flex items-center gap-3 h-20 px-6 border-b border-border/50">
        <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
          <Sparkles className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="font-bold text-lg text-gradient">Business Connect</span>
          <p className="text-xs text-muted-foreground">Fintech & Regtech 2025</p>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-5 border-b border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5">
            <img
              src={user.participant.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${user.participant.name}&backgroundColor=2563eb`}
              alt={user.participant.name}
              className="w-12 h-12 rounded-xl shadow-md"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{user.participant.name}</p>
              <Badge
                variant={user.participant.type === 'startup' ? 'default' : 'secondary'}
                className="mt-1 text-xs"
              >
                {user.participant.type === 'startup' ? 'Startup' : 'Entreprise'}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-custom">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'gradient-primary text-white shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span className="flex-1">{label}</span>
            {badge && unreadCount > 0 && (
              <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center text-xs shadow-sm">
                {unreadCount}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
