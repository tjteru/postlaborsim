import React, { useState } from 'react';
import CompanyDetails from '../../../components/CompanyDetails';

const PlayerDashboard = ({ company }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!company) return <p>No company data</p>;

  return (
    <div style={{
      backgroundColor: 'var(--color-background)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-lg)',
      padding: 'var(--spacing-lg)',
      marginBottom: 'var(--spacing-lg)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
        <div>
          <h2 style={{ margin: '0 0 var(--spacing-xs) 0', color: 'var(--color-text-primary)' }}>
            {company.name}
          </h2>
          <p style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--color-text-secondary)' }}>
            {company.type}
          </p>
        </div>
        <button
          onClick={() => setShowDetails(true)}
          style={{
            padding: 'var(--spacing-sm) var(--spacing-md)',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--border-radius-md)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: '600',
            transition: 'background-color var(--transition-base)'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-primary-hover)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-primary)'}
        >
          📖 Company Story
        </button>
      </div>

      <div style={{ display: 'grid', gap: 'var(--spacing-md)', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <div style={{
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-background-alt)',
          borderRadius: 'var(--border-radius-md)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            Cash
          </p>
          <p style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
            ${(company.cash || 0).toLocaleString()}
          </p>
        </div>
        
        <div style={{
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-background-alt)',
          borderRadius: 'var(--border-radius-md)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            Revenue
          </p>
          <p style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
            ${(company.revenue || 0).toLocaleString()}
          </p>
        </div>

        <div style={{
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-background-alt)',
          borderRadius: 'var(--border-radius-md)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            Employees
          </p>
          <p style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
            {company.details?.employees?.length || company.employees?.length || 0}
          </p>
        </div>

        <div style={{
          padding: 'var(--spacing-md)',
          backgroundColor: 'var(--color-background-alt)',
          borderRadius: 'var(--border-radius-md)',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
            Type
          </p>
          <p style={{ margin: 0, fontSize: 'var(--font-size-base)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
            {company.ownership?.replace('_', ' ').toUpperCase() || 'Business'}
          </p>
        </div>
      </div>

      {showDetails && (
        <CompanyDetails 
          company={company} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </div>
  );
};

export default PlayerDashboard;
