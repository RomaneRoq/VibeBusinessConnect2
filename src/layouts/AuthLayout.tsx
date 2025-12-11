import { Outlet, Link } from 'react-router-dom'
import { Sparkles, Calendar, MapPin, Clock } from 'lucide-react'
import { eventInfo } from '@/data/event'

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 dots-pattern opacity-10" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">Business Connect</span>
              <p className="text-sm text-white/70">Fintech & Regtech 2025</p>
            </div>
          </Link>

          {/* Main content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Bienvenue sur<br />Business Connect
              </h1>
              <p className="text-lg text-white/80 max-w-md">
                La plateforme de matchmaking B2B qui vous connecte avec les acteurs clés de l'écosystème Fintech & Regtech luxembourgeois.
              </p>
            </div>

            {/* Event info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <span>{new Date(eventInfo.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <span>{eventInfo.startTime} - {eventInfo.endTime}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <span>{eventInfo.location.name}, {eventInfo.location.city}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-sm text-white/60">
            Organisé par Le Village by CA Luxembourg
          </p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex flex-col min-h-screen bg-background">
        {/* Mobile header */}
        <div className="lg:hidden p-6 border-b">
          <Link to="/" className="flex items-center gap-3 justify-center">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Business Connect</span>
          </Link>
        </div>

        {/* Form content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md animate-fade-in">
            <Outlet />
          </div>
        </div>

        {/* Mobile footer */}
        <div className="lg:hidden text-center p-6 text-sm text-muted-foreground border-t">
          <p>Organisé par Le Village by CA Luxembourg</p>
        </div>
      </div>
    </div>
  )
}
