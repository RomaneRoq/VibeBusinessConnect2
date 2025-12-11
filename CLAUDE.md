System Prompt — BusinessConnect
Ce document est la "mémoire" de ton projet. L'IA le lit à chaque session pour comprendre le contexte et garder une cohérence dans ses réponses.
# Project Overview
💡 Décris ton projet comme si tu l'expliquais à quelqu'un qui n'y connaît rien. Sois clair et concis.
Description du projet
BusinessConnect est une application web qui permet aux participants d'événements B2B (startups et entreprises) de se connecter efficacement. La plateforme facilite l'inscription, le matching basé sur les préférences, et la génération d'agendas personnalisés pour des speed-meetings de 15 minutes.
Pour qui ?
•	Startups cherchant des partenaires, clients ou investisseurs
•	Entreprises établies recherchant des solutions innovantes
•	Organisateurs (Village by CA Luxembourg) qui gèrent les événements
Fonctionnalités principales
•	Inscription et création de profil (startup ou entreprise)
•	Exploration et filtrage des participants par secteur/thématique
•	Expression des préférences de rencontres (jusqu'à 10 choix)
•	Agenda personnalisé avec créneaux de 15 min (10h-17h)
•	Programme de l'événement et informations pratiques
•	Messagerie entre participants
•	Chatbot d'assistance (réponses scriptées)
Ce qu'on ne fait PAS (MVP)
Pas de backend réel (données mockées), pas d'algorithme de matching automatique, pas de paiement, pas de visioconférence, pas de multi-événements, pas de dashboard admin, pas de chatbot IA.
# Tech Stack
💡 Liste les technologies choisies. Ça aide l'IA à générer du code compatible avec ton projet.
Quoi ?	Technologie choisie
Framework	React 18+ avec TypeScript
Styling	TailwindCSS
UI Components	Shadcn/ui (basé sur Radix UI)
State Management	Zustand ou React Context
Routing	React Router v6
Icons	Lucide React
Drag & Drop	@dnd-kit/core
Données (MVP)	JSON mockés + LocalStorage

# Architecture et Workflow
💡 Explique comment ton projet est organisé. Où sont les fichiers ? Comment tu travailles ?
Organisation des dossiers
Le projet est divisé en plusieurs dossiers principaux :
•	/src/components → Composants réutilisables (Button, Card, Modal...)
•	/src/pages → Les écrans de l'application (Dashboard, Participants, Agenda...)
•	/src/layouts → Layouts partagés (AuthLayout, DashboardLayout)
•	/src/hooks → Hooks personnalisés (useAuth, useParticipants...)
•	/src/store → State management (Zustand stores)
•	/src/data → Données mockées en JSON
•	/src/types → Types TypeScript partagés
•	/src/utils → Fonctions utilitaires (formatDate, formatTime...)
Comment on travaille
•	On crée une branche par fonctionnalité (ex: feature/page-agenda)
•	On teste manuellement avant de fusionner dans main
•	On nomme les commits clairement (ex: "Ajout du composant ParticipantCard")
# Design
💡 Définis ton identité visuelle. L'IA pourra ainsi créer des écrans cohérents avec ton style.
Couleurs principales
Usage	Couleur	Code
Couleur principale	Bleu foncé	#1E3A5F
Accent / liens	Bleu vif	#2980B9
Succès / positif	Vert	#10B981
Erreur / alerte	Rouge	#EF4444
Attention / warning	Orange	#F59E0B

Style général
•	Tout doit etre responsive : desktop, mobile, app.
•	Simple et clair : Pas trop de texte, des icônes explicites, couleurs cohérentes
•	Accessible : WCAG 2.1 AA, texte lisible, boutons cliquables facilement
•	Feedback visuel : L'utilisateur sait toujours ce qui se passe (loading, succès, erreur)
•	Professionnel : Design épuré qui inspire confiance pour le B2B
# Conventions
💡 Tes règles de nommage et bonnes pratiques. L'IA les suivra pour garder un code propre et cohérent.
Nommage des fichiers
Type de fichier	Comment on le nomme	Exemple
Composant	PascalCase	ParticipantCard.tsx
Page / écran	PascalCase	Dashboard.tsx
Hook personnalisé	camelCase avec 'use'	useAuth.ts
Fonction utilitaire	camelCase	formatDate.ts
Type / Interface	PascalCase	Participant.ts
Store Zustand	camelCase avec 'Store'	authStore.ts

Bonnes pratiques
•	Un composant = un fichier (pas de fichier fourre-tout)
•	Les textes affichés à l'utilisateur sont en français
•	On commente le code quand c'est utile (pas de commentaire évident)
•	On utilise des types TypeScript stricts (pas de 'any')
•	On préfère les composants fonctionnels avec hooks
•	On teste manuellement chaque fonctionnalité avant de valider
# Décisions prises
💡 Note ici les choix importants que tu as faits. Ça évite de te reposer la question plus tard !
Décision	Pourquoi ?
React + TypeScript	Écosystème mature, typage fort, facilite la maintenance
TailwindCSS	Rapide à écrire, cohérent, bien documenté
Shadcn/ui	Composants accessibles, personnalisables, pas de dépendance lourde
Zustand plutôt que Redux	Plus léger, moins de boilerplate, suffisant pour le MVP
Données mockées (pas de backend)	MVP front-end only, structure prête pour futur backend
Chatbot avec réponses scriptées	Pas d'IA pour le MVP, intégration LLM prévue en V2

⚠️ Mets à jour ce document à chaque décision importante !