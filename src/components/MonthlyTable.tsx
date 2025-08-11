import React from 'react';
import { MonthlyData } from '../types';
import { formatCurrency } from '../utils/financialCalculations';

interface MonthlyTableProps {
  data: MonthlyData[];
  theme: 'dark' | 'light';
}

export const MonthlyTable: React.FC<MonthlyTableProps> = ({ data, theme }) => {
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse' as const,
    backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: theme === 'dark' 
      ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
      : '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: theme === 'dark' ? '#4a5568' : '#f7fafc',
    color: theme === 'dark' ? '#ffffff' : '#2d3748',
    padding: '12px',
    textAlign: 'left' as const,
    fontWeight: '600',
    fontSize: '0.875rem'
  };

  const cellStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: theme === 'dark' ? '1px solid #4a5568' : '1px solid #e2e8f0',
    fontSize: '0.875rem'
  };

  const getValueColor = (value: number): string => {
    return value >= 0 ? '#48bb78' : '#f56565';
  };

  if (data.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: theme === 'dark' ? '#a0aec0' : '#718096',
        backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
        borderRadius: '8px',
        border: theme === 'dark' ? '1px solid #4a5568' : '1px solid #e2e8f0'
      }}>
        Aucune donnée mensuelle disponible
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{
        color: theme === 'dark' ? '#ffffff' : '#2d3748',
        marginBottom: '1rem',
        fontSize: '1.25rem',
        fontWeight: '600'
      }}>
        Tableau Mensuel
      </h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={headerStyle}>Mois</th>
              <th style={headerStyle}>Revenus</th>
              <th style={headerStyle}>Dépenses</th>
              <th style={headerStyle}>Net</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} style={{
                backgroundColor: index % 2 === 0 
                  ? (theme === 'dark' ? '#2d3748' : '#ffffff')
                  : (theme === 'dark' ? '#1a202c' : '#f7fafc')
              }}>
                <td style={{
                  ...cellStyle,
                  color: theme === 'dark' ? '#ffffff' : '#2d3748',
                  fontWeight: '500'
                }}>
                  {row.month}
                </td>
                <td style={{
                  ...cellStyle,
                  color: '#48bb78',
                  fontWeight: '500'
                }}>
                  {formatCurrency(row.revenue)}
                </td>
                <td style={{
                  ...cellStyle,
                  color: '#f56565',
                  fontWeight: '500'
                }}>
                  {formatCurrency(row.expenses)}
                </td>
                <td style={{
                  ...cellStyle,
                  color: getValueColor(row.net),
                  fontWeight: '600'
                }}>
                  {formatCurrency(row.net)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
