export interface Company {
  id: string;
  name: string;
  color: string;
}

export interface FinancialFlow {
  id: string;
  companyId: string;
  type: 'revenue' | 'expense';
  frequency: 'monthly' | 'one-time';
  category: string;
  amount: number;
  date: string;
  description?: string;
}

export interface SankeyNode {
  id: string;
  name: string;
  type: 'revenue' | 'category' | 'company';
  companyId?: string;
  color: string;
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
  color: string;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface KPIs {
  netCashFlow: number;
  grossYield: number;
  irr: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
  net: number;
}

export interface AppState {
  companies: Company[];
  flows: FinancialFlow[];
  selectedCompany: string | null;
  dateRange: {
    start: string;
    end: string;
  };
  aggregationThreshold: number;
  theme: 'dark' | 'light';
}

export interface CSVRow {
  company: string;
  type: 'revenue' | 'expense';
  frequency: 'monthly' | 'one-time';
  category: string;
  amount: number;
  date: string;
  description?: string;
} 