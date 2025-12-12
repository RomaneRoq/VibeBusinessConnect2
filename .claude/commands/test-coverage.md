---
description: Lance les tests avec couverture de code et analyse les résultats
---

# Commande de Test avec Couverture

Execute les tests unitaires avec analyse de couverture de code.

## Règles métier à connaître

Les tests doivent respecter ces règles :
- **Pas de limite** sur le nombre de préférences
- **Modification autorisée** après soumission
- **Pas de doublons** (seule restriction)

## Instructions

1. Installe @vitest/coverage-v8 si pas déjà installé : `npm install -D @vitest/coverage-v8`
2. Lance la commande `npm run test:coverage` dans le répertoire du projet
3. Analyse les résultats de couverture
4. Identifie les fichiers avec une couverture faible (< 80%)
5. Suggère des tests supplémentaires pour améliorer la couverture

## Tests prioritaires à ajouter

- `participantsStore.ts` : Filtres, favoris, recherche
- `messagesStore.ts` : Envoi de messages, conversations
- `agendaStore.ts` : Export ICS
- `authStore.ts` : Login, register, updateProfile

## Format de sortie attendu

Présente un tableau récapitulatif avec :
- Fichier testé
- % de lignes couvertes
- % de branches couvertes
- Recommandations pour améliorer la couverture
