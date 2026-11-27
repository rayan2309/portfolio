# Portfolio de Rayan Arroud

Site statique (HTML, CSS, un peu de JavaScript), sans dépendance ni étape de build. Thème sombre par défaut, thème clair automatique selon le système, bouton pour basculer.

## Contenu

| Fichier | Rôle |
| --- | --- |
| `index.html`, `style.css`, `script.js`, `init.js`, `favicon.svg` | Le site |
| `Dockerfile`, `nginx.conf` | Image nginx non-root (uid 101, port 8080) avec en-têtes de sécurité et CSP stricte |
| `k8s/` | Manifestes Kubernetes (kustomize) : Deployment, Service |
| `argocd/application.yaml` | Application Argo CD, à appliquer une fois |
| `.github/workflows/build.yml` | CI : construit l'image, la publie sur GHCR, met à jour le tag dans `k8s/` |

Le site n'utilise aucune ressource externe ni script ou style en ligne : c'est ce qui permet la CSP stricte de `nginx.conf`. Ne pas en ajouter sans adapter la CSP.

## Voir le site en local

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Déploiement (GitOps)

1. Un push sur `main` lance la CI : elle construit l'image `ghcr.io/rayan2309/portfolio`, la publie avec le tag `sha-<commit>`, puis écrit ce tag dans `k8s/kustomization.yaml`.
2. Argo CD détecte ce changement dans Git et met à jour le Deployment.

Mise en place, une seule fois :

1. **Rendre le paquet GHCR public** (GitHub : profil > *Packages* > `portfolio` > *Package settings* > *Change visibility*), sinon le cluster ne pourra pas tirer l'image sans identifiants. Le paquet n'existe qu'après le premier passage de la CI.
2. Sur le cluster : `kubectl apply -f argocd/application.yaml` (Argo CD doit être installé). Si le dépôt est privé, déclarer d'abord ses identifiants dans Argo CD (*Settings > Repositories*), par exemple avec une clé de déploiement en lecture seule.

Paramètres de l'application : dépôt `https://github.com/rayan2309/portfolio.git`, révision `main`, chemin `k8s`, namespace `portfolio`, synchronisation automatique avec *Prune* et *Self Heal*.

Le Service `portfolio` (port 80) est interne au cluster. Pour l'exposer sur `www`, pointer un nom d'hôte public du tunnel Cloudflare vers `http://portfolio.portfolio.svc:80`.

## Règles pour ce dépôt

Il est public : il ne doit contenir ni numéro de téléphone, ni jeton (celui du tunnel Cloudflare reste dans un `Secret` Kubernetes créé à la main), ni détail du réseau privé.
