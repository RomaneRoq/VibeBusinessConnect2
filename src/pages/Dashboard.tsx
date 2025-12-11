import { Link } from 'react-router-dom'
import { Calendar, Users, Heart, MessageSquare, Clock, MapPin, ArrowRight } from 'lucide-react'
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

  // Find next meeting (simulated as first meeting)
  const nextMeeting = meetings[0]

  const stats = [
    { label: 'Meetings prévus', value: meetings.length, icon: Calendar, color: 'text-primary' },
    { label: 'Préférences', value: `${preferences.length}/10`, icon: Heart, color: 'text-destructive' },
    { label: 'Messages non lus', value: unreadCount, icon: MessageSquare, color: 'text-secondary' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-primary-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bonjour, {user?.participant.name} !
        </h1>
        <p className="text-white/80">
          Bienvenue sur BusinessConnect. Préparez vos rencontres pour l'événement {eventInfo.thematic}.
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-white/80">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(eventInfo.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{eventInfo.location.name}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next meeting */}
      {nextMeeting && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Prochain rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img
                src={nextMeeting.participant.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${nextMeeting.participant.name}&backgroundColor=1E3A5F`}
                alt={nextMeeting.participant.name}
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{nextMeeting.participant.name}</h3>
                <p className="text-sm text-muted-foreground">{nextMeeting.participant.pitch}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <Badge variant="secondary">{nextMeeting.startTime} - {nextMeeting.endTime}</Badge>
                  <span className="text-muted-foreground">{nextMeeting.table}</span>
                </div>
              </div>
              <Link to={`/participants/${nextMeeting.participantId}`}>
                <Button variant="outline" size="sm">
                  Voir le profil
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <Link to="/participants">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Explorer les participants</h3>
                    <p className="text-sm text-muted-foreground">
                      Découvrez les startups et entreprises présentes
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <Link to="/preferences">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Gérer mes préférences</h3>
                    <p className="text-sm text-muted-foreground">
                      Sélectionnez qui vous souhaitez rencontrer
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <Link to="/agenda">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-success/10 text-success">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Mon agenda</h3>
                    <p className="text-sm text-muted-foreground">
                      Consultez vos rendez-vous du jour
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <Link to="/messages">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-secondary/10 text-secondary">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Messages</h3>
                    <p className="text-sm text-muted-foreground">
                      Échangez avec les participants
                    </p>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <Badge variant="destructive">{unreadCount}</Badge>
                )}
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
