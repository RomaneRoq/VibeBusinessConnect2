import { Link, useLocation } from 'react-router-dom'
import { Bell, Menu, Sparkles } from 'lucide-react'
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

  const pageTitle = pageTitles[location.pathname] || 'Business Connect'

  return (
    <header className="sticky top-0 z-40 glass border-b-0 h-20">
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        {/* Left - Mobile menu & title */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden rounded-xl">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile logo */}
          <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gradient">Business Connect</span>
          </Link>

          <div className="hidden lg:block">
            <h1 className="text-xl font-bold">{pageTitle}</h1>
            <p className="text-sm text-muted-foreground">Bienvenue sur votre espace</p>
          </div>
        </div>

        {/* Right - Notifications & profile */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Link to="/messages">
            <Button variant="ghost" size="icon" className="relative rounded-xl h-11 w-11">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center text-xs p-0 shadow-lg"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-11 px-2 rounded-xl hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9 rounded-xl">
                    <AvatarImage
                      src={user?.participant.logo}
                      alt={user?.participant.name}
                      className="rounded-xl"
                    />
                    <AvatarFallback className="rounded-xl gradient-primary text-white text-xs">
                      {user?.participant.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium">{user?.participant.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 rounded-xl p-2" align="end">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <Avatar className="h-10 w-10 rounded-xl">
                  <AvatarImage src={user?.participant.logo} className="rounded-xl" />
                  <AvatarFallback className="rounded-xl gradient-primary text-white text-xs">
                    {user?.participant.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.participant.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                <Link to="/settings" className="flex items-center gap-2">
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive rounded-lg cursor-pointer"
              >
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
