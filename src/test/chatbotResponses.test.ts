import { describe, it, expect } from 'vitest'
import { findResponse, defaultResponse } from '@/data/chatbotResponses'

describe('ChatbotResponses - findResponse', () => {
  // Test 7: Trouver une réponse par keyword
  it('devrait trouver une réponse quand un keyword match', () => {
    const result = findResponse('Bonjour, comment ça va ?')

    expect(result.keywords).toContain('bonjour')
    expect(result.response).toContain('assistant BusinessConnect')
  })

  // Test 8: Réponse par défaut si aucun keyword
  it('devrait retourner la réponse par défaut si aucun keyword ne match', () => {
    const result = findResponse('xyz abc 123')

    expect(result).toEqual(defaultResponse)
    expect(result.response).toContain('pas sûr de comprendre')
  })

  // Test 9: Case insensitive
  it('devrait être insensible à la casse', () => {
    const resultLower = findResponse('bonjour')
    const resultUpper = findResponse('BONJOUR')
    const resultMixed = findResponse('BoNjOuR')

    expect(resultLower).toEqual(resultUpper)
    expect(resultLower).toEqual(resultMixed)
  })

  // Test 10: Keyword agenda
  it('devrait répondre correctement pour les questions sur l\'agenda', () => {
    const result = findResponse('Où est mon agenda ?')

    expect(result.response).toContain('agenda personnalisé')
    expect(result.followUp).toContain('ICS')
  })
})
