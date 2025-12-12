import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Preference } from '@/types'

interface PreferencesState {
  preferences: Preference[]
  deadline: string
  isSubmitted: boolean

  // Actions
  addPreference: (participantId: string) => boolean
  removePreference: (participantId: string) => void
  reorderPreferences: (newOrder: Preference[]) => void
  isInPreferences: (participantId: string) => boolean
  canAddMore: () => boolean
  submitPreferences: () => void
  unsubmitPreferences: () => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      preferences: [],
      deadline: '2025-02-24T18:00:00Z',
      isSubmitted: false,

      addPreference: (participantId: string) => {
        const { preferences } = get()

        // Pas de doublon
        if (preferences.some(p => p.participantId === participantId)) return false

        set({
          preferences: [
            ...preferences,
            {
              participantId,
              order: preferences.length + 1
            }
          ]
        })

        return true
      },

      removePreference: (participantId: string) => {
        set(state => {
          const filtered = state.preferences.filter(p => p.participantId !== participantId)
          // Reorder remaining preferences
          return {
            preferences: filtered.map((p, index) => ({
              ...p,
              order: index + 1
            }))
          }
        })
      },

      reorderPreferences: (newOrder: Preference[]) => {
        set({
          preferences: newOrder.map((p, index) => ({
            ...p,
            order: index + 1
          }))
        })
      },

      isInPreferences: (participantId: string) => {
        return get().preferences.some(p => p.participantId === participantId)
      },

      canAddMore: () => {
        // Plus de limite - on peut toujours ajouter
        return true
      },

      submitPreferences: () => {
        set({ isSubmitted: true })
      },

      unsubmitPreferences: () => {
        // Permet de modifier après soumission
        set({ isSubmitted: false })
      }
    }),
    {
      name: 'business-connect-preferences'
    }
  )
)
