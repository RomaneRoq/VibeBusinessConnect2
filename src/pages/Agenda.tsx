import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Calendar, Clock, MapPin, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useAgendaStore } from '@/store/agendaStore'
import { eventInfo } from '@/data/event'
import type { TimeSlot, Meeting } from '@/types'
import { SECTOR_LABELS } from '@/types'

function TimeSlotCard({ slot, onSelect }: { slot: TimeSlot; onSelect: (meeting: Meeting) => void }) {
  const isBreak = slot.type === 'break'
  const isMeeting = slot.type === 'meeting' && slot.meeting
  const isFree = slot.type === 'free'

  return (
    <div
      className={cn(
        'border rounded-lg p-4 transition-colors',
        isBreak && 'bg-muted border-muted',
        isMeeting && 'bg-white hover:shadow-md cursor-pointer',
        isFree && 'bg-gray-50 border-dashed'
      )}
      onClick={() => isMeeting && slot.meeting && onSelect(slot.meeting)}
    >
      <div className="flex items-start gap-4">
        <div className="text-center min-w-[60px]">
          <p className="font-semibold">{slot.startTime}</p>
          <p className="text-xs text-muted-foreground">{slot.endTime}</p>
        </div>

        {isBreak && (
          <div className="flex-1">
            <p className="font-medium text-muted-foreground">{slot.label}</p>
          </div>
        )}

        {isMeeting && slot.meeting && (
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <img
                src={slot.meeting.participant.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${slot.meeting.participant.name}&backgroundColor=1E3A5F`}
                alt={slot.meeting.participant.name}
                className="w-10 h-10 rounded-lg"
              />
              <div>
                <h3 className="font-medium">{slot.meeting.participant.name}</h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="secondary" className="text-xs">
                    {SECTOR_LABELS[slot.meeting.participant.sector]}
                  </Badge>
                  <span>{slot.meeting.table}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isFree && (
          <div className="flex-1">
            <p className="text-muted-foreground text-sm">Créneau libre</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Agenda() {
  const { timeSlots, exportToICS } = useAgendaStore()
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)

  const handleExport = () => {
    const icsContent = exportToICS()
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'businessconnect-agenda.ics'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const meetingCount = timeSlots.filter(s => s.type === 'meeting').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Mon agenda</h1>
          <p className="text-muted-foreground">
            {meetingCount} rendez-vous prévus le {new Date(eventInfo.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exporter (.ics)
        </Button>
      </div>

      {/* Event info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{new Date(eventInfo.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>{eventInfo.startTime} - {eventInfo.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{eventInfo.location.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Programme du jour</CardTitle>
          <CardDescription>
            Cliquez sur un rendez-vous pour voir les détails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timeSlots.map((slot) => (
              <TimeSlotCard
                key={slot.id}
                slot={slot}
                onSelect={setSelectedMeeting}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meeting detail dialog */}
      <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent>
          {selectedMeeting && (
            <>
              <DialogHeader>
                <DialogTitle>Détails du rendez-vous</DialogTitle>
                <DialogDescription>
                  {selectedMeeting.startTime} - {selectedMeeting.endTime}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedMeeting.participant.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedMeeting.participant.name}&backgroundColor=1E3A5F`}
                    alt={selectedMeeting.participant.name}
                    className="w-16 h-16 rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{selectedMeeting.participant.name}</h3>
                    <Badge variant="secondary">
                      {SECTOR_LABELS[selectedMeeting.participant.sector]}
                    </Badge>
                  </div>
                </div>

                <p className="text-muted-foreground">
                  {selectedMeeting.participant.pitch}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedMeeting.table}</span>
                </div>

                <div className="flex gap-2">
                  <Link to={`/participants/${selectedMeeting.participantId}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Voir le profil
                    </Button>
                  </Link>
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => setSelectedMeeting(null)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
