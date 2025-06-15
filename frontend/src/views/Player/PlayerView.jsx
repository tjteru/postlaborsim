import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../context/SocketProvider';
import PlayerDashboard from './components/PlayerDashboard';
import DecisionDeck from './components/DecisionDeck';
import EmployeeRoster from './components/EmployeeRoster';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const PlayerView = () => {
  const { id: gameId } = useParams();
  const socket = useSocket();
  const [state, setState] = useState(null);
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

  useEffect(() => {
    fetch(`${API_URL}/api/game/${gameId}/state`)
      .then((res) => res.json())
      .then(setState)
      .catch(() => {});
  }, [gameId]);

  const submitAction = async (action) => {
    await fetch(`${API_URL}/api/player/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId, playerId, action })
    });
  };

  return (
    <div>
      <h1>Player View</h1>
      <PlayerDashboard company={state?.companies?.[0]} />
      <EmployeeRoster employees={state?.companies?.[0]?.employees} />
      <DecisionDeck onSubmit={submitAction} />
    </div>
  );
};

export default PlayerView;
