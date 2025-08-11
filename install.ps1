# Chart Sankey Calculator - Script d'installation PowerShell
Write-Host "🚀 Installation de Chart Sankey Calculator..." -ForegroundColor Green

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ depuis https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Vérifier la version de Node.js
$nodeMajorVersion = (node --version).Split('.')[0].TrimStart('v')
if ([int]$nodeMajorVersion -lt 18) {
    Write-Host "❌ Node.js version 18+ requise. Version actuelle: $(node --version)" -ForegroundColor Red
    exit 1
}

# Vérifier si npm est installé
try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ npm n'est pas installé" -ForegroundColor Red
    exit 1
}

# Installer les dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dépendances installées avec succès" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}

# Build du projet
Write-Host "🔨 Build du projet..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build réussi" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Installation terminée avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Démarrer en mode développement : npm start"
Write-Host "2. Ouvrir http://localhost:3000 dans votre navigateur"
Write-Host "3. Pour le déploiement, suivre les instructions dans le README.md"
Write-Host ""
Write-Host "🌐 Pour déployer sur GitHub Pages :" -ForegroundColor Cyan
Write-Host "1. Créer un dépôt GitHub nommé 'chartsankeycalculator'"
Write-Host "2. Pousser le code : git push origin main"
Write-Host "3. Configurer GitHub Pages dans les paramètres du dépôt"
Write-Host "4. Configurer le domaine personnalisé chartsankeycalculator.com"
Write-Host ""
Write-Host "📚 Documentation complète : README.md" -ForegroundColor Cyan
