import { Link } from 'react-router-dom'
import { Heart, Plus, Building2, Rocket, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Participant } from '@/types'
import { SECTOR_LABELS } from '@/types'
import { useParticipantsStore } from '@/store/participantsStore'
import { usePreferencesStore } from '@/store/preferencesStore'

interface ParticipantCardProps {
  participant: Participant
  showActions?: boolean
}

export default function ParticipantCard({ participant, showActions = true }: ParticipantCardProps) {
  const { favorites, toggleFavorite } = useParticipantsStore()
  const { addPreference, isInPreferences, canAddMore } = usePreferencesStore()

  const isFavorite = favorites.includes(participant.id)
  const isPreferred = isInPreferences(participant.id)

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(participant.id)
  }

  const handleAddPreference = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isPreferred && canAddMore()) {
      addPreference(participant.id)
    }
  }

  return (
    <Link to={`/participants/${participant.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Logo */}
            <div className="shrink-0">
              <img
                src={participant.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${participant.name}&backgroundColor=1E3A5F`}
                alt={participant.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm truncate">{participant.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    {participant.type === 'startup' ? (
                      <Rocket className="h-3 w-3" />
                    ) : (
                      <Building2 className="h-3 w-3" />
                    )}
                    <span className="capitalize">
                      {participant.type === 'startup' ? 'Startup' : 'Entreprise'}
                    </span>
                  </div>
                </div>

                {showActions && (
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleFavorite}
                    >
                      <Heart
                        className={cn(
                          'h-4 w-4',
                          isFavorite && 'fill-destructive text-destructive'
                        )}
                      />
                    </Button>
                  </div>
                )}
              </div>

              <Badge variant="secondary" className="mt-2 text-xs">
                {SECTOR_LABELS[participant.sector]}
              </Badge>

              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                {participant.pitch}
              </p>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center gap-2 mt-3">
                  <Button
                    variant={isPreferred ? 'default' : 'outline'}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={handleAddPreference}
                    disabled={isPreferred || !canAddMore()}
                  >
                    {isPreferred ? (
                      'Ajouté'
                    ) : (
                      <>
                        <Plus className="h-3 w-3 mr-1" />
                        Préférence
                      </>
                    )}
                  </Button>

                  {participant.website && (
                    <a
                      href={participant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Site web
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
