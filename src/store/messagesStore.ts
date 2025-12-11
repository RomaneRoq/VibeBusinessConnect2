import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message, Conversation } from '@/types'
import { sampleMessages, sampleConversations } from '@/data/messages'
import { participants } from '@/data/participants'

interface MessagesState {
  messages: Message[]
  conversations: Conversation[]
  activeConversationId: string | null

  // Actions
  setActiveConversation: (conversationId: string | null) => void
  getConversationMessages: (conversationId: string) => Message[]
  sendMessage: (conversationId: string, content: string) => void
  markAsRead: (conversationId: string) => void
  startConversation: (participantId: string) => string
  getTotalUnreadCount: () => number
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      messages: sampleMessages,
      conversations: sampleConversations,
      activeConversationId: null,

      setActiveConversation: (conversationId) => {
        set({ activeConversationId: conversationId })
        if (conversationId) {
          get().markAsRead(conversationId)
        }
      },

      getConversationMessages: (conversationId: string) => {
        return get().messages
          .filter(m => m.conversationId === conversationId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      },

      sendMessage: (conversationId: string, content: string) => {
        const newMessage: Message = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderId: 'current-user',
          receiverId: get().conversations.find(c => c.id === conversationId)?.participantId || '',
          content,
          createdAt: new Date().toISOString(),
          read: true
        }

        set(state => ({
          messages: [...state.messages, newMessage],
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? { ...conv, lastMessage: newMessage }
              : conv
          )
        }))
      },

      markAsRead: (conversationId: string) => {
        set(state => ({
          messages: state.messages.map(msg =>
            msg.conversationId === conversationId
              ? { ...msg, read: true }
              : msg
          ),
          conversations: state.conversations.map(conv =>
            conv.id === conversationId
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        }))
      },

      startConversation: (participantId: string) => {
        const { conversations } = get()
        const existing = conversations.find(c => c.participantId === participantId)

        if (existing) {
          set({ activeConversationId: existing.id })
          return existing.id
        }

        const participant = participants.find(p => p.id === participantId)
        if (!participant) return ''

        const newConversation: Conversation = {
          id: `conv-${Date.now()}`,
          participantId,
          participant,
          unreadCount: 0,
          createdAt: new Date().toISOString()
        }

        set(state => ({
          conversations: [newConversation, ...state.conversations],
          activeConversationId: newConversation.id
        }))

        return newConversation.id
      },

      getTotalUnreadCount: () => {
        return get().conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)
      }
    }),
    {
      name: 'business-connect-messages'
    }
  )
)
