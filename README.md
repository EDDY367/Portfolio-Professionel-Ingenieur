# Portfolio Nexus

Portfolio personnel avec espace d'administration.

| Dossier     | Techno                                   | Rôle                                              |
| ----------- | ---------------------------------------- | ------------------------------------------------- |
| `backend/`  | Spring Boot 3, Java 21, PostgreSQL (Supabase) | API REST + sécurité JWT                      |
| `frontend/` | Angular 20                               | Site public + espace admin (`/admin`)             |

```
Navigateur ──► Angular (localhost:4200) ──HTTP/JSON──► Spring Boot (localhost:8080) ──► PostgreSQL
```

## 1. Prérequis

- **JDK 21**
- **Node.js 22 LTS** (Angular 20 exige Node `^20.19` ou `^22.12` ou plus récent)
- IntelliJ IDEA (il embarque Maven, rien d'autre à installer pour le backend)

## 2. Lancer le backend

Le backend lit sa configuration dans des **variables d'environnement**. Aucun secret n'est écrit dans le code.

Dans IntelliJ : `Run > Edit Configurations > PortfolioApplication > Environment variables`.

| Variable         | Obligatoire | Valeur                                                                    |
| ---------------- | :---------: | ------------------------------------------------------------------------- |
| `DB_URL`         | oui         | `jdbc:postgresql://<hote>:5432/postgres?sslmode=require` (Supabase)       |
| `DB_USER`        | oui         | `postgres.<reference-du-projet>` avec le pooler Supabase, sinon `postgres` |
| `DB_PASSWORD`    | oui         | mot de passe de la base                                                   |
| `JWT_SECRET`     | oui         | chaîne aléatoire d'au moins 32 caractères (voir ci-dessous)               |
| `CORS_ORIGINS`   | non         | origines autorisées pour le front (défaut `http://localhost:4200`)        |

Générer un `JWT_SECRET` (PowerShell) :

```powershell
-join ((1..48) | ForEach-Object { '{0:x2}' -f (Get-Random -Maximum 256) })
```

- Le compte admin vit uniquement dans la table `admin_users` de la base (mot de passe haché BCrypt) :
  l'application n'en crée aucun et ne lit aucune variable `ADMIN_*`.

Vérification : <http://localhost:8080/swagger-ui.html> (documentation interactive de l'API, profil `dev` uniquement).

Tests du backend (base en mémoire, aucune config requise) : `mvn test` dans `backend/`.

## 3. Lancer le frontend

```bash
cd frontend
npm install
npm start
```

Ouvre <http://localhost:4200>. L'espace admin est sur <http://localhost:4200/admin> (connexion avec le compte présent dans `admin_users`).

L'adresse de l'API est dans `frontend/src/environments/` :
`environment.development.ts` (utilisé par `npm start`) et `environment.ts` (utilisé par `npm run build`, **à remplacer par l'URL réelle de ton API avant de déployer**).

## 4. Où modifier quoi

| Je veux changer…                                  | Où                                                              |
| ------------------------------------------------- | --------------------------------------------------------------- |
| Mon profil, projets, compétences, parcours, liens | Espace admin (`/admin`) : tout est stocké en base               |
| Phrase d'accroche, citation, principes, légendes des catégories | `frontend/src/app/site.config.ts`                 |
| Logo, photo par défaut                            | `frontend/public/` (`logo-mark.svg`, `eddy-photo.jpg`)          |
| Couleurs, polices, mise en page                   | `frontend/src/styles.css` (variables CSS en haut du fichier)    |

Astuce pour mettre en avant la data / le ML : crée dans l'admin des catégories de compétences nommées
`Data`, `ML`, `Deep Learning`, `IA`, `MLOps` (elles ont déjà une légende dans `site.config.ts`), et un projet par notebook / modèle
avec son lien GitHub, Kaggle ou Hugging Face.

## 5. Comprendre le code (ordre de lecture conseillé)

### Backend (Spring Boot)
1. `controller/PublicController.java` : les routes publiques, très courtes.
2. `service/ProjectService.java` puis `repository/ProjectRepository.java` : la logique et l'accès à la base.
3. `dto/ProjectDto.java` : ce que l'API reçoit et renvoie, avec les règles de validation.
4. `configuration/SecurityConfig.java` : qui a le droit d'appeler quoi (`/api/v1/admin/**` → rôle ADMIN).
5. `controller/AuthController.java` + `security/JwtService.java` : la connexion et la création du jeton.

**Le flux de sécurité en 4 étapes :** 1) `POST /auth/login` avec e-mail + mot de passe →
2) le serveur compare avec le hash bcrypt en base et renvoie un **JWT** signé avec `JWT_SECRET` →
3) le front envoie `Authorization: Bearer <jwt>` sur chaque appel `/admin/**` →
4) Spring Security vérifie la signature et la date d'expiration, puis autorise ou répond 401.

### Frontend (Angular)
1. `app/app.routes.ts` : les pages (public, détail projet, connexion, admin).
2. `app/core/services/public-api.service.ts` : tous les appels au backend public.
3. `app/portfolio/hero.ts` : un composant simple (`input`, `computed`, template).
4. `app/core/services/auth.service.ts`, `interceptors/auth.interceptor.ts`, `guards/auth.guard.ts` : l'authentification côté front.
5. `app/admin/resources.ts` : **une seule description** par ressource (champs, validations) qui génère
   tout le formulaire admin. Pour ajouter un champ, c'est ici.

## 6. Dépannage

| Symptôme                                              | Cause probable / solution                                                        |
| ----------------------------------------------------- | -------------------------------------------------------------------------------- |
| `Could not resolve placeholder 'DB_URL'`              | Variable d'environnement manquante dans la configuration d'exécution            |
| Le site affiche « Le serveur est injoignable »        | Backend arrêté, ou mauvaise `apiUrl` dans `environment.development.ts`          |
| Erreur CORS dans la console du navigateur             | `CORS_ORIGINS` doit contenir l'origine exacte du front (ex. `http://localhost:4200`) |
| Connexion refusée                                     | Aucun compte dans la table `admin_users`, ou mauvais mot de passe                |
| Flyway : `Migration checksum mismatch`                | Un fichier de `db/migration` ou `db/seed` déjà appliqué a été modifié. **Ne modifie jamais une migration existante** : crée-en une nouvelle (`V4__...sql`) |

## 7. Mise en production (plus tard)

- Backend : `SPRING_PROFILES_ACTIVE=prod` (désactive Swagger, active la RLS Supabase, pas de données de démo),
  `CORS_ORIGINS=https://ton-site.com`, toutes les variables du tableau ci-dessus.
- Frontend : mettre l'URL de l'API dans `environment.ts`, puis `npm run build` ; publier `dist/portfolio-frontend/browser`
  sur n'importe quel hébergement statique (avec redirection de toutes les routes vers `index.html`).
- Ne jamais committer de mot de passe ou de secret : uniquement des variables d'environnement.
