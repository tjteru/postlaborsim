import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../context/SocketProvider';
import PlayerDashboard from './components/PlayerDashboard';
import DecisionDeck from './components/DecisionDeck';
import EmployeeRoster from './components/EmployeeRoster';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import ConnectionStatus from '../../components/ui/ConnectionStatus';
import '../../styles/variables.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3100';

const PlayerView = () => {
  const { id: gameId } = useParams();
  const { socket } = useSocket();
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playerId] = useState(() => {
    const existing = localStorage.getItem('playerId');
    if (existing) return existing;
    const pid = `player_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem('playerId', pid);
    return pid;
  });

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinRoom', { gameId, playerId });
    const handleQuarter = (data) => setState(data);
    socket.on('newQuarter', handleQuarter);
    return () => {
      socket.off('newQuarter', handleQuarter);
    };
  }, [socket, gameId, playerId]);

  const fetchGameState = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/game/${gameId}/state`);
      if (!response.ok) {
        throw new Error('Failed to load game state');
      }
      const data = await response.json();
      setState(data);
    } catch (err) {
      setError(err.message || 'Failed to load game state');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameState();
  }, [gameId]);

  const submitAction = async (action) => {
    try {
      const response = await fetch(`${API_URL}/api/player/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId, playerId, action })
      });
      if (!response.ok) {
        throw new Error('Failed to submit action');
      }
    } catch (err) {
      console.error('Error submitting action:', err);
    }
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

  // Handle case where game exists but hasn't been started yet
  if (state && (!state.companies || state.companies.length === 0)) {
    return (
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
          <h1 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Player View</h1>
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
            🎮 Waiting for Game to Start
          </h2>
          <p style={{ color: 'var(--color-text-muted)', margin: '0 0 var(--spacing-md) 0' }}>
            Game ID: <strong>{gameId}</strong>
          </p>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>
            The Game Master needs to start the game to assign companies to players.
            <br />
            You'll see your company dashboard here once the game begins.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--spacing-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
        <h1 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Player View</h1>
        <ConnectionStatus />
      </div>
      <PlayerDashboard company={state?.companies?.[0]} />
      <EmployeeRoster employees={state?.companies?.[0]?.employees} />
      <DecisionDeck onSubmit={submitAction} />
    </div>
  );
};

export default PlayerView;
