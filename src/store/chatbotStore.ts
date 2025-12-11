import { create } from 'zustand'
import { findResponse } from '@/data/chatbotResponses'

interface ChatMessage {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
}

interface ChatbotState {
  isOpen: boolean
  messages: ChatMessage[]

  // Actions
  toggleChat: () => void
  openChat: () => void
  closeChat: () => void
  sendMessage: (content: string) => void
  clearMessages: () => void
}

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  content: 'Bonjour ! Je suis l\'assistant BusinessConnect. Comment puis-je vous aider ?',
  isBot: true,
  timestamp: new Date()
}

export const useChatbotStore = create<ChatbotState>()((set) => ({
  isOpen: false,
  messages: [welcomeMessage],

  toggleChat: () => {
    set(state => ({ isOpen: !state.isOpen }))
  },

  openChat: () => {
    set({ isOpen: true })
  },

  closeChat: () => {
    set({ isOpen: false })
  },

  sendMessage: (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      isBot: false,
      timestamp: new Date()
    }

    // Add user message
    set(state => ({
      messages: [...state.messages, userMessage]
    }))

    // Simulate typing delay and respond
    setTimeout(() => {
      const response = findResponse(content)
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        content: response.response + (response.followUp ? `\n\n${response.followUp}` : ''),
        isBot: true,
        timestamp: new Date()
      }

      set(state => ({
        messages: [...state.messages, botMessage]
      }))
    }, 800)
  },

  clearMessages: () => {
    set({ messages: [welcomeMessage] })
  }
}))
