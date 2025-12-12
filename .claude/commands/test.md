---
description: Lance les tests unitaires du projet et affiche les résultats
---

# Commande de Test

Execute les tests unitaires avec Vitest et analyse les résultats.

## Règles métier à connaître

Les tests doivent respecter ces règles :
- **Pas de limite** sur le nombre de préférences
- **Modification autorisée** après soumission
- **Pas de doublons** (seule restriction)

## Instructions

1. Lance la commande `npm run test` dans le répertoire du projet
2. Analyse la sortie des tests
3. Si des tests échouent :
   - Identifie les tests en échec
   - Vérifie si le test respecte les règles métier actuelles
   - Lis les fichiers de test concernés
   - Propose des corrections si possible
4. Affiche un résumé clair :
   - Nombre de tests passés/échoués
   - Temps d'exécution
   - Détails des erreurs si présentes

## Format de sortie attendu

Présente les résultats de manière claire et concise avec :
- Un emoji vert (✅) pour les tests passés
- Un emoji rouge (❌) pour les tests échoués
- Le nom des fichiers de test et leur statut
