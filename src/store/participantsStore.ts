import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Participant, ParticipantType, Sector } from '@/types'
import { participants as mockParticipants } from '@/data/participants'

interface ParticipantsState {
  participants: Participant[]
  favorites: string[]
  filters: {
    type: ParticipantType | 'all'
    sector: Sector | 'all'
    search: string
  }

  // Actions
  setFilter: (key: keyof ParticipantsState['filters'], value: string) => void
  resetFilters: () => void
  toggleFavorite: (participantId: string) => void
  getParticipantById: (id: string) => Participant | undefined
  getFilteredParticipants: () => Participant[]
}

const initialFilters = {
  type: 'all' as const,
  sector: 'all' as const,
  search: ''
}

export const useParticipantsStore = create<ParticipantsState>()(
  persist(
    (set, get) => ({
      participants: mockParticipants,
      favorites: [],
      filters: initialFilters,

      setFilter: (key, value) => {
        set(state => ({
          filters: {
            ...state.filters,
            [key]: value
          }
        }))
      },

      resetFilters: () => {
        set({ filters: initialFilters })
      },

      toggleFavorite: (participantId: string) => {
        set(state => {
          const isFavorite = state.favorites.includes(participantId)
          return {
            favorites: isFavorite
              ? state.favorites.filter(id => id !== participantId)
              : [...state.favorites, participantId]
          }
        })
      },

      getParticipantById: (id: string) => {
        return get().participants.find(p => p.id === id)
      },

      getFilteredParticipants: () => {
        const { participants, filters } = get()

        return participants.filter(participant => {
          // Filter by type
          if (filters.type !== 'all' && participant.type !== filters.type) {
            return false
          }

          // Filter by sector
          if (filters.sector !== 'all' && participant.sector !== filters.sector) {
            return false
          }

          // Filter by search
          if (filters.search) {
            const searchLower = filters.search.toLowerCase()
            const matchesName = participant.name.toLowerCase().includes(searchLower)
            const matchesPitch = participant.pitch.toLowerCase().includes(searchLower)
            const matchesDescription = participant.description.toLowerCase().includes(searchLower)

            if (!matchesName && !matchesPitch && !matchesDescription) {
              return false
            }
          }

          return true
        })
      }
    }),
    {
      name: 'business-connect-participants',
      partialize: (state) => ({ favorites: state.favorites })
    }
  )
)
