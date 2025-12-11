import { Link } from 'react-router-dom'
import { Heart, Plus, Building2, Rocket, ExternalLink, Check, ArrowRight } from 'lucide-react'
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
      <Card className="group card-hover border-0 shadow-md h-full overflow-hidden">
        <CardContent className="p-0">
          {/* Header with gradient */}
          <div className={cn(
            "p-4 pb-12 relative",
            participant.type === 'startup'
              ? "bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-transparent"
              : "bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-transparent"
          )}>
            <div className="flex items-start justify-between">
              <Badge
                variant={participant.type === 'startup' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {participant.type === 'startup' ? (
                  <Rocket className="h-3 w-3 mr-1" />
                ) : (
                  <Building2 className="h-3 w-3 mr-1" />
                )}
                {participant.type === 'startup' ? 'Startup' : 'Entreprise'}
              </Badge>

              {showActions && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-full transition-all",
                    isFavorite
                      ? "bg-rose-100 text-rose-500 hover:bg-rose-200"
                      : "bg-white/80 hover:bg-white"
                  )}
                  onClick={handleFavorite}
                >
                  <Heart
                    className={cn(
                      'h-4 w-4 transition-all',
                      isFavorite && 'fill-rose-500 text-rose-500 scale-110'
                    )}
                  />
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-4 -mt-8 relative">
            {/* Logo */}
            <div className="mb-3">
              <img
                src={participant.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${participant.name}&backgroundColor=2563eb`}
                alt={participant.name}
                className="w-16 h-16 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
            </div>

            {/* Name & Sector */}
            <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors">
              {participant.name}
            </h3>
            <Badge variant="ghost" className="mb-3 text-xs px-0 hover:bg-transparent">
              {SECTOR_LABELS[participant.sector]}
            </Badge>

            {/* Pitch */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {participant.pitch}
            </p>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-2">
                <Button
                  variant={isPreferred ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    "flex-1 h-9 text-xs font-medium",
                    isPreferred && "bg-emerald-500 hover:bg-emerald-600"
                  )}
                  onClick={handleAddPreference}
                  disabled={isPreferred || !canAddMore()}
                >
                  {isPreferred ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1.5" />
                      Ajouté aux préférences
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Ajouter aux préférences
                    </>
                  )}
                </Button>

                {participant.website && (
                  <a
                    href={participant.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="h-9 w-9 flex items-center justify-center rounded-xl border-2 border-input hover:border-primary/30 hover:bg-accent transition-all"
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                )}
              </div>
            )}

            {/* View profile hint */}
            <div className="flex items-center justify-center gap-1 mt-3 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Voir le profil</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
