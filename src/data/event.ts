import type { EventInfo, ProgramItem } from '@/types'

export const eventInfo: EventInfo = {
  id: 'event-fintech-2025',
  name: 'Business Connect Fintech & Regtech 2025',
  date: '2025-02-25',
  startTime: '10:00',
  endTime: '17:00',
  location: {
    name: 'House of Startups',
    address: '9 Rue du Laboratoire',
    city: 'Luxembourg',
    country: 'Luxembourg',
    coordinates: {
      lat: 49.6117,
      lng: 6.1296
    }
  },
  description: 'Une journée de rencontres B2B dédiée à l\'innovation financière. Connectez-vous avec les acteurs clés de l\'écosystème Fintech & Regtech luxembourgeois lors de speed-meetings de 15 minutes.',
  thematic: 'Fintech & Regtech',
  organizer: {
    name: 'Village by CA Luxembourg',
    email: 'events@village-ca.lu',
    phone: '+352 26 27 28 29'
  },
  parking: 'Parking public Knuedler à proximité (5 min à pied). Parking Monterey également disponible.',
  access: 'Bus : lignes 2, 3, 4 - arrêt "Hamilius". Tram : ligne 1 - arrêt "Hamilius". En voiture : suivre direction Centre-Ville, puis GPS vers Rue du Laboratoire.'
}

export const programItems: ProgramItem[] = [
  {
    id: 'prog-1',
    startTime: '10:00',
    endTime: '10:15',
    title: 'Accueil café',
    description: 'Café et networking informel. Récupérez votre badge à l\'accueil.',
    type: 'networking',
    location: 'Hall d\'entrée'
  },
  {
    id: 'prog-2',
    startTime: '10:15',
    endTime: '10:30',
    title: 'Mot de bienvenue',
    description: 'Introduction à la journée et présentation du programme',
    type: 'keynote',
    speaker: 'Village by CA Luxembourg',
    location: 'Salle principale'
  },
  {
    id: 'prog-3',
    startTime: '10:30',
    endTime: '12:30',
    title: 'Session de Speed-Meetings #1',
    description: 'Première session de rencontres B2B. Consultez votre agenda pour connaître vos rendez-vous.',
    type: 'speed_meeting',
    location: 'Espace Speed-Meeting'
  },
  {
    id: 'prog-4',
    startTime: '12:30',
    endTime: '13:30',
    title: 'Pause déjeuner',
    description: 'Buffet déjeunatoire et networking libre.',
    type: 'break',
    location: 'Espace restauration'
  },
  {
    id: 'prog-5',
    startTime: '13:30',
    endTime: '15:30',
    title: 'Session de Speed-Meetings #2',
    description: 'Deuxième session de rencontres B2B. Consultez votre agenda pour connaître vos rendez-vous.',
    type: 'speed_meeting',
    location: 'Espace Speed-Meeting'
  },
  {
    id: 'prog-6',
    startTime: '15:30',
    endTime: '15:45',
    title: 'Pause café',
    description: 'Pause et networking.',
    type: 'break',
    location: 'Espace café'
  },
  {
    id: 'prog-7',
    startTime: '15:45',
    endTime: '17:00',
    title: 'Session de Speed-Meetings #3',
    description: 'Dernière session de rencontres B2B.',
    type: 'speed_meeting',
    location: 'Espace Speed-Meeting'
  }
]

export default { eventInfo, programItems }
