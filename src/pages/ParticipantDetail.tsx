import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Heart, Plus, MessageSquare, ExternalLink, Linkedin,
  Building2, Rocket, Users, Euro, Calendar, Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { useParticipantsStore } from '@/store/participantsStore'
import { usePreferencesStore } from '@/store/preferencesStore'
import { useMessagesStore } from '@/store/messagesStore'
import { SECTOR_LABELS, STAGE_LABELS, PARTNERSHIP_LABELS } from '@/types'

export default function ParticipantDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getParticipantById, favorites, toggleFavorite } = useParticipantsStore()
  const { addPreference, isInPreferences, canAddMore } = usePreferencesStore()
  const { startConversation } = useMessagesStore()

  const participant = getParticipantById(id || '')

  if (!participant) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Participant non trouvé.</p>
        <Button variant="link" onClick={() => navigate('/participants')}>
          Retour à la liste
        </Button>
      </div>
    )
  }

  const isFavorite = favorites.includes(participant.id)
  const isPreferred = isInPreferences(participant.id)
  const isStartup = participant.type === 'startup'

  const handleMessage = () => {
    startConversation(participant.id)
    navigate('/messages')
  }

  const handleAddPreference = () => {
    if (!isPreferred && canAddMore()) {
      addPreference(participant.id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={participant.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${participant.name}&backgroundColor=1E3A5F`}
          alt={participant.name}
          className="w-32 h-32 rounded-xl object-cover"
        />

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {isStartup ? (
                  <Rocket className="h-5 w-5 text-primary" />
                ) : (
                  <Building2 className="h-5 w-5 text-primary" />
                )}
                <Badge variant="secondary">
                  {isStartup ? 'Startup' : 'Entreprise'}
                </Badge>
                <Badge variant="outline">{SECTOR_LABELS[participant.sector]}</Badge>
              </div>
              <h1 className="text-2xl font-bold">{participant.name}</h1>
              <p className="text-muted-foreground mt-1">{participant.pitch}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={isPreferred ? 'default' : 'outline'}
              onClick={handleAddPreference}
              disabled={isPreferred || !canAddMore()}
            >
              {isPreferred ? (
                'Dans vos préférences'
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter aux préférences
                </>
              )}
            </Button>

            <Button variant="outline" onClick={handleMessage}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Envoyer un message
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleFavorite(participant.id)}
            >
              <Heart className={cn('h-4 w-4', isFavorite && 'fill-destructive text-destructive')} />
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>À propos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {participant.description || 'Aucune description disponible.'}
              </p>
            </CardContent>
          </Card>

          {/* What they're looking for */}
          {participant.lookingFor.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Recherche
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {participant.lookingFor.map((type) => (
                    <Badge key={type} variant="secondary">
                      {PARTNERSHIP_LABELS[type]}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Thematics */}
          {participant.thematicsInterest.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Thématiques d'intérêt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {participant.thematicsInterest.map((thematic) => (
                    <Badge key={thematic} variant="outline">
                      {thematic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isStartup ? (
                <>
                  {participant.stage && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Stade</p>
                        <p className="text-sm text-muted-foreground">
                          {STAGE_LABELS[participant.stage]}
                        </p>
                      </div>
                    </div>
                  )}
                  {participant.teamSize && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Équipe</p>
                        <p className="text-sm text-muted-foreground">
                          {participant.teamSize} personnes
                        </p>
                      </div>
                    </div>
                  )}
                  {participant.fundingRaised && (
                    <div className="flex items-center gap-3">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Fonds levés</p>
                        <p className="text-sm text-muted-foreground">
                          {participant.fundingRaised}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {participant.employeeCount && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Employés</p>
                        <p className="text-sm text-muted-foreground">
                          {participant.employeeCount}
                        </p>
                      </div>
                    </div>
                  )}
                  {participant.innovationBudget && (
                    <div className="flex items-center gap-3">
                      <Euro className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Budget innovation</p>
                        <p className="text-sm text-muted-foreground">
                          {participant.innovationBudget}
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Liens</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {participant.website && (
                <a
                  href={participant.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <ExternalLink className="h-4 w-4" />
                  Site web
                </a>
              )}
              {participant.linkedIn && (
                <a
                  href={participant.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              <a
                href={`mailto:${participant.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
              >
                <MessageSquare className="h-4 w-4" />
                {participant.email}
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
