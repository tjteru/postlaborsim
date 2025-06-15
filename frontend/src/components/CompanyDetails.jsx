import React from 'react';
import '../styles/variables.css';

const CompanyDetails = ({ company, onClose }) => {
  if (!company) return null;

  const details = company.details || {};
  const backstory = details.backstory || {};
  const financials = details.financials || {};
  const objectives = details.objectives || {};
  const employees = details.employees || [];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: 'var(--spacing-lg)'
    }}>
      <div style={{
        backgroundColor: 'var(--color-background)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--spacing-xl)',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 'var(--spacing-md)',
            right: 'var(--spacing-md)',
            background: 'none',
            border: 'none',
            fontSize: 'var(--font-size-xl)',
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            padding: 'var(--spacing-xs)'
          }}
        >
          ×
        </button>

        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h1 style={{ 
            margin: '0 0 var(--spacing-sm) 0', 
            color: 'var(--color-text-primary)' 
          }}>
            {company.name}
          </h1>
          <p style={{ 
            margin: 0, 
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-lg)'
          }}>
            {company.type} • {company.ownership?.replace('_', ' ').toUpperCase()}
          </p>
        </div>

        {/* Company Backstory */}
        {backstory.originStory && (
          <section style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2 style={{ 
              color: 'var(--color-text-primary)', 
              marginBottom: 'var(--spacing-md)' 
            }}>
              Company Story
            </h2>
            <div style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--color-background-alt)',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--color-border)'
            }}>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                lineHeight: 1.6,
                margin: 0
              }}>
                {backstory.originStory}
              </p>
              {backstory.establishmentYear && (
                <p style={{ 
                  margin: 'var(--spacing-md) 0 0 0',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-muted)'
                }}>
                  <strong>Founded:</strong> {backstory.establishmentYear}
                </p>
              )}
              {backstory.founders && backstory.founders.length > 0 && (
                <p style={{ 
                  margin: 'var(--spacing-xs) 0 0 0',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-text-muted)'
                }}>
                  <strong>Founders:</strong> {backstory.founders.map(f => 
                    typeof f === 'string' ? f : `${f.name} (${f.role})`
                  ).join(', ')}
                </p>
              )}
            </div>
          </section>
        )}

        {/* Mission Statement */}
        {(backstory.missionStatement || details.mission) && (
          <section style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2 style={{ 
              color: 'var(--color-text-primary)', 
              marginBottom: 'var(--spacing-md)' 
            }}>
              Mission
            </h2>
            <p style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--color-background-alt)',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              fontStyle: 'italic',
              margin: 0
            }}>
              {backstory.missionStatement || details.mission}
            </p>
          </section>
        )}

        {/* Objectives */}
        {(objectives.shortTerm || objectives.longTerm) && (
          <section style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2 style={{ 
              color: 'var(--color-text-primary)', 
              marginBottom: 'var(--spacing-md)' 
            }}>
              Business Objectives
            </h2>
            <div style={{ display: 'grid', gap: 'var(--spacing-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              {objectives.shortTerm && (
                <div>
                  <h3 style={{ 
                    color: 'var(--color-text-secondary)', 
                    marginBottom: 'var(--spacing-sm)',
                    fontSize: 'var(--font-size-base)'
                  }}>
                    Short-term Goals
                  </h3>
                  <ul style={{ 
                    margin: 0, 
                    paddingLeft: 'var(--spacing-lg)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    {objectives.shortTerm.map((goal, i) => (
                      <li key={i} style={{ marginBottom: 'var(--spacing-xs)' }}>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {objectives.longTerm && (
                <div>
                  <h3 style={{ 
                    color: 'var(--color-text-secondary)', 
                    marginBottom: 'var(--spacing-sm)',
                    fontSize: 'var(--font-size-base)'
                  }}>
                    Long-term Goals
                  </h3>
                  <ul style={{ 
                    margin: 0, 
                    paddingLeft: 'var(--spacing-lg)',
                    color: 'var(--color-text-secondary)'
                  }}>
                    {objectives.longTerm.map((goal, i) => (
                      <li key={i} style={{ marginBottom: 'var(--spacing-xs)' }}>
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Key Milestones */}
        {backstory.milestones && backstory.milestones.length > 0 && (
          <section style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2 style={{ 
              color: 'var(--color-text-primary)', 
              marginBottom: 'var(--spacing-md)' 
            }}>
              Key Milestones
            </h2>
            <div style={{ display: 'grid', gap: 'var(--spacing-sm)' }}>
              {backstory.milestones.map((milestone, i) => (
                <div key={i} style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--color-background-alt)',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  gap: 'var(--spacing-md)',
                  alignItems: 'center'
                }}>
                  <span style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    padding: 'var(--spacing-xs) var(--spacing-sm)',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'bold',
                    minWidth: '60px',
                    textAlign: 'center'
                  }}>
                    {milestone.year}
                  </span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {milestone.event}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Financial Summary */}
        {financials.revenue && (
          <section style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h2 style={{ 
              color: 'var(--color-text-primary)', 
              marginBottom: 'var(--spacing-md)' 
            }}>
              Financial Overview
            </h2>
            <div style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--color-background-alt)',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ display: 'grid', gap: 'var(--spacing-md)', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                {financials.revenue && (
                  <div>
                    <h4 style={{ margin: '0 0 var(--spacing-xs) 0', color: 'var(--color-text-primary)' }}>
                      Revenue
                    </h4>
                    {typeof financials.revenue === 'object' ? (
                      Object.entries(financials.revenue).map(([year, amount]) => (
                        <p key={year} style={{ margin: 'var(--spacing-xs) 0', color: 'var(--color-text-secondary)' }}>
                          {year}: ${amount.toLocaleString()}
                        </p>
                      ))
                    ) : (
                      <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                        ${financials.revenue.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
                {financials.assets && (
                  <div>
                    <h4 style={{ margin: '0 0 var(--spacing-xs) 0', color: 'var(--color-text-primary)' }}>
                      Assets
                    </h4>
                    <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                      ${financials.assets.toLocaleString()}
                    </p>
                  </div>
                )}
                {financials.profit && (
                  <div>
                    <h4 style={{ margin: '0 0 var(--spacing-xs) 0', color: 'var(--color-text-primary)' }}>
                      Profit
                    </h4>
                    {typeof financials.profit === 'object' ? (
                      Object.entries(financials.profit).map(([year, amount]) => (
                        <p key={year} style={{ margin: 'var(--spacing-xs) 0', color: 'var(--color-text-secondary)' }}>
                          {year}: ${amount.toLocaleString()}
                        </p>
                      ))
                    ) : (
                      <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
                        ${financials.profit.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Employee Count */}
        {employees.length > 0 && (
          <section>
            <h2 style={{ 
              color: 'var(--color-text-primary)', 
              marginBottom: 'var(--spacing-md)' 
            }}>
              Team ({employees.length} employees)
            </h2>
            <div style={{ display: 'grid', gap: 'var(--spacing-sm)', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              {employees.slice(0, 6).map((employee, i) => (
                <div key={i} style={{
                  padding: 'var(--spacing-sm)',
                  backgroundColor: 'var(--color-background-alt)',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid var(--color-border)'
                }}>
                  <p style={{ margin: '0 0 var(--spacing-xs) 0', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                    {employee.name || `${employee.firstName} ${employee.lastName}`}
                  </p>
                  <p style={{ margin: 0, fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                    {employee.title || employee.role}
                    {employee.department && ` • ${employee.department}`}
                  </p>
                </div>
              ))}
              {employees.length > 6 && (
                <div style={{
                  padding: 'var(--spacing-sm)',
                  backgroundColor: 'var(--color-background-alt)',
                  borderRadius: 'var(--border-radius-sm)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-muted)',
                  fontStyle: 'italic'
                }}>
                  +{employees.length - 6} more employees
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;