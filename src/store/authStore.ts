import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Participant, ParticipantType, Sector, StartupStage, PartnershipType } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<Participant>) => void
  completeOnboarding: () => void
}

export interface RegisterData {
  email: string
  password: string
  type: ParticipantType
  name: string
  sector: Sector
}

export interface OnboardingData {
  logo?: string
  pitch: string
  description: string
  website?: string
  linkedIn?: string
  twitter?: string

  // Startup specific
  stage?: StartupStage
  fundingRaised?: string
  teamSize?: number
  foundedYear?: number

  // Enterprise specific
  employeeCount?: string
  annualRevenue?: string
  innovationBudget?: string
  resources?: string[]

  // Common
  lookingFor: PartnershipType[]
  thematicsInterest: string[]
}

// Simulated user for demo
const createDemoUser = (data: RegisterData): User => {
  const participantId = `user-${Date.now()}`
  return {
    id: participantId,
    email: data.email,
    participantId,
    participant: {
      id: participantId,
      type: data.type,
      name: data.name,
      sector: data.sector,
      pitch: '',
      description: '',
      email: data.email,
      lookingFor: [],
      thematicsInterest: [],
      createdAt: new Date().toISOString()
    },
    onboardingCompleted: false,
    createdAt: new Date().toISOString()
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, _password: string) => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // For demo, create a user based on email
        const isStartup = email.includes('startup')
        const demoUser: User = {
          id: 'demo-user',
          email,
          participantId: 'demo-participant',
          participant: {
            id: 'demo-participant',
            type: isStartup ? 'startup' : 'enterprise',
            name: isStartup ? 'Ma Startup Fintech' : 'Mon Entreprise',
            logo: `https://api.dicebear.com/7.x/initials/svg?seed=${email}&backgroundColor=1E3A5F`,
            sector: 'fintech',
            pitch: 'Solution innovante pour la finance de demain.',
            description: 'Nous développons des solutions technologiques pour transformer le secteur financier.',
            email,
            website: 'https://example.com',
            stage: isStartup ? 'seed' : undefined,
            fundingRaised: isStartup ? '500K€' : undefined,
            teamSize: isStartup ? 8 : undefined,
            employeeCount: !isStartup ? '100-500' : undefined,
            lookingFor: ['partner', 'client'],
            thematicsInterest: ['Fintech', 'Innovation', 'Digital'],
            createdAt: new Date().toISOString()
          },
          onboardingCompleted: true,
          createdAt: new Date().toISOString()
        }

        set({
          user: demoUser,
          isAuthenticated: true,
          isLoading: false
        })

        return true
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        const newUser = createDemoUser(data)

        set({
          user: newUser,
          isAuthenticated: true,
          isLoading: false
        })

        return true
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        })
      },

      updateProfile: (data: Partial<Participant>) => {
        const { user } = get()
        if (!user) return

        set({
          user: {
            ...user,
            participant: {
              ...user.participant,
              ...data
            }
          }
        })
      },

      completeOnboarding: () => {
        const { user } = get()
        if (!user) return

        set({
          user: {
            ...user,
            onboardingCompleted: true
          }
        })
      }
    }),
    {
      name: 'business-connect-auth'
    }
  )
)
