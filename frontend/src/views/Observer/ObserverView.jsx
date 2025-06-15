import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LobbyView from './LobbyView';
import MacroDashboard from './MacroDashboard';
import NewsFeed from './NewsFeed';
import CompanyDetails from '../../components/CompanyDetails';
import { useSocket } from '../../context/SocketProvider';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3100';

const ObserverView = () => {
  const { id: gameId } = useParams();
  const { socket } = useSocket();
  const [state, setState] = useState({ history: [] });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Use default game ID if none provided in URL
  const currentGameId = gameId || 'game_1';

  // Fetch initial game state
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/game/${currentGameId}/state`);
        
        if (response.ok) {
          const data = await response.json();
          if (data && !data.error) {
            setState(data);
          } else {
            setError('Game not found or not started');
          }
        } else {
          setError('Failed to load game - response not ok');
        }
      } catch (err) {
        console.error('Observer: Failed to load initial game state:', err);
        setError('Failed to load game state');
      } finally {
        setLoading(false);
      }
    };

    fetchGameState();
  }, [currentGameId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinRoom', { gameId: currentGameId });

    const handleQuarter = (data) => {
      setState((prev) => ({ ...data, history: [...(prev.history || []), data] }));
    };
    const handleNews = (update) => {
      setNews((prev) => [update, ...prev]);
    };
    socket.on('newQuarter', handleQuarter);
    socket.on('newsUpdate', handleNews);

    return () => {
      socket.off('newQuarter', handleQuarter);
      socket.off('newsUpdate', handleNews);
    };
  }, [socket, currentGameId]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '18px',
        color: 'var(--color-text-secondary)' 
      }}>
        Loading observer view for {currentGameId}...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: 'var(--spacing-lg)', 
        textAlign: 'center',
        color: 'var(--color-error)' 
      }}>
        <h2>Error</h2>
        <p>{error}</p>
        <p>Make sure a game has been created and started.</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Create economic data from current state and history
  const economicData = [];
  if (state.economy) {
    economicData.push({
      quarter: 1,
      gdp: state.economy.gdp || 2.0,
      unemployment: state.economy.unemployment || 5.0
    });
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)', color: 'var(--color-text-primary)' }}>
        Observer View - Game {currentGameId}
      </h1>
      
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <LobbyView gameId={currentGameId} />
      </div>
      
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <MacroDashboard data={economicData} />
      </div>
      
      {state.companies && state.companies.length > 0 && (
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h2 style={{ color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-lg)' }}>
            Companies in Game ({state.companies.length})
          </h2>
          <div style={{ display: 'grid', gap: 'var(--spacing-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            {state.companies.map((company, index) => (
              <div key={index} style={{
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--color-background-alt)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius-lg)',
                transition: 'transform var(--transition-base), box-shadow var(--transition-base)',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 var(--spacing-xs) 0', color: 'var(--color-text-primary)' }}>
                      {company.name}
                    </h3>
                    <p style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--color-text-secondary)' }}>
                      {company.type}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCompany(company)}
                    style={{
                      padding: 'var(--spacing-xs) var(--spacing-sm)',
                      backgroundColor: 'var(--color-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--border-radius-sm)',
                      cursor: 'pointer',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: '600',
                      transition: 'background-color var(--transition-base)'
                    }}
                    onMouseOver={(e) => {
                      e.stopPropagation();
                      e.target.style.backgroundColor = 'var(--color-primary-hover)';
                    }}
                    onMouseOut={(e) => {
                      e.stopPropagation();
                      e.target.style.backgroundColor = 'var(--color-primary)';
                    }}
                  >
                    📖 Details
                  </button>
                </div>
                
                <div style={{ display: 'grid', gap: 'var(--spacing-sm)', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      Employees
                    </p>
                    <p style={{ margin: 0, fontSize: 'var(--font-size-base)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                      {company.details?.employees?.length || company.employees?.length || 0}
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      Type
                    </p>
                    <p style={{ margin: 0, fontSize: 'var(--font-size-xs)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                      {company.ownership?.replace('_', ' ').toUpperCase() || 'Business'}
                    </p>
                  </div>
                  
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 var(--spacing-xs) 0', fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                      Founded
                    </p>
                    <p style={{ margin: 0, fontSize: 'var(--font-size-base)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                      {company.details?.backstory?.establishmentYear || 'N/A'}
                    </p>
                  </div>
                </div>

                {company.details?.backstory?.originStory && (
                  <div style={{ marginTop: 'var(--spacing-md)', paddingTop: 'var(--spacing-sm)', borderTop: '1px solid var(--color-border)' }}>
                    <p style={{ 
                      margin: 0, 
                      fontSize: 'var(--font-size-sm)', 
                      color: 'var(--color-text-secondary)',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: 1.4
                    }}>
                      {company.details.backstory.originStory}
                    </p>
                    <p style={{ 
                      margin: 'var(--spacing-xs) 0 0 0', 
                      fontSize: 'var(--font-size-xs)', 
                      color: 'var(--color-primary)',
                      fontWeight: '600'
                    }}>
                      Click for full story →
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <NewsFeed news={news} />
      
      {selectedCompany && (
        <CompanyDetails 
          company={selectedCompany} 
          onClose={() => setSelectedCompany(null)} 
        />
      )}
    </div>
  );
};

export default ObserverView;
