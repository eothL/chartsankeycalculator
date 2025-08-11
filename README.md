# Chart Sankey Calculator

Visualiseur de flux financiers avec diagrammes de Sankey - Multi-entreprises, filtres temporels, import/export CSV/JSON

## 🚀 Fonctionnalités

### Multi-entreprises
- Ajouter, renommer et supprimer des entreprises
- Basculer entre vue globale et vue par entreprise
- Couleurs personnalisées par entreprise

### Période filtrable
- Choix libre de la plage de dates (de/à)
- Filtrage automatique des flux selon la période sélectionnée

### Structure des flux
- Un seul nœud "Revenus" → nœuds "Catégories de dépenses"
- Types de flux : revenus et dépenses
- Fréquences : mensuel ou ponctuel

### Saisie & Import
- Formulaire par catégorie
- Import CSV (ou Excel exporté en CSV UTF-8) via un modèle téléchargeable
- Export JSON et import JSON pour sauvegarde/restauration
- Agrégation automatique des petites catégories en "Autres" avec seuil réglable (%)

### Visualisation Sankey
- D3.js pur avec thème sombre/claire switchable
- Responsive mobile
- Tooltips au survol (montant, %)
- Vue globale : pas de détail de provenance des revenus, mais % par entreprise au survol du nœud "Revenus"

### KPIs affichés
- Cash-flow net
- Rendement brut (proxy avec charges)
- TRI (IRR annualisé) calculé à partir des flux
- Tableau mensuel des revenus/dépenses/net

### Stockage
- LocalStorage uniquement (aucun serveur)
- Sauvegarde automatique des données

## 🛠️ Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation locale
```bash
# Cloner le dépôt
git clone https://github.com/votre-username/chartsankeycalculator.git
cd chartsankeycalculator

# Installer les dépendances
npm install

# Démarrer en mode développement
npm start

# Build pour la production
npm run build
```

## 📊 Utilisation

### Ajouter une entreprise
1. Cliquer sur "Ajouter une entreprise"
2. Saisir le nom et choisir une couleur
3. Valider

### Ajouter un flux financier
1. Cliquer sur "Ajouter un flux"
2. Sélectionner l'entreprise
3. Choisir le type (revenu/dépense)
4. Choisir la fréquence (mensuel/ponctuel)
5. Saisir la catégorie et le montant
6. Choisir la date
7. Ajouter une description (optionnel)
8. Valider

### Import de données

#### Import CSV
1. Télécharger le modèle CSV via "Télécharger modèle CSV"
2. Remplir le fichier avec vos données
3. Utiliser "Import CSV" pour charger le fichier

Format du CSV :
```csv
company,type,frequency,category,amount,date,description
Entreprise A,revenue,monthly,Ventes,5000,2024-01-01,Ventes mensuelles
Entreprise A,expense,monthly,Salaires,3000,2024-01-01,Salaires mensuels
```

#### Import JSON
1. Utiliser "Export JSON" pour sauvegarder vos données
2. Utiliser "Import JSON" pour restaurer des données

### Configuration
- **Vue** : Choisir entre vue globale ou vue par entreprise
- **Période** : Définir la plage de dates pour filtrer les flux
- **Seuil d'agrégation** : Pourcentage minimum pour afficher une catégorie (les autres sont regroupées dans "Autres")

## 🌐 Déploiement

### GitHub Pages avec domaine personnalisé

#### 1. Créer le dépôt GitHub
```bash
# Initialiser Git et pousser vers GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/votre-username/chartsankeycalculator.git
git push -u origin main
```

#### 2. Configurer GitHub Pages
1. Aller dans Settings > Pages
2. Source : "Deploy from a branch"
3. Branch : "gh-pages" (sera créé automatiquement par le workflow)
4. Sauvegarder

#### 3. Configurer le domaine personnalisé
1. Dans Settings > Pages, section "Custom domain"
2. Saisir : `chartsankeycalculator.com`
3. Cocher "Enforce HTTPS"
4. Sauvegarder

#### 4. Configurer le DNS
Chez votre registrar de domaine, créer un enregistrement CNAME :
- **Type** : CNAME
- **Nom** : chartsankeycalculator
- **Valeur** : `votre-username.github.io`
- **TTL** : 3600 (ou défaut)

#### 5. Déploiement automatique
Le workflow GitHub Actions se déclenche automatiquement à chaque push sur la branche main :
- Build de l'application
- Déploiement sur GitHub Pages
- Mise à jour du domaine personnalisé

### Déploiement manuel
```bash
# Build
npm run build

# Déployer (nécessite gh-pages installé globalement)
npm run deploy
```

## 📁 Structure du projet

```
chartsankeycalculator/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── CNAME
├── src/
│   ├── components/
│   │   ├── SankeyChart.tsx
│   │   ├── KPICards.tsx
│   │   └── MonthlyTable.tsx
│   ├── hooks/
│   │   └── useAppState.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── financialCalculations.ts
│   │   ├── sankeyData.ts
│   │   └── importExport.ts
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── .github/
│   └── workflows/
│       └── deploy.yml
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Technologies utilisées

- **React 18** avec TypeScript
- **D3.js** pour les diagrammes de Sankey
- **date-fns** pour la manipulation des dates
- **PapaParse** pour l'import/export CSV
- **LocalStorage** pour la persistance des données
- **GitHub Actions** pour le déploiement automatique

## 📝 Licence

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Vérifier les logs de déploiement dans l'onglet Actions

## 🔄 Mises à jour

Le projet est configuré pour se mettre à jour automatiquement via GitHub Actions. Chaque push sur la branche main déclenche un nouveau déploiement.

---

**Note** : Ce projet fonctionne entièrement côté client et ne nécessite aucun serveur. Toutes les données sont stockées localement dans le navigateur.
