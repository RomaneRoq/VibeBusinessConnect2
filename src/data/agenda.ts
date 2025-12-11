import type { Meeting, TimeSlot } from '@/types'
import { participants } from './participants'

// Generate time slots from 10:00 to 17:00 (with lunch break)
export function generateTimeSlots(userMeetings: Meeting[]): TimeSlot[] {
  const slots: TimeSlot[] = []

  // Morning session: 10:00 - 12:30 (10 slots of 15 min)
  const morningStart = 10 * 60 // 10:00 in minutes
  for (let i = 0; i < 10; i++) {
    const startMinutes = morningStart + (i * 15)
    const endMinutes = startMinutes + 15
    const startTime = `${Math.floor(startMinutes / 60).toString().padStart(2, '0')}:${(startMinutes % 60).toString().padStart(2, '0')}`
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`

    const meeting = userMeetings.find(m => m.startTime === startTime)

    slots.push({
      id: `slot-morning-${i}`,
      startTime,
      endTime,
      type: meeting ? 'meeting' : 'free',
      meeting
    })
  }

  // Lunch break: 12:30 - 14:30
  slots.push({
    id: 'slot-lunch',
    startTime: '12:30',
    endTime: '14:30',
    type: 'break',
    label: 'Pause déjeuner'
  })

  // Afternoon session: 14:30 - 17:00 (10 slots of 15 min)
  const afternoonStart = 14 * 60 + 30 // 14:30 in minutes
  for (let i = 0; i < 10; i++) {
    const startMinutes = afternoonStart + (i * 15)
    const endMinutes = startMinutes + 15
    const startTime = `${Math.floor(startMinutes / 60).toString().padStart(2, '0')}:${(startMinutes % 60).toString().padStart(2, '0')}`
    const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, '0')}:${(endMinutes % 60).toString().padStart(2, '0')}`

    const meeting = userMeetings.find(m => m.startTime === startTime)

    slots.push({
      id: `slot-afternoon-${i}`,
      startTime,
      endTime,
      type: meeting ? 'meeting' : 'free',
      meeting
    })
  }

  return slots
}

// Sample meetings for demo (for the current user)
export const sampleMeetings: Meeting[] = [
  {
    id: 'meeting-1',
    startTime: '10:00',
    endTime: '10:15',
    participantId: 'enterprise-1',
    participant: participants.find(p => p.id === 'enterprise-1')!,
    table: 'Table 3',
    status: 'scheduled'
  },
  {
    id: 'meeting-2',
    startTime: '10:30',
    endTime: '10:45',
    participantId: 'startup-3',
    participant: participants.find(p => p.id === 'startup-3')!,
    table: 'Table 7',
    status: 'scheduled'
  },
  {
    id: 'meeting-3',
    startTime: '11:00',
    endTime: '11:15',
    participantId: 'enterprise-6',
    participant: participants.find(p => p.id === 'enterprise-6')!,
    table: 'Table 2',
    status: 'scheduled'
  },
  {
    id: 'meeting-4',
    startTime: '11:30',
    endTime: '11:45',
    participantId: 'startup-7',
    participant: participants.find(p => p.id === 'startup-7')!,
    table: 'Table 5',
    status: 'scheduled'
  },
  {
    id: 'meeting-5',
    startTime: '12:00',
    endTime: '12:15',
    participantId: 'enterprise-11',
    participant: participants.find(p => p.id === 'enterprise-11')!,
    table: 'Table 1',
    status: 'scheduled'
  },
  {
    id: 'meeting-6',
    startTime: '14:30',
    endTime: '14:45',
    participantId: 'startup-2',
    participant: participants.find(p => p.id === 'startup-2')!,
    table: 'Table 4',
    status: 'scheduled'
  },
  {
    id: 'meeting-7',
    startTime: '15:00',
    endTime: '15:15',
    participantId: 'enterprise-4',
    participant: participants.find(p => p.id === 'enterprise-4')!,
    table: 'Table 8',
    status: 'scheduled'
  },
  {
    id: 'meeting-8',
    startTime: '15:30',
    endTime: '15:45',
    participantId: 'startup-10',
    participant: participants.find(p => p.id === 'startup-10')!,
    table: 'Table 6',
    status: 'scheduled'
  },
  {
    id: 'meeting-9',
    startTime: '16:00',
    endTime: '16:15',
    participantId: 'enterprise-8',
    participant: participants.find(p => p.id === 'enterprise-8')!,
    table: 'Table 3',
    status: 'scheduled'
  },
  {
    id: 'meeting-10',
    startTime: '16:30',
    endTime: '16:45',
    participantId: 'startup-5',
    participant: participants.find(p => p.id === 'startup-5')!,
    table: 'Table 9',
    status: 'scheduled'
  }
]

export default { generateTimeSlots, sampleMeetings }
