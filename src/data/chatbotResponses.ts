import type { ChatbotResponse } from '@/types'

export const chatbotResponses: ChatbotResponse[] = [
  {
    keywords: ['bonjour', 'salut', 'hello', 'hey', 'bonsoir'],
    response: 'Bonjour ! Je suis l\'assistant BusinessConnect. Comment puis-je vous aider aujourd\'hui ?',
    followUp: 'Vous pouvez me poser des questions sur l\'événement, votre agenda, ou comment utiliser la plateforme.'
  },
  {
    keywords: ['agenda', 'rendez-vous', 'rdv', 'meeting', 'rencontre'],
    response: 'Votre agenda personnalisé est disponible dans la section "Mon Agenda". Vous y trouverez tous vos rendez-vous de la journée avec les créneaux horaires, les noms des participants et les numéros de tables.',
    followUp: 'Vous pouvez également exporter votre agenda au format ICS pour l\'ajouter à votre calendrier personnel.'
  },
  {
    keywords: ['préférence', 'choix', 'sélection', 'souhaite', 'rencontrer'],
    response: 'Vous pouvez exprimer jusqu\'à 10 préférences de rencontres dans la section "Mes Préférences". Classez-les par ordre de priorité en utilisant le drag & drop.',
    followUp: 'La date limite pour soumettre vos préférences est indiquée en haut de la page. N\'oubliez pas de valider vos choix !'
  },
  {
    keywords: ['participant', 'entreprise', 'startup', 'liste', 'voir'],
    response: 'La liste complète des participants est disponible dans la section "Participants". Vous pouvez filtrer par type (Startup/Entreprise), secteur d\'activité ou thématique.',
    followUp: 'Cliquez sur une carte participant pour voir son profil détaillé et l\'ajouter à vos préférences.'
  },
  {
    keywords: ['message', 'contacter', 'écrire', 'communication'],
    response: 'Vous pouvez envoyer des messages aux autres participants via la section "Messages". Cela vous permet de préparer vos rencontres en amont.',
    followUp: 'Les nouveaux messages sont signalés par une notification dans la barre de navigation.'
  },
  {
    keywords: ['lieu', 'adresse', 'parking', 'accès', 'venir', 'comment'],
    response: 'L\'événement se déroule au Village by CA Luxembourg, 39 Rue du Puits Romain. Un parking est disponible sur place.',
    followUp: 'Retrouvez toutes les informations pratiques (accès, parking, transports) dans la section "Infos pratiques".'
  },
  {
    keywords: ['heure', 'horaire', 'quand', 'programme', 'déroulement'],
    response: 'L\'événement se déroule de 9h00 à 19h00. Les speed-meetings ont lieu de 10h00 à 12h30 puis de 14h30 à 17h00.',
    followUp: 'Consultez le programme complet dans la section "Programme" pour voir les keynotes, pauses et moments de networking.'
  },
  {
    keywords: ['profil', 'modifier', 'changer', 'paramètre', 'compte'],
    response: 'Vous pouvez modifier votre profil et vos paramètres dans la section "Paramètres" accessible depuis le menu.',
    followUp: 'Pensez à compléter votre profil pour maximiser vos chances de matching pertinent !'
  },
  {
    keywords: ['table', 'numéro', 'où', 'trouver'],
    response: 'Chaque rendez-vous est associé à un numéro de table. Vous trouverez cette information dans votre agenda, sur chaque créneau de meeting.',
    followUp: 'Un plan de l\'espace speed-meeting est affiché sur place pour vous guider.'
  },
  {
    keywords: ['problème', 'aide', 'bug', 'erreur', 'marche pas'],
    response: 'Je suis désolé que vous rencontriez des difficultés. Pour une assistance personnalisée, vous pouvez contacter l\'équipe organisatrice.',
    followUp: 'Email : events@village-ca.lu | Téléphone : +352 26 27 28 29'
  },
  {
    keywords: ['merci', 'super', 'parfait', 'génial', 'cool'],
    response: 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions. Je suis là pour vous aider.',
    followUp: 'Bonne journée et bonnes rencontres !'
  },
  {
    keywords: ['export', 'ics', 'calendrier', 'google', 'outlook'],
    response: 'Vous pouvez exporter votre agenda au format ICS depuis la section "Mon Agenda". Cliquez sur le bouton "Exporter" en haut à droite.',
    followUp: 'Le fichier ICS est compatible avec Google Calendar, Outlook, Apple Calendar et la plupart des applications de calendrier.'
  },
  {
    keywords: ['wifi', 'internet', 'connexion', 'réseau'],
    response: 'Un réseau WiFi gratuit est disponible sur place. Nom du réseau : Village_Event | Mot de passe : disponible à l\'accueil.',
    followUp: 'En cas de problème de connexion, n\'hésitez pas à demander à l\'équipe sur place.'
  },
  {
    keywords: ['badge', 'accréditation', 'entrée', 'inscription'],
    response: 'Votre badge vous attend à l\'accueil dès 9h00. Présentez-vous avec une pièce d\'identité ou montrez votre confirmation d\'inscription.',
    followUp: 'Le badge est nécessaire pour accéder à l\'espace speed-meeting et au déjeuner.'
  }
]

export const defaultResponse: ChatbotResponse = {
  keywords: [],
  response: 'Je ne suis pas sûr de comprendre votre question. Pouvez-vous reformuler ou être plus précis ?',
  followUp: 'Si vous avez besoin d\'une assistance personnalisée, contactez l\'équipe : events@village-ca.lu'
}

export function findResponse(message: string): ChatbotResponse {
  const lowerMessage = message.toLowerCase()

  for (const response of chatbotResponses) {
    for (const keyword of response.keywords) {
      if (lowerMessage.includes(keyword)) {
        return response
      }
    }
  }

  return defaultResponse
}

export default { chatbotResponses, defaultResponse, findResponse }
