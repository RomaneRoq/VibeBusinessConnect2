---
description: Skill pour gérer les tests unitaires du projet BusinessConnect - lancer les tests, analyser les résultats, générer de nouveaux tests
---

# Testing Skill - BusinessConnect

## Configuration des tests

Le projet utilise **Vitest** comme framework de test avec la configuration suivante :

- **Config** : `vitest.config.ts`
- **Setup** : `src/test/setup.ts`
- **Tests** : `src/test/*.test.ts`

## Commandes disponibles

```bash
# Lancer tous les tests
npm run test

# Lancer les tests en mode watch
npm run test:watch

# Lancer les tests avec couverture
npm run test:coverage
```

## Structure des tests existants

### preferencesStore.test.ts (6 tests)
1. Ajouter une préférence avec succès
2. Ne pas ajouter de doublon
3. Pas de limite de préférences (peut en ajouter plus de 10)
4. Supprimer et renuméroter
5. Modifier après soumission avec `unsubmitPreferences()`
6. `canAddMore()` retourne toujours true

### chatbotResponses.test.ts (4 tests)
7. Trouver une réponse par keyword
8. Réponse par défaut si aucun match
9. Insensibilité à la casse
10. Réponse pour l'agenda

## Règles métier importantes

- **Pas de limite** sur le nombre de préférences
- **Modification autorisée** après soumission (via `unsubmitPreferences()`)
- Seule restriction : pas de doublons dans les préférences

## Fichiers testables (non encore testés)

- `src/store/participantsStore.ts` - Filtres et favoris
- `src/store/messagesStore.ts` - Messagerie
- `src/store/agendaStore.ts` - Export ICS
- `src/store/authStore.ts` - Authentification
- `src/data/agenda.ts` - Génération des créneaux

## Bonnes pratiques

1. **Reset le state** avant chaque test avec `beforeEach`
2. **Une assertion par test** pour des tests clairs
3. **Noms descriptifs** en français ("devrait...")
4. **Tester les edge cases** (doublons, listes vides)
