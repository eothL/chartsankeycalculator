#!/bin/bash

# Chart Sankey Calculator - Script d'installation
echo "🚀 Installation de Chart Sankey Calculator..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ depuis https://nodejs.org/"
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ requise. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ npm $(npm -v) détecté"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dépendances installées avec succès"
else
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

# Build du projet
echo "🔨 Build du projet..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi"
else
    echo "❌ Erreur lors du build"
    exit 1
fi

echo ""
echo "🎉 Installation terminée avec succès !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Démarrer en mode développement : npm start"
echo "2. Ouvrir http://localhost:3000 dans votre navigateur"
echo "3. Pour le déploiement, suivre les instructions dans le README.md"
echo ""
echo "🌐 Pour déployer sur GitHub Pages :"
echo "1. Créer un dépôt GitHub nommé 'chartsankeycalculator'"
echo "2. Pousser le code : git push origin main"
echo "3. Configurer GitHub Pages dans les paramètres du dépôt"
echo "4. Configurer le domaine personnalisé chartsankeycalculator.com"
echo ""
echo "📚 Documentation complète : README.md"
