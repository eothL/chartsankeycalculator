import React, { useState, useCallback } from 'react';
import { useAppState } from './hooks/useAppState';
import { SankeyChart } from './components/SankeyChart';
import { KPICards } from './components/KPICards';
import { MonthlyTable } from './components/MonthlyTable';
import { generateSankeyData } from './utils/sankeyData';
import { calculateKPIs, calculateMonthlyData } from './utils/financialCalculations';
import { exportToJSON, importFromJSON, exportToCSV, importFromCSV, downloadFile, generateCSVTemplate } from './utils/importExport';
import { Company, FinancialFlow } from './types';
import './App.css';

const App: React.FC = () => {
  const {
    state,
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
  } = useAppState();

  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddFlow, setShowAddFlow] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', color: '#4CAF50' });
  const [newFlow, setNewFlow] = useState({
    companyId: '',
    type: 'revenue' as const,
    frequency: 'monthly' as const,
    category: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  // Filtrer les flux par date
  const filteredFlows = state.flows.filter(flow => {
    const flowDate = new Date(flow.date);
    const startDate = new Date(state.dateRange.start);
    const endDate = new Date(state.dateRange.end);
    return flowDate >= startDate && flowDate <= endDate;
  });

  // Générer les données Sankey
  const sankeyData = generateSankeyData(
    filteredFlows,
    state.companies,
    state.selectedCompany,
    state.aggregationThreshold
  );

  // Calculer les KPIs
  const kpis = calculateKPIs(filteredFlows);

  // Calculer les données mensuelles
  const monthlyData = calculateMonthlyData(filteredFlows);

  // Gestionnaires d'événements
  const handleAddCompany = useCallback(() => {
    if (newCompany.name.trim()) {
      addCompany(newCompany);
      setNewCompany({ name: '', color: '#4CAF50' });
      setShowAddCompany(false);
    }
  }, [newCompany, addCompany]);

  const handleAddFlow = useCallback(() => {
    if (newFlow.companyId && newFlow.category && newFlow.amount > 0) {
      addFlow(newFlow);
      setNewFlow({
        companyId: '',
        type: 'revenue',
        frequency: 'monthly',
        category: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      setShowAddFlow(false);
    }
  }, [newFlow, addFlow]);

  const handleExportJSON = useCallback(() => {
    const jsonData = exportToJSON(state);
    downloadFile(jsonData, 'chartsankeycalculator_data.json', 'application/json');
  }, [state]);

  const handleImportJSON = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const importedState = importFromJSON(content);
        if (importedState) {
          // Mettre à jour l'état avec les données importées
          Object.assign(state, importedState);
        }
      };
      reader.readAsText(file);
    }
  }, [state]);

  const handleExportCSV = useCallback(() => {
    const csvData = exportToCSV(state.flows, state.companies);
    downloadFile(csvData, 'chartsankeycalculator_data.csv', 'text/csv');
  }, [state.flows, state.companies]);

  const handleImportCSV = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const { flows, errors } = importFromCSV(content, state.companies);
        if (errors.length === 0) {
          flows.forEach(flow => addFlow(flow));
        } else {
          alert(`Erreurs d'import:\n${errors.join('\n')}`);
        }
      };
      reader.readAsText(file);
    }
  }, [state.companies, addFlow]);

  const handleDownloadTemplate = useCallback(() => {
    const template = generateCSVTemplate();
    downloadFile(template, 'template_import.csv', 'text/csv');
  }, []);

  const containerStyle: React.CSSProperties = {
    backgroundColor: state.theme === 'dark' ? '#1a202c' : '#f7fafc',
    color: state.theme === 'dark' ? '#ffffff' : '#2d3748',
    minHeight: '100vh',
    padding: '1rem'
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    padding: '1rem',
    backgroundColor: state.theme === 'dark' ? '#2d3748' : '#ffffff',
    borderRadius: '8px',
    boxShadow: state.theme === 'dark' 
      ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
      : '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#4299e1',
    color: '#ffffff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '0.5rem',
    fontSize: '0.875rem'
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: state.theme === 'dark' ? '#4a5568' : '#ffffff',
    color: state.theme === 'dark' ? '#ffffff' : '#2d3748',
    border: state.theme === 'dark' ? '1px solid #2d3748' : '1px solid #e2e8f0',
    borderRadius: '4px',
    padding: '0.5rem',
    marginBottom: '0.5rem',
    width: '100%'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: '1.875rem', fontWeight: 'bold' }}>
          Chart Sankey Calculator
        </h1>
        <div>
          <button onClick={toggleTheme} style={buttonStyle}>
            {state.theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button onClick={handleExportJSON} style={buttonStyle}>
            Export JSON
          </button>
          <button onClick={handleExportCSV} style={buttonStyle}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Contrôles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* Sélection d'entreprise */}
        <div style={{
          backgroundColor: state.theme === 'dark' ? '#2d3748' : '#ffffff',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: state.theme === 'dark' 
            ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
            : '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Vue</h3>
          <select
            value={state.selectedCompany || ''}
            onChange={(e) => setSelectedCompany(e.target.value || null)}
            style={inputStyle}
          >
            <option value="">Vue Globale</option>
            {state.companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        {/* Plage de dates */}
        <div style={{
          backgroundColor: state.theme === 'dark' ? '#2d3748' : '#ffffff',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: state.theme === 'dark' 
            ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
            : '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Période</h3>
          <input
            type="date"
            value={state.dateRange.start}
            onChange={(e) => setDateRange(e.target.value, state.dateRange.end)}
            style={inputStyle}
          />
          <input
            type="date"
            value={state.dateRange.end}
            onChange={(e) => setDateRange(state.dateRange.start, e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Seuil d'agrégation */}
        <div style={{
          backgroundColor: state.theme === 'dark' ? '#2d3748' : '#ffffff',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: state.theme === 'dark' 
            ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
            : '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Seuil d'agrégation</h3>
          <input
            type="range"
            min="1"
            max="20"
            value={state.aggregationThreshold}
            onChange={(e) => setAggregationThreshold(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            {state.aggregationThreshold}%
          </div>
        </div>
      </div>

      {/* KPIs */}
      <KPICards kpis={kpis} theme={state.theme} />

      {/* Diagramme Sankey */}
      <div style={{
        backgroundColor: state.theme === 'dark' ? '#2d3748' : '#ffffff',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: state.theme === 'dark' 
          ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
          : '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Diagramme de Sankey</h3>
        <SankeyChart
          data={sankeyData}
          theme={state.theme}
          width={window.innerWidth - 64}
          height={600}
        />
      </div>

      {/* Tableau mensuel */}
      <MonthlyTable data={monthlyData} theme={state.theme} />

      {/* Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <button onClick={() => setShowAddCompany(true)} style={buttonStyle}>
          Ajouter une entreprise
        </button>
        <button onClick={() => setShowAddFlow(true)} style={buttonStyle}>
          Ajouter un flux
        </button>
        <button onClick={handleDownloadTemplate} style={buttonStyle}>
          Télécharger modèle CSV
        </button>
        <button onClick={resetState} style={{ ...buttonStyle, backgroundColor: '#f56565' }}>
          Réinitialiser
        </button>
      </div>

      {/* Modales */}
      {showAddCompany && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: state.theme === 'dark' ? '#2d3748' : '#ffffff',
            padding: '2rem',
            borderRadius: '8px',
            minWidth: '300px'
          }}>
            <h3 style={{ marginTop: 0 }}>Ajouter une entreprise</h3>
            <input
              type="text"
              placeholder="Nom de l'entreprise"
              value={newCompany.name}
              onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              style={inputStyle}
            />
            <input
              type="color"
              value={newCompany.color}
              onChange={(e) => setNewCompany({ ...newCompany, color: e.target.value })}
              style={{ width: '100%', height: '40px', marginBottom: '1rem' }}
            />
            <div>
              <button onClick={handleAddCompany} style={buttonStyle}>
                Ajouter
              </button>
              <button onClick={() => setShowAddCompany(false)} style={{ ...buttonStyle, backgroundColor: '#718096' }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddFlow && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: state.theme === 'dark' ? '#2d3748' : '#ffffff',
            padding: '2rem',
            borderRadius: '8px',
            minWidth: '400px'
          }}>
            <h3 style={{ marginTop: 0 }}>Ajouter un flux</h3>
            <select
              value={newFlow.companyId}
              onChange={(e) => setNewFlow({ ...newFlow, companyId: e.target.value })}
              style={inputStyle}
            >
              <option value="">Sélectionner une entreprise</option>
              {state.companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <select
              value={newFlow.type}
              onChange={(e) => setNewFlow({ ...newFlow, type: e.target.value as 'revenue' | 'expense' })}
              style={inputStyle}
            >
              <option value="revenue">Revenu</option>
              <option value="expense">Dépense</option>
            </select>
            <select
              value={newFlow.frequency}
              onChange={(e) => setNewFlow({ ...newFlow, frequency: e.target.value as 'monthly' | 'one-time' })}
              style={inputStyle}
            >
              <option value="monthly">Mensuel</option>
              <option value="one-time">Ponctuel</option>
            </select>
            <input
              type="text"
              placeholder="Catégorie"
              value={newFlow.category}
              onChange={(e) => setNewFlow({ ...newFlow, category: e.target.value })}
              style={inputStyle}
            />
            <input
              type="number"
              placeholder="Montant (EUR)"
              value={newFlow.amount}
              onChange={(e) => setNewFlow({ ...newFlow, amount: Number(e.target.value) })}
              style={inputStyle}
            />
            <input
              type="date"
              value={newFlow.date}
              onChange={(e) => setNewFlow({ ...newFlow, date: e.target.value })}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Description (optionnel)"
              value={newFlow.description}
              onChange={(e) => setNewFlow({ ...newFlow, description: e.target.value })}
              style={inputStyle}
            />
            <div>
              <button onClick={handleAddFlow} style={buttonStyle}>
                Ajouter
              </button>
              <button onClick={() => setShowAddFlow(false)} style={{ ...buttonStyle, backgroundColor: '#718096' }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import/Export */}
      <div style={{
        backgroundColor: state.theme === 'dark' ? '#2d3748' : '#ffffff',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: state.theme === 'dark' 
          ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
          : '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Import/Export</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Import JSON:</label>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Import CSV:</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              style={inputStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
