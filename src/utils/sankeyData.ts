import { FinancialFlow, Company, SankeyData, SankeyNode, SankeyLink } from '../types';

export const generateSankeyData = (
  flows: FinancialFlow[],
  companies: Company[],
  selectedCompany: string | null,
  aggregationThreshold: number = 5
): SankeyData => {
  const nodes: SankeyNode[] = [];
  const links: SankeyLink[] = [];
  
  if (flows.length === 0) return { nodes, links };
  
  // Filtrer les flux par entreprise si une entreprise est sélectionnée
  const filteredFlows = selectedCompany 
    ? flows.filter(flow => flow.companyId === selectedCompany)
    : flows;
  
  // Nœud "Revenus" global
  const revenueNode: SankeyNode = {
    id: 'revenue',
    name: 'Revenus',
    type: 'revenue',
    color: '#4CAF50'
  };
  nodes.push(revenueNode);
  
  // Calculer les revenus par entreprise
  const revenueByCompany = new Map<string, number>();
  filteredFlows
    .filter(flow => flow.type === 'revenue')
    .forEach(flow => {
      const current = revenueByCompany.get(flow.companyId) || 0;
      revenueByCompany.set(flow.companyId, current + flow.amount);
    });
  
  // Créer les liens revenus -> entreprises (vue globale uniquement)
  if (!selectedCompany) {
    revenueByCompany.forEach((amount, companyId) => {
      const company = companies.find(c => c.id === companyId);
      if (company) {
        const companyNode: SankeyNode = {
          id: `company-${companyId}`,
          name: company.name,
          type: 'company',
          companyId,
          color: company.color
        };
        nodes.push(companyNode);
        
        links.push({
          source: 'revenue',
          target: `company-${companyId}`,
          value: amount,
          color: company.color
        });
      }
    });
  }
  
  // Calculer les dépenses par catégorie
  const expensesByCategory = new Map<string, number>();
  filteredFlows
    .filter(flow => flow.type === 'expense')
    .forEach(flow => {
      const current = expensesByCategory.get(flow.category) || 0;
      expensesByCategory.set(flow.category, current + flow.amount);
    });
  
  // Calculer le total des dépenses pour le seuil d'agrégation
  const totalExpenses = Array.from(expensesByCategory.values()).reduce((sum, amount) => sum + amount, 0);
  const threshold = (aggregationThreshold / 100) * totalExpenses;
  
  // Créer les nœuds de catégories
  const categoryNodes: SankeyNode[] = [];
  const aggregatedAmount = new Map<string, number>();
  
  expensesByCategory.forEach((amount, category) => {
    if (amount >= threshold) {
      const categoryNode: SankeyNode = {
        id: `category-${category}`,
        name: category,
        type: 'category',
        color: '#FF5722'
      };
      categoryNodes.push(categoryNode);
      aggregatedAmount.set(category, amount);
    } else {
      const current = aggregatedAmount.get('Autres') || 0;
      aggregatedAmount.set('Autres', current + amount);
    }
  });
  
  // Ajouter le nœud "Autres" si nécessaire
  const autresAmount = aggregatedAmount.get('Autres');
  if (autresAmount && autresAmount > 0) {
    const autresNode: SankeyNode = {
      id: 'category-Autres',
      name: 'Autres',
      type: 'category',
      color: '#9E9E9E'
    };
    categoryNodes.push(autresNode);
  }
  
  nodes.push(...categoryNodes);
  
  // Créer les liens
  if (selectedCompany) {
    // Vue par entreprise : entreprise -> catégories
    const company = companies.find(c => c.id === selectedCompany);
    if (company) {
      aggregatedAmount.forEach((amount, category) => {
        const categoryId = category === 'Autres' ? 'category-Autres' : `category-${category}`;
        links.push({
          source: `company-${selectedCompany}`,
          target: categoryId,
          value: amount,
          color: company.color
        });
      });
    }
  } else {
    // Vue globale : revenus -> catégories (via entreprises)
    aggregatedAmount.forEach((amount, category) => {
      const categoryId = category === 'Autres' ? 'category-Autres' : `category-${category}`;
      
      // Répartir proportionnellement entre les entreprises
      revenueByCompany.forEach((revenueAmount, companyId) => {
        const company = companies.find(c => c.id === companyId);
        if (company) {
          const totalRevenue = Array.from(revenueByCompany.values()).reduce((sum, val) => sum + val, 0);
          const proportion = revenueAmount / totalRevenue;
          const linkAmount = amount * proportion;
          
          links.push({
            source: `company-${companyId}`,
            target: categoryId,
            value: linkAmount,
            color: company.color
          });
        }
      });
    });
  }
  
  return { nodes, links };
};

export const getNodeColor = (node: SankeyNode, theme: 'dark' | 'light'): string => {
  if (node.color) return node.color;
  
  const colors = theme === 'dark' 
    ? ['#4CAF50', '#FF5722', '#2196F3', '#FF9800', '#9C27B0', '#607D8B']
    : ['#2E7D32', '#D84315', '#1976D2', '#F57C00', '#7B1FA2', '#455A64'];
  
  const index = node.id.length % colors.length;
  return colors[index];
}; 