import { useState, useEffect } from 'react';
import { AppState, Company, FinancialFlow } from '../types';

const STORAGE_KEY = 'chartsankeycalculator_state';

const defaultState: AppState = {
  companies: [
    {
      id: 'company-1',
      name: 'Entreprise A',
      color: '#4CAF50'
    },
    {
      id: 'company-2',
      name: 'Entreprise B',
      color: '#2196F3'
    }
  ],
  flows: [],
  selectedCompany: null,
  dateRange: {
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // 1er janvier de l'année courante
    end: new Date().toISOString().split('T')[0] // Aujourd'hui
  },
  aggregationThreshold: 5,
  theme: 'dark'
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'état:', error);
        return defaultState;
      }
    }
    return defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const addCompany = (company: Omit<Company, 'id'>) => {
    const newCompany: Company = {
      ...company,
      id: `company-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      companies: [...prev.companies, newCompany]
    }));
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setState(prev => ({
      ...prev,
      companies: prev.companies.map(company =>
        company.id === id ? { ...company, ...updates } : company
      )
    }));
  };

  const deleteCompany = (id: string) => {
    setState(prev => ({
      ...prev,
      companies: prev.companies.filter(company => company.id !== id),
      flows: prev.flows.filter(flow => flow.companyId !== id),
      selectedCompany: prev.selectedCompany === id ? null : prev.selectedCompany
    }));
  };

  const addFlow = (flow: Omit<FinancialFlow, 'id'>) => {
    const newFlow: FinancialFlow = {
      ...flow,
      id: `flow-${Date.now()}`
    };
    setState(prev => ({
      ...prev,
      flows: [...prev.flows, newFlow]
    }));
  };

  const updateFlow = (id: string, updates: Partial<FinancialFlow>) => {
    setState(prev => ({
      ...prev,
      flows: prev.flows.map(flow =>
        flow.id === id ? { ...flow, ...updates } : flow
      )
    }));
  };

  const deleteFlow = (id: string) => {
    setState(prev => ({
      ...prev,
      flows: prev.flows.filter(flow => flow.id !== id)
    }));
  };

  const setSelectedCompany = (companyId: string | null) => {
    setState(prev => ({
      ...prev,
      selectedCompany: companyId
    }));
  };

  const setDateRange = (start: string, end: string) => {
    setState(prev => ({
      ...prev,
      dateRange: { start, end }
    }));
  };

  const setAggregationThreshold = (threshold: number) => {
    setState(prev => ({
      ...prev,
      aggregationThreshold: threshold
    }));
  };

  const toggleTheme = () => {
    setState(prev => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark'
    }));
  };

  const resetState = () => {
    setState(defaultState);
  };

  return {
    state,
    updateState,
    addCompany,
    updateCompany,
    deleteCompany,
    addFlow,
    updateFlow,
    deleteFlow,
    setSelectedCompany,
    setDateRange,
    setAggregationThreshold,
    toggleTheme,
    resetState
  };
};
