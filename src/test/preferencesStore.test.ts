import { describe, it, expect, beforeEach } from 'vitest'
import { usePreferencesStore } from '@/store/preferencesStore'

describe('PreferencesStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    usePreferencesStore.setState({
      preferences: [],
      isSubmitted: false
    })
  })

  // Test 1: Ajouter une préférence
  it('devrait ajouter une préférence avec succès', () => {
    const store = usePreferencesStore.getState()

    const result = store.addPreference('participant-1')

    expect(result).toBe(true)
    expect(usePreferencesStore.getState().preferences).toHaveLength(1)
    expect(usePreferencesStore.getState().preferences[0]).toEqual({
      participantId: 'participant-1',
      order: 1
    })
  })

  // Test 2: Ne pas ajouter de doublon
  it('ne devrait pas ajouter un participant déjà dans les préférences', () => {
    const store = usePreferencesStore.getState()

    store.addPreference('participant-1')
    const result = store.addPreference('participant-1')

    expect(result).toBe(false)
    expect(usePreferencesStore.getState().preferences).toHaveLength(1)
  })

  // Test 3: Pas de limite de préférences
  it('devrait permettre d\'ajouter plus de 10 préférences (pas de limite)', () => {
    const store = usePreferencesStore.getState()

    // Ajouter 15 préférences
    for (let i = 1; i <= 15; i++) {
      store.addPreference(`participant-${i}`)
    }

    expect(usePreferencesStore.getState().preferences).toHaveLength(15)
  })

  // Test 4: Supprimer une préférence et renuméroter
  it('devrait supprimer une préférence et renuméroter les autres', () => {
    const store = usePreferencesStore.getState()

    store.addPreference('participant-1')
    store.addPreference('participant-2')
    store.addPreference('participant-3')

    store.removePreference('participant-2')

    const prefs = usePreferencesStore.getState().preferences
    expect(prefs).toHaveLength(2)
    expect(prefs[0].order).toBe(1)
    expect(prefs[1].order).toBe(2)
    expect(prefs[1].participantId).toBe('participant-3')
  })

  // Test 5: Modifier après soumission
  it('devrait permettre de modifier après soumission avec unsubmitPreferences', () => {
    const store = usePreferencesStore.getState()

    store.addPreference('participant-1')
    store.submitPreferences()

    expect(usePreferencesStore.getState().isSubmitted).toBe(true)

    // Annuler la soumission pour modifier
    usePreferencesStore.getState().unsubmitPreferences()

    expect(usePreferencesStore.getState().isSubmitted).toBe(false)

    // On peut maintenant ajouter
    const result = usePreferencesStore.getState().addPreference('participant-2')
    expect(result).toBe(true)
    expect(usePreferencesStore.getState().preferences).toHaveLength(2)
  })

  // Test 6: canAddMore retourne toujours true (pas de limite)
  it('canAddMore devrait toujours retourner true (pas de limite)', () => {
    const store = usePreferencesStore.getState()

    expect(store.canAddMore()).toBe(true)

    // Même après avoir ajouté beaucoup de préférences
    for (let i = 1; i <= 20; i++) {
      store.addPreference(`participant-${i}`)
    }

    expect(usePreferencesStore.getState().canAddMore()).toBe(true)
  })
})
