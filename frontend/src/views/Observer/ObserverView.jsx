import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LobbyView from './LobbyView';
import MacroDashboard from './MacroDashboard';
import NewsFeed from './NewsFeed';
import { useSocket } from '../../context/SocketProvider';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3100';

const ObserverView = () => {
  const { id: gameId } = useParams();
  const { socket } = useSocket();
  const [state, setState] = useState({ history: [] });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use default game ID if none provided in URL
  const currentGameId = gameId || 'game_1';

  // Fetch initial game state
  useEffect(() => {
    const fetchGameState = async () => {
      try {
        console.log('Observer: Fetching game state for', currentGameId);
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/game/${currentGameId}/state`);
        console.log('Observer: API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Observer: Game data received:', data);
          if (data && !data.error) {
            setState(data);
          } else {
            console.log('Observer: Data has error or is empty');
            setError('Game not found or not started');
          }
        } else {
          console.log('Observer: API response not ok');
          setError('Failed to load game - response not ok');
        }
      } catch (err) {
        console.error('Observer: Failed to load initial game state:', err);
        setError('Failed to load game state');
      } finally {
        console.log('Observer: Setting loading to false');
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

  console.log('Observer render:', { loading, error, state, currentGameId });

  if (loading) {
    console.log('Observer: Rendering loading state');
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
    console.log('Observer: Rendering error state:', error);
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

  console.log('Observer: Rendering main content with state:', state);
  console.log('Observer: Companies available:', state.companies?.length || 0);
  console.log('Observer: Economic data:', economicData);

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
          <h2>Companies in Game</h2>
          <div style={{ display: 'grid', gap: 'var(--spacing-md)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {state.companies.map((company, index) => (
              <div key={index} style={{
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--color-background-alt)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--border-radius-md)'
              }}>
                <h3 style={{ margin: '0 0 var(--spacing-sm) 0' }}>{company.name}</h3>
                <p style={{ margin: '0 0 var(--spacing-sm) 0', color: 'var(--color-text-secondary)' }}>
                  {company.industry}
                </p>
                <p style={{ margin: 0, fontSize: 'var(--font-size-sm)' }}>
                  Employees: {company.employees ? company.employees.length : 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <NewsFeed news={news} />
    </div>
  );
};

export default ObserverView;
