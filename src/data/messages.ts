import type { Message, Conversation } from '@/types'
import { participants } from './participants'

export const sampleMessages: Message[] = [
  // Conversation with BGL BNP Paribas
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'enterprise-1',
    receiverId: 'current-user',
    content: 'Bonjour ! J\'ai vu votre profil et je suis très intéressé par votre solution. Pouvons-nous en discuter lors de notre rendez-vous de 10h ?',
    createdAt: '2025-02-14T14:30:00Z',
    read: true
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'current-user',
    receiverId: 'enterprise-1',
    content: 'Bonjour ! Oui avec plaisir. J\'ai préparé une courte démo de notre solution. Avez-vous des cas d\'usage spécifiques en tête ?',
    createdAt: '2025-02-14T15:00:00Z',
    read: true
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'enterprise-1',
    receiverId: 'current-user',
    content: 'Parfait ! Nous cherchons à améliorer notre processus de KYC. J\'aimerais voir comment votre solution peut s\'intégrer à notre système existant.',
    createdAt: '2025-02-14T15:30:00Z',
    read: false
  },

  // Conversation with CyberShield
  {
    id: 'msg-4',
    conversationId: 'conv-2',
    senderId: 'startup-3',
    receiverId: 'current-user',
    content: 'Hello ! Sympa de voir qu\'on sera tous les deux à l\'événement. On pourrait peut-être explorer des synergies entre nos solutions ?',
    createdAt: '2025-02-14T10:00:00Z',
    read: true
  },
  {
    id: 'msg-5',
    conversationId: 'conv-2',
    senderId: 'current-user',
    receiverId: 'startup-3',
    content: 'Salut ! Oui bonne idée. Votre solution de détection de fraude pourrait être complémentaire à notre offre. On en parle demain ?',
    createdAt: '2025-02-14T11:00:00Z',
    read: true
  },

  // Conversation with Clearstream
  {
    id: 'msg-6',
    conversationId: 'conv-3',
    senderId: 'enterprise-6',
    receiverId: 'current-user',
    content: 'Nous avons un projet de tokenisation d\'actifs en cours. Votre expertise blockchain nous intéresse. Pouvez-vous nous présenter vos références dans ce domaine ?',
    createdAt: '2025-02-13T16:00:00Z',
    read: true
  }
]

export const sampleConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantId: 'enterprise-1',
    participant: participants.find(p => p.id === 'enterprise-1')!,
    lastMessage: sampleMessages.find(m => m.id === 'msg-3'),
    unreadCount: 1,
    createdAt: '2025-02-14T14:30:00Z'
  },
  {
    id: 'conv-2',
    participantId: 'startup-3',
    participant: participants.find(p => p.id === 'startup-3')!,
    lastMessage: sampleMessages.find(m => m.id === 'msg-5'),
    unreadCount: 0,
    createdAt: '2025-02-14T10:00:00Z'
  },
  {
    id: 'conv-3',
    participantId: 'enterprise-6',
    participant: participants.find(p => p.id === 'enterprise-6')!,
    lastMessage: sampleMessages.find(m => m.id === 'msg-6'),
    unreadCount: 0,
    createdAt: '2025-02-13T16:00:00Z'
  }
]

export default { sampleMessages, sampleConversations }
