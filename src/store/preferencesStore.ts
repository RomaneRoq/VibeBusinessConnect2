import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Preference } from '@/types'

interface PreferencesState {
  preferences: Preference[]
  maxPreferences: number
  deadline: string
  isSubmitted: boolean

  // Actions
  addPreference: (participantId: string) => boolean
  removePreference: (participantId: string) => void
  reorderPreferences: (newOrder: Preference[]) => void
  isInPreferences: (participantId: string) => boolean
  canAddMore: () => boolean
  submitPreferences: () => void
  getRemainingCount: () => number
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set, get) => ({
      preferences: [],
      maxPreferences: 10,
      deadline: '2025-02-14T18:00:00Z',
      isSubmitted: false,

      addPreference: (participantId: string) => {
        const { preferences, maxPreferences, isSubmitted } = get()

        if (isSubmitted) return false
        if (preferences.length >= maxPreferences) return false
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
        const { isSubmitted } = get()
        if (isSubmitted) return

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
        const { isSubmitted } = get()
        if (isSubmitted) return

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
        const { preferences, maxPreferences, isSubmitted } = get()
        return !isSubmitted && preferences.length < maxPreferences
      },

      submitPreferences: () => {
        set({ isSubmitted: true })
      },

      getRemainingCount: () => {
        const { preferences, maxPreferences } = get()
        return maxPreferences - preferences.length
      }
    }),
    {
      name: 'business-connect-preferences'
    }
  )
)
