import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Calendar, Clock, MapPin, User, CalendarDays, Coffee, ArrowRight } from 'lucide-react'
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
        'relative rounded-2xl p-4 transition-all duration-300',
        isBreak && 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20',
        isMeeting && 'bg-white border-0 shadow-md hover:shadow-xl hover:-translate-y-0.5 cursor-pointer',
        isFree && 'bg-muted/50 border border-dashed border-muted-foreground/20'
      )}
      onClick={() => isMeeting && slot.meeting && onSelect(slot.meeting)}
    >
      {/* Time indicator line */}
      <div className={cn(
        "absolute left-0 top-4 bottom-4 w-1 rounded-full",
        isBreak && "bg-gradient-to-b from-amber-500 to-orange-500",
        isMeeting && "bg-gradient-to-b from-primary to-secondary",
        isFree && "bg-muted-foreground/30"
      )} />

      <div className="flex items-start gap-4 pl-4">
        <div className="text-center min-w-[70px]">
          <p className="font-bold text-lg">{slot.startTime}</p>
          <p className="text-xs text-muted-foreground">{slot.endTime}</p>
        </div>

        {isBreak && (
          <div className="flex-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
              <Coffee className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold">{slot.label}</p>
              <p className="text-sm text-muted-foreground">Pause & Networking</p>
            </div>
          </div>
        )}

        {isMeeting && slot.meeting && (
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <img
                src={slot.meeting.participant.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${slot.meeting.participant.name}&backgroundColor=2563eb`}
                alt={slot.meeting.participant.name}
                className="w-12 h-12 rounded-xl shadow-md"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{slot.meeting.participant.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {SECTOR_LABELS[slot.meeting.participant.sector]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{slot.meeting.table}</span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        )}

        {isFree && (
          <div className="flex-1 flex items-center">
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Mon agenda</h1>
          </div>
          <p className="text-muted-foreground">
            {meetingCount} rendez-vous prévus le {new Date(eventInfo.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <Button onClick={handleExport} className="shine">
          <Download className="h-4 w-4 mr-2" />
          Exporter (.ics)
        </Button>
      </div>

      {/* Event info */}
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="h-1 gradient-primary" />
        <CardContent className="p-5">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium">{new Date(eventInfo.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-medium">{eventInfo.startTime} - {eventInfo.endTime}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">{eventInfo.location.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Programme du jour
          </CardTitle>
          <CardDescription>
            Cliquez sur un rendez-vous pour voir les détails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeSlots.map((slot, index) => (
              <div key={slot.id} className={`animate-fade-in delay-${Math.min(index * 50, 500)}`}>
                <TimeSlotCard
                  slot={slot}
                  onSelect={setSelectedMeeting}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Meeting detail dialog */}
      <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
        <DialogContent className="rounded-2xl">
          {selectedMeeting && (
            <>
              <DialogHeader>
                <DialogTitle>Détails du rendez-vous</DialogTitle>
                <DialogDescription>
                  <Badge variant="secondary" className="mt-2">
                    {selectedMeeting.startTime} - {selectedMeeting.endTime}
                  </Badge>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/50">
                  <img
                    src={selectedMeeting.participant.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedMeeting.participant.name}&backgroundColor=2563eb`}
                    alt={selectedMeeting.participant.name}
                    className="w-16 h-16 rounded-2xl shadow-lg"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{selectedMeeting.participant.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {SECTOR_LABELS[selectedMeeting.participant.sector]}
                    </Badge>
                  </div>
                </div>

                <p className="text-muted-foreground">
                  {selectedMeeting.participant.pitch}
                </p>

                <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/5">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-medium">{selectedMeeting.table}</span>
                </div>

                <div className="flex gap-3">
                  <Link to={`/participants/${selectedMeeting.participantId}`} className="flex-1">
                    <Button variant="outline" className="w-full h-11">
                      <User className="h-4 w-4 mr-2" />
                      Voir le profil
                    </Button>
                  </Link>
                  <Button
                    className="flex-1 h-11"
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
