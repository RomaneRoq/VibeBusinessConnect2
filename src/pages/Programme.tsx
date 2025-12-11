import { Calendar, Clock, MapPin, Mic, Coffee, Users, Presentation } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { eventInfo, programItems } from '@/data/event'
import type { ProgramItem } from '@/types'

const typeConfig: Record<ProgramItem['type'], { icon: typeof Mic; color: string; label: string }> = {
  keynote: { icon: Presentation, color: 'bg-primary text-white', label: 'Keynote' },
  networking: { icon: Users, color: 'bg-secondary text-white', label: 'Networking' },
  break: { icon: Coffee, color: 'bg-warning text-white', label: 'Pause' },
  speed_meeting: { icon: Calendar, color: 'bg-success text-white', label: 'Speed-Meetings' },
  workshop: { icon: Mic, color: 'bg-purple-500 text-white', label: 'Atelier' },
}

function ProgramCard({ item }: { item: ProgramItem }) {
  const config = typeConfig[item.type]
  const Icon = config.icon

  return (
    <div className="flex gap-4">
      {/* Time */}
      <div className="text-right min-w-[70px] pt-1">
        <p className="font-semibold">{item.startTime}</p>
        <p className="text-xs text-muted-foreground">{item.endTime}</p>
      </div>

      {/* Timeline dot */}
      <div className="flex flex-col items-center">
        <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', config.color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="w-0.5 flex-1 bg-gray-200 my-2" />
      </div>

      {/* Content */}
      <Card className="flex-1 mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold">{item.title}</h3>
            <Badge variant="outline" className="shrink-0">
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{item.description}</p>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {item.speaker && (
              <div className="flex items-center gap-1">
                <Mic className="h-3 w-3" />
                <span>{item.speaker}</span>
              </div>
            )}
            {item.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{item.location}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Programme() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Programme</h1>
        <p className="text-muted-foreground">
          Découvrez le déroulé de la journée {eventInfo.thematic}
        </p>
      </div>

      {/* Event info */}
      <Card className="bg-gradient-to-r from-primary to-primary-600 text-white">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">{eventInfo.name}</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(eventInfo.date).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{eventInfo.startTime} - {eventInfo.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{eventInfo.location.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(typeConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <div className={cn('w-6 h-6 rounded-full flex items-center justify-center', config.color)}>
              <config.icon className="h-3 w-3" />
            </div>
            <span className="text-sm text-muted-foreground">{config.label}</span>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {programItems.map((item) => (
          <ProgramCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
