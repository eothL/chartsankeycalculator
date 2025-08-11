import { FinancialFlow, KPIs, MonthlyData } from '../types';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

export const calculateNetCashFlow = (flows: FinancialFlow[]): number => {
  return flows.reduce((total, flow) => {
    const multiplier = flow.type === 'revenue' ? 1 : -1;
    return total + (flow.amount * multiplier);
  }, 0);
};

export const calculateGrossYield = (flows: FinancialFlow[]): number => {
  const totalRevenue = flows
    .filter(flow => flow.type === 'revenue')
    .reduce((sum, flow) => sum + flow.amount, 0);
  
  const totalExpenses = flows
    .filter(flow => flow.type === 'expense')
    .reduce((sum, flow) => sum + flow.amount, 0);
  
  if (totalRevenue === 0) return 0;
  return ((totalRevenue - totalExpenses) / totalRevenue) * 100;
};

export const calculateIRR = (flows: FinancialFlow[]): number => {
  if (flows.length === 0) return 0;
  
  // Trier les flux par date
  const sortedFlows = [...flows].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const startDate = new Date(sortedFlows[0].date);
  const endDate = new Date(sortedFlows[sortedFlows.length - 1].date);
  
  // Calculer les flux mensuels
  const monthlyFlows = new Map<string, number>();
  
  sortedFlows.forEach(flow => {
    const monthKey = format(new Date(flow.date), 'yyyy-MM');
    const currentAmount = monthlyFlows.get(monthKey) || 0;
    const multiplier = flow.type === 'revenue' ? 1 : -1;
    monthlyFlows.set(monthKey, currentAmount + (flow.amount * multiplier));
  });
  
  // Calculer l'IRR simplifié (approximation)
  const totalInvestment = Math.abs(
    sortedFlows
      .filter(flow => flow.type === 'expense')
      .reduce((sum, flow) => sum + flow.amount, 0)
  );
  
  const totalReturn = sortedFlows
    .filter(flow => flow.type === 'revenue')
    .reduce((sum, flow) => sum + flow.amount, 0);
  
  if (totalInvestment === 0) return 0;
  
  const monthsDiff = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  const annualizedReturn = Math.pow(totalReturn / totalInvestment, 12 / monthsDiff) - 1;
  
  return annualizedReturn * 100;
};

export const calculateMonthlyData = (flows: FinancialFlow[]): MonthlyData[] => {
  if (flows.length === 0) return [];
  
  const sortedFlows = [...flows].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const startDate = startOfMonth(new Date(sortedFlows[0].date));
  const endDate = endOfMonth(new Date(sortedFlows[sortedFlows.length - 1].date));
  
  const months = eachMonthOfInterval({ start: startDate, end: endDate });
  
  return months.map(month => {
    const monthKey = format(month, 'yyyy-MM');
    const monthFlows = flows.filter(flow => 
      format(new Date(flow.date), 'yyyy-MM') === monthKey
    );
    
    const revenue = monthFlows
      .filter(flow => flow.type === 'revenue')
      .reduce((sum, flow) => sum + flow.amount, 0);
    
    const expenses = monthFlows
      .filter(flow => flow.type === 'expense')
      .reduce((sum, flow) => sum + flow.amount, 0);
    
    return {
      month: format(month, 'MMM yyyy'),
      revenue,
      expenses,
      net: revenue - expenses
    };
  });
};

export const calculateKPIs = (flows: FinancialFlow[]): KPIs => {
  return {
    netCashFlow: calculateNetCashFlow(flows),
    grossYield: calculateGrossYield(flows),
    irr: calculateIRR(flows)
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
}; 