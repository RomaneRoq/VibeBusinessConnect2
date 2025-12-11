import { Link } from 'react-router-dom'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, X, Heart, Clock, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePreferencesStore } from '@/store/preferencesStore'
import { useParticipantsStore } from '@/store/participantsStore'
import { toast } from '@/hooks/useToast'
import { cn } from '@/lib/utils'
import { SECTOR_LABELS } from '@/types'

function SortableItem({ id, preference, onRemove }: {
  id: string
  preference: { participantId: string; order: number }
  onRemove: () => void
}) {
  const { getParticipantById } = useParticipantsStore()
  const participant = getParticipantById(preference.participantId)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (!participant) return null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-white border rounded-lg p-4 mb-2',
        isDragging && 'shadow-lg opacity-80'
      )}
    >
      <div className="flex items-center gap-4">
        <button
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold text-sm">
          {preference.order}
        </div>

        <img
          src={participant.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${participant.name}&backgroundColor=1E3A5F`}
          alt={participant.name}
          className="w-12 h-12 rounded-lg"
        />

        <div className="flex-1 min-w-0">
          <Link to={`/participants/${participant.id}`} className="hover:underline">
            <h3 className="font-medium truncate">{participant.name}</h3>
          </Link>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {SECTOR_LABELS[participant.sector]}
            </Badge>
            <span className="text-xs text-muted-foreground capitalize">
              {participant.type === 'startup' ? 'Startup' : 'Entreprise'}
            </span>
          </div>
        </div>

        <Button variant="ghost" size="icon" onClick={onRemove}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function Preferences() {
  const {
    preferences,
    maxPreferences,
    deadline,
    isSubmitted,
    reorderPreferences,
    removePreference,
    submitPreferences,
    getRemainingCount
  } = usePreferencesStore()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = preferences.findIndex(p => p.participantId === active.id)
      const newIndex = preferences.findIndex(p => p.participantId === over.id)
      const newOrder = arrayMove(preferences, oldIndex, newIndex)
      reorderPreferences(newOrder)
    }
  }

  const handleSubmit = () => {
    submitPreferences()
    toast({
      title: 'Préférences soumises !',
      description: 'Vos choix ont été enregistrés. Vous recevrez votre agenda personnalisé prochainement.',
    })
  }

  const deadlineDate = new Date(deadline)
  const isDeadlinePassed = new Date() > deadlineDate
  const remainingCount = getRemainingCount()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Mes préférences</h1>
        <p className="text-muted-foreground">
          Sélectionnez jusqu'à 10 participants que vous souhaitez rencontrer
        </p>
      </div>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Heart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{preferences.length}/{maxPreferences}</p>
              <p className="text-sm text-muted-foreground">Préférences</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Clock className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium">Date limite</p>
              <p className="text-sm text-muted-foreground">
                {deadlineDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={cn(
              'p-3 rounded-lg',
              isSubmitted ? 'bg-success/10' : 'bg-warning/10'
            )}>
              <Check className={cn(
                'h-5 w-5',
                isSubmitted ? 'text-success' : 'text-warning'
              )} />
            </div>
            <div>
              <p className="text-sm font-medium">Statut</p>
              <p className={cn(
                'text-sm',
                isSubmitted ? 'text-success' : 'text-warning'
              )}>
                {isSubmitted ? 'Soumis' : 'En attente'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferences list */}
      <Card>
        <CardHeader>
          <CardTitle>Vos préférences</CardTitle>
          <CardDescription>
            {isSubmitted
              ? 'Vos préférences ont été soumises.'
              : 'Réorganisez vos préférences par ordre de priorité (glisser-déposer)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {preferences.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={preferences.map(p => p.participantId)}
                strategy={verticalListSortingStrategy}
                disabled={isSubmitted}
              >
                {preferences.map((preference) => (
                  <SortableItem
                    key={preference.participantId}
                    id={preference.participantId}
                    preference={preference}
                    onRemove={() => removePreference(preference.participantId)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore sélectionné de préférences
              </p>
              <Link to="/participants">
                <Button>Explorer les participants</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit button */}
      {preferences.length > 0 && !isSubmitted && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-muted p-4 rounded-lg">
          <div>
            <p className="font-medium">
              {remainingCount > 0
                ? `Vous pouvez encore ajouter ${remainingCount} préférence${remainingCount > 1 ? 's' : ''}`
                : 'Vous avez atteint le maximum de préférences'}
            </p>
            <p className="text-sm text-muted-foreground">
              Soumettez vos choix avant la date limite
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/participants">
              <Button variant="outline">
                Ajouter des participants
              </Button>
            </Link>
            <Button onClick={handleSubmit} disabled={isDeadlinePassed}>
              Soumettre mes préférences
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
