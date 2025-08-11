import Papa from 'papaparse';
import { FinancialFlow, Company, CSVRow, AppState } from '../types';

export const exportToJSON = (state: AppState): string => {
  return JSON.stringify(state, null, 2);
};

export const importFromJSON = (jsonString: string): AppState | null => {
  try {
    const data = JSON.parse(jsonString);
    return data as AppState;
  } catch (error) {
    console.error('Erreur lors de l\'import JSON:', error);
    return null;
  }
};

export const exportToCSV = (flows: FinancialFlow[], companies: Company[]): string => {
  const csvData: CSVRow[] = flows.map(flow => {
    const company = companies.find(c => c.id === flow.companyId);
    return {
      company: company?.name || 'Inconnue',
      type: flow.type,
      frequency: flow.frequency,
      category: flow.category,
      amount: flow.amount,
      date: flow.date,
      description: flow.description || ''
    };
  });
  
  return Papa.unparse(csvData);
};

export const importFromCSV = (
  csvString: string, 
  companies: Company[]
): { flows: FinancialFlow[], errors: string[] } => {
  const errors: string[] = [];
  const flows: FinancialFlow[] = [];
  
  Papa.parse(csvString, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      results.data.forEach((row: any, index: number) => {
        try {
          // Validation des données
          if (!row.company || !row.type || !row.category || !row.amount || !row.date) {
            errors.push(`Ligne ${index + 1}: Données manquantes`);
            return;
          }
          
          // Trouver l'entreprise
          const company = companies.find(c => 
            c.name.toLowerCase() === row.company.toLowerCase()
          );
          
          if (!company) {
            errors.push(`Ligne ${index + 1}: Entreprise "${row.company}" non trouvée`);
            return;
          }
          
          // Validation du type
          if (!['revenue', 'expense'].includes(row.type)) {
            errors.push(`Ligne ${index + 1}: Type invalide "${row.type}" (doit être "revenue" ou "expense")`);
            return;
          }
          
          // Validation de la fréquence
          if (!['monthly', 'one-time'].includes(row.frequency)) {
            errors.push(`Ligne ${index + 1}: Fréquence invalide "${row.frequency}" (doit être "monthly" ou "one-time")`);
            return;
          }
          
          // Validation du montant
          const amount = parseFloat(row.amount);
          if (isNaN(amount) || amount <= 0) {
            errors.push(`Ligne ${index + 1}: Montant invalide "${row.amount}"`);
            return;
          }
          
          // Validation de la date
          const date = new Date(row.date);
          if (isNaN(date.getTime())) {
            errors.push(`Ligne ${index + 1}: Date invalide "${row.date}"`);
            return;
          }
          
          const flow: FinancialFlow = {
            id: `imported-${Date.now()}-${index}`,
            companyId: company.id,
            type: row.type,
            frequency: row.frequency,
            category: row.category,
            amount,
            date: date.toISOString().split('T')[0],
            description: row.description || undefined
          };
          
          flows.push(flow);
        } catch (error) {
          errors.push(`Ligne ${index + 1}: Erreur de traitement`);
        }
      });
    },
    error: (error) => {
      errors.push(`Erreur de parsing CSV: ${error.message}`);
    }
  });
  
  return { flows, errors };
};

export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateCSVTemplate = (): string => {
  const template: CSVRow[] = [
    {
      company: 'Entreprise A',
      type: 'revenue',
      frequency: 'monthly',
      category: 'Ventes',
      amount: 5000,
      date: '2024-01-01',
      description: 'Ventes mensuelles'
    },
    {
      company: 'Entreprise A',
      type: 'expense',
      frequency: 'monthly',
      category: 'Salaires',
      amount: 3000,
      date: '2024-01-01',
      description: 'Salaires mensuels'
    },
    {
      company: 'Entreprise B',
      type: 'revenue',
      frequency: 'one-time',
      category: 'Consulting',
      amount: 10000,
      date: '2024-01-15',
      description: 'Projet consulting'
    }
  ];
  
  return Papa.unparse(template);
}; 