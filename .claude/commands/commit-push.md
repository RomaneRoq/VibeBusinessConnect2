# Commit et Push

Effectue un commit et un push en une seule commande.

## Instructions

1. Exécute `git status` pour voir les fichiers modifiés
2. Exécute `git diff --staged` et `git diff` pour voir les changements
3. Ajoute tous les fichiers modifiés avec `git add .`
4. Crée un commit avec le message fourni: $ARGUMENTS
5. Push vers le remote origin

Si aucun message n'est fourni, demande à l'utilisateur d'en fournir un.

Ne commite jamais de fichiers sensibles (.env, credentials, secrets).
