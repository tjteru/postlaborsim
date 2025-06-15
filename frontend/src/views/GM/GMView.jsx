import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../context/SocketProvider';
import GMDashboard from './components/GMDashboard';
import GlobalLevers from './components/GlobalLevers';
import ShockEventControl from './components/ShockEventControl';
import GameControls from './components/GameControls';
import PlayerStatus from './components/PlayerStatus';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import ConnectionStatus from '../../components/ui/ConnectionStatus';
import '../../styles/variables.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3100';

const GMView = () => {
  const { id: gameId } = useParams();
  const { socket } = useSocket();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState([]);
  const [levers, setLevers] = useState({ taxRate: 20 });
  const [gameCreated, setGameCreated] = useState(false);
  const [startingGame, setStartingGame] = useState(false);
  const [creatingGame, setCreatingGame] = useState(false);

  // Use default game ID if none provided in URL
  const currentGameId = gameId || 'game_1';

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinRoom', { gameId: currentGameId });
    const handleQuarter = (data) => setState(data);
    const handleDecision = ({ playerId }) => setSubmitted((s) => [...s, playerId]);
    socket.on('newQuarter', handleQuarter);
    socket.on('decisionReceived', handleDecision);
    socket.on('gameStarted', handleGameStarted);
    return () => {
      socket.off('newQuarter', handleQuarter);
      socket.off('decisionReceived', handleDecision);
      socket.off('gameStarted', handleGameStarted);
    };
  }, [socket, currentGameId]);

  const handleGameStarted = (data) => {
    setState(data);
    setGameCreated(true);
  };

  const fetchGameState = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/game/${currentGameId}/state`);
      if (!response.ok) {
        if (response.status === 404 || response.status === 500) {
          // Game doesn't exist or backend error - that's OK for GM view, show create interface
          setState(null);
          setGameCreated(false);
        } else {
          throw new Error('Failed to load game state');
        }
      } else {
        const data = await response.json();
        if (data.error) {
          // Backend returned an error in the response body
          setState(null);
          setGameCreated(false);
        } else if (Object.keys(data).length === 0) {
          // Empty game state - game exists but hasn't been initialized
          setState({ companies: [] });
          setGameCreated(true);
        } else {
          setState(data);
          setGameCreated(true);
        }
      }
    } catch (err) {
      // Network errors or other issues - show create interface
      console.warn('Game state fetch error:', err);
      setState(null);
      setGameCreated(false);
      setError(null); // Don't show error, just show create interface
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameState();
  }, [currentGameId]);

  const createGame = async () => {
    try {
      setCreatingGame(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/game/create`, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to create game');
      }
      const data = await response.json();
      setGameCreated(true);
      // Redirect to the new game ID
      window.location.href = `/gm/${data.gameId}`;
    } catch (err) {
      setError(err.message || 'Failed to create game');
    } finally {
      setCreatingGame(false);
    }
  };

  const startGame = async () => {
    try {
      setStartingGame(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/game/${currentGameId}/start`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerCount: 3 })
      });
      if (!response.ok) {
        throw new Error('Failed to start game');
      }
      const data = await response.json();
      setState(data);
    } catch (err) {
      setError(err.message || 'Failed to start game');
    } finally {
      setStartingGame(false);
    }
  };

  const triggerShock = async (command) => {
    await fetch(`${API_URL}/api/gm/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: currentGameId, command })
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <ErrorMessage message={error} onRetry={fetchGameState} />
      </div>
    );
  }

  // Show game creation interface if no game exists
  if (!gameCreated && !state) {
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h1 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Game Master Control Panel</h1>
          <ConnectionStatus />
        </div>
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--spacing-2xl)', 
          backgroundColor: 'var(--color-background-alt)',
          border: '2px dashed var(--color-border)',
          borderRadius: 'var(--border-radius-lg)',
          margin: 'var(--spacing-lg) 0'
        }}>
          <h2 style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--spacing-md) 0' }}>
            🎮 No Game Session Active
          </h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '0 0 var(--spacing-lg) 0' }}>
            Create a new game session to start managing the economic simulation.
          </p>
          <button 
            onClick={createGame}
            disabled={creatingGame}
            style={{
              padding: 'var(--spacing-md) var(--spacing-xl)',
              backgroundColor: creatingGame ? 'var(--color-text-muted)' : 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              fontSize: 'var(--font-size-lg)',
              fontWeight: '600',
              cursor: creatingGame ? 'not-allowed' : 'pointer',
              transition: 'background-color var(--transition-base)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}
            onMouseOver={(e) => {
              if (!creatingGame) e.target.style.backgroundColor = 'var(--color-primary-hover)';
            }}
            onMouseOut={(e) => {
              if (!creatingGame) e.target.style.backgroundColor = 'var(--color-primary)';
            }}
          >
            {creatingGame && <LoadingSpinner size="sm" />}
            {creatingGame ? 'Creating Game...' : '🚀 Create New Game'}
          </button>
        </div>
      </div>
    );
  }

  // Show game hasn't started yet (created but not started)
  if (gameCreated && state && (!state.companies || state.companies.length === 0)) {
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h1 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Game Master Control Panel</h1>
          <ConnectionStatus />
        </div>
        <div style={{
          backgroundColor: 'var(--color-background)',
          border: 'var(--border-width) solid var(--color-border)',
          borderRadius: 'var(--border-radius-lg)',
          padding: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <h2 style={{ margin: '0 0 var(--spacing-md) 0', color: 'var(--color-text-primary)' }}>
            Game Session: {currentGameId}
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', margin: '0 0 var(--spacing-lg) 0' }}>
            {startingGame ? 
              'Generating AI companies and economic conditions... This may take 10-20 seconds.' :
              'Game created but not started. Click "Start Game" to generate companies and begin the simulation.'
            }
          </p>
          {startingGame && (
            <div style={{ 
              margin: '0 0 var(--spacing-lg) 0',
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--color-background-alt)',
              borderRadius: 'var(--border-radius-md)',
              textAlign: 'center'
            }}>
              <LoadingSpinner size="md" />
              <p style={{ margin: 'var(--spacing-sm) 0 0 0', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Please wait while AI generates unique companies with detailed backstories...
              </p>
            </div>
          )}
          <button 
            onClick={startGame}
            disabled={startingGame}
            style={{
              padding: 'var(--spacing-md) var(--spacing-xl)',
              backgroundColor: startingGame ? 'var(--color-text-muted)' : 'var(--color-success)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--border-radius-md)',
              fontSize: 'var(--font-size-base)',
              fontWeight: '600',
              cursor: startingGame ? 'not-allowed' : 'pointer',
              transition: 'background-color var(--transition-base)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              opacity: startingGame ? 0.7 : 1
            }}
          >
            {startingGame && <LoadingSpinner size="sm" />}
            {startingGame ? 'Starting Game...' : '▶️ Start Game'}
          </button>
        </div>
      </div>
    );
  }

  // Show full GM interface when game is running
  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Game Master Control Panel</h1>
        <ConnectionStatus />
      </div>
      <div style={{ display: 'grid', gap: 'var(--spacing-lg)' }}>
        <GameControls gameId={currentGameId} startGame={startGame} />
        <GlobalLevers levers={levers} onChange={setLevers} />
        <ShockEventControl trigger={triggerShock} />
        <PlayerStatus submitted={submitted} />
        <GMDashboard companies={state?.companies || []} />
      </div>
    </div>
  );
};

export default GMView;
