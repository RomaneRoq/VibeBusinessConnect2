import { Link, useLocation } from 'react-router-dom'
import { Bell, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/store/authStore'
import { useMessagesStore } from '@/store/messagesStore'
import { Badge } from '@/components/ui/badge'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/participants': 'Participants',
  '/preferences': 'Mes préférences',
  '/agenda': 'Mon agenda',
  '/programme': 'Programme',
  '/messages': 'Messages',
  '/settings': 'Paramètres',
  '/infos': 'Infos pratiques',
}

export default function Header() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const unreadCount = useMessagesStore(state => state.getTotalUnreadCount())

  const pageTitle = pageTitles[location.pathname] || 'BusinessConnect'

  return (
    <header className="sticky top-0 z-40 bg-white border-b h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left - Mobile menu & title */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile logo */}
          <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BC</span>
            </div>
          </Link>

          <h1 className="hidden lg:block text-xl font-semibold">{pageTitle}</h1>
        </div>

        {/* Right - Notifications & profile */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link to="/messages">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center text-xs p-0"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.participant.logo}
                    alt={user?.participant.name}
                  />
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {user?.participant.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.participant.logo} />
                  <AvatarFallback className="bg-primary text-white text-xs">
                    {user?.participant.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.participant.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings">Paramètres</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
