import React from 'react';
import { KPIs } from '../types';
import { formatCurrency, formatPercentage } from '../utils/financialCalculations';

interface KPICardsProps {
  kpis: KPIs;
  theme: 'dark' | 'light';
}

export const KPICards: React.FC<KPICardsProps> = ({ kpis, theme }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
    color: theme === 'dark' ? '#ffffff' : '#2d3748',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: theme === 'dark' 
      ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
      : '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: theme === 'dark' ? '1px solid #4a5568' : '1px solid #e2e8f0',
    minWidth: '150px',
    textAlign: 'center' as const
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.5rem',
    opacity: 0.8
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem'
  };

  const changeStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    opacity: 0.7
  };

  const getValueColor = (value: number, type: 'currency' | 'percentage'): string => {
    if (type === 'currency') {
      return value >= 0 ? '#48bb78' : '#f56565';
    } else {
      return value >= 0 ? '#48bb78' : '#f56565';
    }
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    }}>
      {/* Cash-flow net */}
      <div style={cardStyle}>
        <div style={labelStyle}>Cash-flow Net</div>
        <div style={{
          ...valueStyle,
          color: getValueColor(kpis.netCashFlow, 'currency')
        }}>
          {formatCurrency(kpis.netCashFlow)}
        </div>
        <div style={changeStyle}>
          {kpis.netCashFlow >= 0 ? 'Positif' : 'Négatif'}
        </div>
      </div>

      {/* Rendement brut */}
      <div style={cardStyle}>
        <div style={labelStyle}>Rendement Brut</div>
        <div style={{
          ...valueStyle,
          color: getValueColor(kpis.grossYield, 'percentage')
        }}>
          {formatPercentage(kpis.grossYield)}
        </div>
        <div style={changeStyle}>
          {kpis.grossYield >= 0 ? 'Rentable' : 'Déficitaire'}
        </div>
      </div>

      {/* TRI */}
      <div style={cardStyle}>
        <div style={labelStyle}>TRI (IRR)</div>
        <div style={{
          ...valueStyle,
          color: getValueColor(kpis.irr, 'percentage')
        }}>
          {formatPercentage(kpis.irr)}
        </div>
        <div style={changeStyle}>
          {kpis.irr >= 0 ? 'Annuel' : 'Annuel'}
        </div>
      </div>
    </div>
  );
};
