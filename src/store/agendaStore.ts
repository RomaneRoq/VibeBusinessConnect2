import { create } from 'zustand'
import type { Meeting, TimeSlot } from '@/types'
import { sampleMeetings, generateTimeSlots } from '@/data/agenda'

interface AgendaState {
  meetings: Meeting[]
  timeSlots: TimeSlot[]
  selectedMeeting: Meeting | null

  // Actions
  setSelectedMeeting: (meeting: Meeting | null) => void
  getMeetingById: (id: string) => Meeting | undefined
  exportToICS: () => string
}

export const useAgendaStore = create<AgendaState>()((set, get) => ({
  meetings: sampleMeetings,
  timeSlots: generateTimeSlots(sampleMeetings),
  selectedMeeting: null,

  setSelectedMeeting: (meeting) => {
    set({ selectedMeeting: meeting })
  },

  getMeetingById: (id: string) => {
    return get().meetings.find(m => m.id === id)
  },

  exportToICS: () => {
    const { meetings } = get()
    const eventDate = '2025-02-15'

    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//BusinessConnect//Agenda//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:BusinessConnect - Mon Agenda
`

    meetings.forEach(meeting => {
      const startDateTime = `${eventDate.replace(/-/g, '')}T${meeting.startTime.replace(':', '')}00`
      const endDateTime = `${eventDate.replace(/-/g, '')}T${meeting.endTime.replace(':', '')}00`

      icsContent += `BEGIN:VEVENT
DTSTART:${startDateTime}
DTEND:${endDateTime}
SUMMARY:RDV avec ${meeting.participant.name}
DESCRIPTION:Speed-meeting avec ${meeting.participant.name} - ${meeting.participant.pitch}
LOCATION:${meeting.table} - Le Village by CA Luxembourg
STATUS:CONFIRMED
UID:${meeting.id}@businessconnect.lu
END:VEVENT
`
    })

    icsContent += 'END:VCALENDAR'

    return icsContent
  }
}))
