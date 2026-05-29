# untappdReborn — Package de déploiement

Application web **untappdReborn** : un carnet de dégustation de bières personnel,
prête à être déployée sur un cluster **Kubernetes**.

> 🤖 **Pour Claude Code** : ce README est un guide de déploiement auto-suffisant.
> Suis les étapes dans l'ordre. Les seules valeurs à personnaliser sont signalées
> par `👇 À REMPLACER`. Demande à l'utilisateur son **registry d'images** et son
> **domaine** avant de commencer.

---

## 1. Ce qu'est cette application

- **100 % statique** : HTML + CSS + JavaScript/JSX qui s'exécutent **dans le navigateur**.
- **Pas de backend, pas de base de données, aucun secret.** Il suffit de servir des fichiers.
- Application **mono-utilisateur** : un seul profil (Timothée Bénédet), aucune donnée tierce.
- Le JSX est transpilé **côté navigateur** par Babel (chargé via CDN). Pratique, mais
  léger surcoût au premier chargement — acceptable pour un usage perso.

### ⚠️ Dépendances externes (chargées par le navigateur depuis Internet)
L'app récupère depuis des CDN publics, **côté client** :
- React / ReactDOM / Babel (`unpkg.com`)
- Polices Google (`fonts.googleapis.com`, `fonts.gstatic.com`)
- Leaflet + tuiles de carte (`unpkg.com`, `basemaps.cartocdn.com`)
- Géocodage de l'écran « Ajouter une adresse » (`nominatim.openstreetmap.org`)

➡️ Tant que le **navigateur de l'utilisateur** a accès à Internet, tout fonctionne.
Pour un réseau totalement fermé/hors-ligne, il faudrait rapatrier ces librairies
dans le dossier `app/` et adapter `index.html` (non inclus ici — à demander).

### 📦 Sauvegarde des données
Cette version **ne persiste pas les check-ins côté serveur**. Seuls les **lieux
ajoutés sur la carte** et les **réglages (Tweaks)** sont mémorisés dans le
`localStorage` du navigateur (donc liés à l'appareil utilisé).
Pour une vraie persistance multi-appareils, il faudrait ajouter une petite API +
base de données (SQLite/Postgres) — voir la section « Évolutions possibles ».

---

## 2. Contenu du package

```
untappd-reborn-deploy/
├── app/                 # L'application (fichiers servis tels quels)
│   ├── index.html       # Point d'entrée
│   ├── styles.css
│   ├── data.js          # Données (profil, bières, carnet…)
│   ├── icons.jsx  feed.jsx  beer.jsx  profile.jsx  app.jsx
│   └── tweaks-panel.jsx
├── Dockerfile           # Image nginx + fichiers de l'app
├── nginx.conf           # Config nginx (types .jsx, fallback SPA, gzip)
├── .dockerignore
├── k8s/                 # Manifestes Kubernetes
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── kustomization.yaml
└── README.md            # Ce fichier
```

---

## 3. Prérequis sur le cluster

- Un cluster **Kubernetes** fonctionnel + `kubectl` configuré pour le viser.
- Un **Ingress Controller** installé (ex. `ingress-nginx` ou Traefik).
  Vérifier la classe : `kubectl get ingressclass`.
- Un **registry d'images** accessible par le cluster (Docker Hub, GHCR, Harbor,
  ou un registry local). Tu pousseras l'image dedans.
- Un **nom de domaine** (ou sous-domaine) qui pointera vers l'ingress.
- *(Optionnel)* **cert-manager** + un `ClusterIssuer` pour le HTTPS automatique.

---

## 4. Étapes de déploiement

### Étape 1 — Tester l'image en local (recommandé)
```bash
cd untappd-reborn-deploy
docker build -t untappd-reborn:local .
docker run --rm -p 8080:80 untappd-reborn:local
# Ouvrir http://localhost:8080 puis arrêter avec Ctrl+C
```

### Étape 2 — Construire et pousser l'image vers le registry
```bash
# 👇 À REMPLACER : REGISTRY = adresse de ton registry (ex. ghcr.io/timothee)
export REGISTRY=REGISTRY
export TAG=v1

docker build -t $REGISTRY/untappd-reborn:$TAG .
docker push $REGISTRY/untappd-reborn:$TAG
```

### Étape 3 — Personnaliser les manifestes
Dans `k8s/deployment.yaml` :
- remplacer `image: REGISTRY/untappd-reborn:latest` par `image: $REGISTRY/untappd-reborn:$TAG`.

Dans `k8s/ingress.yaml` :
- remplacer `host: untappd.mondomaine.fr` par le domaine réel ;
- vérifier `ingressClassName` (mettre `traefik` si c'est ton controller) ;
- *(optionnel)* décommenter l'annotation `cert-manager.io/cluster-issuer` **et** le bloc `tls:` pour le HTTPS.

### Étape 4 — Déployer
```bash
kubectl apply -k k8s/
# ou, fichier par fichier :
# kubectl apply -f k8s/deployment.yaml -f k8s/service.yaml -f k8s/ingress.yaml
```

Vérifier :
```bash
kubectl get pods -l app=untappd-reborn
kubectl get ingress untappd-reborn
```

### Étape 5 — DNS
Faire pointer un enregistrement **A/CNAME** du domaine choisi vers l'adresse IP/host
de ton Ingress Controller. Une fois le DNS propagé (et le certificat TLS émis si
activé), l'app est accessible sur `https://<ton-domaine>`.

---

## 5. Mettre à jour l'application
Après une modification des fichiers dans `app/` :
```bash
docker build -t $REGISTRY/untappd-reborn:v2 .
docker push $REGISTRY/untappd-reborn:v2
kubectl set image deployment/untappd-reborn web=$REGISTRY/untappd-reborn:v2
# ou mettre à jour le tag dans deployment.yaml puis: kubectl apply -k k8s/
```
> Astuce : utilise un **tag versionné** (`v1`, `v2`…) plutôt que `latest` pour des
> rollouts fiables et un rollback simple (`kubectl rollout undo deployment/untappd-reborn`).

---

## 6. Dépannage rapide
- **Page blanche / 404 sur les .jsx** → vérifier que `nginx.conf` est bien copié
  (la location `\.jsx$` force le bon type). `kubectl logs deploy/untappd-reborn`.
- **Ingress sans IP** → contrôler que l'Ingress Controller tourne et que
  `ingressClassName` correspond.
- **Rien ne s'affiche** → l'app dépend de CDN externes ; vérifier que le navigateur
  a accès à Internet (voir §1).

---

## 7. Évolutions possibles (non incluses)
- **Persistance locale** (zéro infra) : brancher les check-ins sur `localStorage`
  pour qu'ils s'accumulent dans le carnet sur l'appareil.
- **Persistance serveur multi-appareils** : ajouter une mini-API (Node/Go/Python)
  + base **SQLite** (sur un `PersistentVolume`) ou **PostgreSQL** (`StatefulSet`),
  et faire appeler cette API par le front.
- **Hébergement hors-ligne complet** : rapatrier React/Babel/Leaflet/polices dans `app/`.

Demande à l'auteur du design si tu veux l'une de ces évolutions : elles peuvent
être ajoutées au package.
