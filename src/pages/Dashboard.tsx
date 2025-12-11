import { Link } from 'react-router-dom'
import { Calendar, Users, Heart, MessageSquare, Clock, MapPin, ArrowRight, Sparkles, CalendarDays, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/authStore'
import { useAgendaStore } from '@/store/agendaStore'
import { usePreferencesStore } from '@/store/preferencesStore'
import { useMessagesStore } from '@/store/messagesStore'
import { eventInfo } from '@/data/event'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { meetings } = useAgendaStore()
  const { preferences } = usePreferencesStore()
  const unreadCount = useMessagesStore(state => state.getTotalUnreadCount())

  const nextMeeting = meetings[0]

  const stats = [
    {
      label: 'Meetings prévus',
      value: meetings.length,
      icon: CalendarDays,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-600'
    },
    {
      label: 'Préférences',
      value: `${preferences.length}/10`,
      icon: Heart,
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-500/10',
      textColor: 'text-rose-600'
    },
    {
      label: 'Messages non lus',
      value: unreadCount,
      icon: MessageSquare,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'bg-violet-500/10',
      textColor: 'text-violet-600'
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium text-white/80">Bienvenue sur Business Connect</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">
            Bonjour, {user?.participant.name} !
          </h1>
          <p className="text-white/80 max-w-xl mb-6">
            Préparez vos rencontres pour l'événement <span className="font-semibold text-white">{eventInfo.thematic}</span>. Explorez les participants et sélectionnez ceux que vous souhaitez rencontrer.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{new Date(eventInfo.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>{eventInfo.location.name}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>{eventInfo.startTime} - {eventInfo.endTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={stat.label} className={`card-hover border-0 shadow-lg animate-fade-in delay-${index * 100}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next meeting & Quick actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Next meeting */}
        {nextMeeting && (
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                Prochain rendez-vous
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <img
                  src={nextMeeting.participant.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${nextMeeting.participant.name}&backgroundColor=2563eb`}
                  alt={nextMeeting.participant.name}
                  className="w-16 h-16 rounded-2xl shadow-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg">{nextMeeting.participant.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{nextMeeting.participant.pitch}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant="secondary" className="font-medium">
                      {nextMeeting.startTime} - {nextMeeting.endTime}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{nextMeeting.table}</span>
                  </div>
                </div>
              </div>
              <Link to={`/participants/${nextMeeting.participantId}`} className="block mt-4">
                <Button variant="outline" className="w-full">
                  Voir le profil
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Progress */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Votre progression
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Préférences remplies</span>
                <span className="font-semibold">{preferences.length}/10</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${(preferences.length / 10) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Profil complété</span>
                <span className="font-semibold">100%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full w-full" />
              </div>
            </div>

            {preferences.length < 10 && (
              <Link to="/preferences">
                <Button variant="ghost" className="w-full mt-2 text-primary hover:text-primary">
                  Compléter mes préférences
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Accès rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { to: '/participants', icon: Users, title: 'Explorer les participants', desc: 'Découvrez les startups et entreprises présentes', color: 'from-blue-500 to-cyan-500' },
            { to: '/preferences', icon: Heart, title: 'Gérer mes préférences', desc: 'Sélectionnez qui vous souhaitez rencontrer', color: 'from-rose-500 to-pink-500' },
            { to: '/agenda', icon: Calendar, title: 'Mon agenda', desc: 'Consultez vos rendez-vous du jour', color: 'from-emerald-500 to-teal-500' },
            { to: '/messages', icon: MessageSquare, title: 'Messages', desc: 'Échangez avec les participants', color: 'from-violet-500 to-purple-500', badge: unreadCount },
          ].map((item, index) => (
            <Link key={item.to} to={item.to}>
              <Card className={`card-hover border-0 shadow-md animate-fade-in delay-${index * 100}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <item.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    {item.badge ? (
                      <Badge variant="destructive">{item.badge}</Badge>
                    ) : (
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
