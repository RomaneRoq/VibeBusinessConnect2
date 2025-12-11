import type { EventInfo, ProgramItem } from '@/types'

export const eventInfo: EventInfo = {
  id: 'event-fintech-2025',
  name: 'Fintech & Regtech Connect 2025',
  date: '2025-02-15',
  startTime: '09:00',
  endTime: '18:00',
  location: {
    name: 'Le Village by CA Luxembourg',
    address: '39 Rue du Puits Romain',
    city: 'Luxembourg',
    country: 'Luxembourg',
    coordinates: {
      lat: 49.6116,
      lng: 6.1319
    }
  },
  description: 'Une journée de rencontres B2B dédiée à l\'innovation financière. Connectez-vous avec les acteurs clés de l\'écosystème Fintech & Regtech luxembourgeois lors de speed-meetings de 15 minutes.',
  thematic: 'Fintech & Regtech',
  organizer: {
    name: 'Village by CA Luxembourg',
    email: 'events@village-ca.lu',
    phone: '+352 26 27 28 29'
  },
  parking: 'Parking souterrain disponible - entrée rue du Puits Romain. Places réservées aux participants sur présentation du badge.',
  access: 'Bus : lignes 4, 16, 18 - arrêt "Kirchberg Centre". Tram : ligne 1 - arrêt "Rout Bréck - Pafendall". En voiture : suivre direction Kirchberg, puis GPS.'
}

export const programItems: ProgramItem[] = [
  {
    id: 'prog-1',
    startTime: '09:00',
    endTime: '09:30',
    title: 'Accueil et petit-déjeuner',
    description: 'Café, viennoiseries et networking informel. Récupérez votre badge à l\'accueil.',
    type: 'networking',
    location: 'Hall d\'entrée'
  },
  {
    id: 'prog-2',
    startTime: '09:30',
    endTime: '10:00',
    title: 'Keynote d\'ouverture',
    description: 'L\'avenir de la finance au Luxembourg : défis et opportunités pour 2025',
    type: 'keynote',
    speaker: 'Marc Baertz, Directeur Le Village by CA',
    location: 'Auditorium'
  },
  {
    id: 'prog-3',
    startTime: '10:00',
    endTime: '12:30',
    title: 'Session de Speed-Meetings #1',
    description: 'Première session de rencontres B2B. Consultez votre agenda pour connaître vos rendez-vous.',
    type: 'speed_meeting',
    location: 'Espace Speed-Meeting'
  },
  {
    id: 'prog-4',
    startTime: '12:30',
    endTime: '14:00',
    title: 'Déjeuner networking',
    description: 'Buffet déjeunatoire et networking libre. Continuez vos discussions dans un cadre décontracté.',
    type: 'break',
    location: 'Restaurant Le Village'
  },
  {
    id: 'prog-5',
    startTime: '14:00',
    endTime: '14:30',
    title: 'Table ronde : RegTech & Conformité',
    description: 'Comment les nouvelles technologies transforment la conformité réglementaire ?',
    type: 'keynote',
    speaker: 'Panel d\'experts CSSF & KPMG',
    location: 'Auditorium'
  },
  {
    id: 'prog-6',
    startTime: '14:30',
    endTime: '17:00',
    title: 'Session de Speed-Meetings #2',
    description: 'Deuxième session de rencontres B2B. Consultez votre agenda pour connaître vos rendez-vous.',
    type: 'speed_meeting',
    location: 'Espace Speed-Meeting'
  },
  {
    id: 'prog-7',
    startTime: '17:00',
    endTime: '17:30',
    title: 'Keynote de clôture',
    description: 'Retour sur la journée et perspectives pour l\'écosystème Fintech luxembourgeois.',
    type: 'keynote',
    speaker: 'Nasir Zubairi, CEO LHoFT',
    location: 'Auditorium'
  },
  {
    id: 'prog-8',
    startTime: '17:30',
    endTime: '19:00',
    title: 'Cocktail networking',
    description: 'Cocktail de clôture et networking libre. L\'occasion de conclure vos discussions de la journée.',
    type: 'networking',
    location: 'Terrasse panoramique'
  }
]

export default { eventInfo, programItems }
