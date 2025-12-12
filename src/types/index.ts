// Types principaux pour BusinessConnect

export type ParticipantType = 'startup' | 'enterprise'

export type Sector =
  | 'fintech'
  | 'regtech'
  | 'insurtech'
  | 'blockchain'
  | 'cybersecurity'
  | 'ai_ml'
  | 'payments'
  | 'banking'
  | 'compliance'
  | 'data_analytics'

export type StartupStage =
  | 'idea'
  | 'mvp'
  | 'bootstrap'
  | 'seed'
  | 'series_a'
  | 'series_b'
  | 'scale_up'

export type PartnershipType =
  | 'client'
  | 'partner'
  | 'investor'
  | 'supplier'
  | 'mentor'

export interface Participant {
  id: string
  type: ParticipantType
  name: string
  logo?: string
  sector: Sector
  pitch: string
  description: string
  website?: string
  linkedIn?: string
  twitter?: string
  email: string

  // Startup specific
  stage?: StartupStage
  fundingRaised?: string
  teamSize?: number
  foundedYear?: number
  isVillageNetwork?: boolean

  // Enterprise specific
  employeeCount?: string
  annualRevenue?: string
  innovationBudget?: string
  resources?: string[]

  // Common
  lookingFor: PartnershipType[]
  thematicsInterest: string[]
  createdAt: string
}

export interface User {
  id: string
  email: string
  participantId: string
  participant: Participant
  onboardingCompleted: boolean
  createdAt: string
}

export interface Meeting {
  id: string
  startTime: string
  endTime: string
  participantId: string
  participant: Participant
  table: string
  notes?: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  type: 'meeting' | 'break' | 'free' | 'keynote'
  meeting?: Meeting
  label?: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  createdAt: string
  read: boolean
}

export interface Conversation {
  id: string
  participantId: string
  participant: Participant
  lastMessage?: Message
  unreadCount: number
  createdAt: string
}

export interface EventInfo {
  id: string
  name: string
  date: string
  startTime: string
  endTime: string
  location: {
    name: string
    address: string
    city: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  description: string
  thematic: string
  organizer: {
    name: string
    email: string
    phone: string
  }
  parking: string
  access: string
}

export interface ProgramItem {
  id: string
  startTime: string
  endTime: string
  title: string
  description: string
  type: 'keynote' | 'networking' | 'break' | 'speed_meeting' | 'workshop'
  speaker?: string
  location?: string
}

export interface ChatbotResponse {
  keywords: string[]
  response: string
  followUp?: string
}

export interface Preference {
  participantId: string
  order: number
}

// Utility types
export type SectorLabel = {
  [key in Sector]: string
}

export type StageLabel = {
  [key in StartupStage]: string
}

// Constants
export const SECTOR_LABELS: SectorLabel = {
  fintech: 'Fintech',
  regtech: 'Regtech',
  insurtech: 'Insurtech',
  blockchain: 'Blockchain',
  cybersecurity: 'Cybersécurité',
  ai_ml: 'IA & Machine Learning',
  payments: 'Paiements',
  banking: 'Banque',
  compliance: 'Conformité',
  data_analytics: 'Data Analytics'
}

export const STAGE_LABELS: StageLabel = {
  idea: 'Idée',
  mvp: 'MVP',
  bootstrap: 'Bootstrap',
  seed: 'Seed',
  series_a: 'Série A',
  series_b: 'Série B',
  scale_up: 'Scale-up'
}

export const PARTNERSHIP_LABELS: Record<PartnershipType, string> = {
  client: 'Clients',
  partner: 'Partenaires',
  investor: 'Investisseurs',
  supplier: 'Fournisseurs',
  mentor: 'Mentors'
}
