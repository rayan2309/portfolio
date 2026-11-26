# Portfolio de Rayan Arroud

Site statique (HTML, CSS, un peu de JavaScript), sans dépendance ni étape de build. Thème sombre par défaut, thème clair automatique selon le système, bouton pour basculer.

## Contenu

- `index.html` : toutes les sections (profil, expérience, projets, compétences, certifications, contact)
- `style.css` : thème et mise en page
- `script.js` : bascule de thème, menu mobile, animations d'apparition
- `favicon.svg` : icône

## Voir le site en local

```bash
python3 -m http.server 8000
```

Puis ouvrir `http://localhost:8000`.

## Publier avec GitHub Pages

Dépôt GitHub : *Settings > Pages > Build and deployment > Source : Deploy from a branch*, branche `main`, dossier `/ (root)`. Le site est alors servi sur `https://rayan2309.github.io/portfolio/`.

## Mettre à jour

Les informations viennent du CV. Pour modifier un texte, éditer `index.html` ; pour les couleurs, les variables au début de `style.css`.

Ce dépôt ne doit contenir ni numéro de téléphone, ni secret, ni détail du réseau privé du homelab.
