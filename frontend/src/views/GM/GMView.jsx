import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketProvider';
import GMDashboard from './components/GMDashboard';
import GlobalLevers from './components/GlobalLevers';
import ShockEventControl from './components/ShockEventControl';
import GameControls from './components/GameControls';
import PlayerStatus from './components/PlayerStatus';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const GAME_ID = 'game_1';

const GMView = () => {
  const socket = useSocket();
  const [state, setState] = useState(null);
  const [submitted, setSubmitted] = useState([]);
  const [levers, setLevers] = useState({ taxRate: 20 });

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinRoom', { gameId: GAME_ID });
    const handleQuarter = (data) => setState(data);
    const handleDecision = ({ playerId }) => setSubmitted((s) => [...s, playerId]);
    socket.on('newQuarter', handleQuarter);
    socket.on('decisionReceived', handleDecision);
    return () => {
      socket.off('newQuarter', handleQuarter);
      socket.off('decisionReceived', handleDecision);
    };
  }, [socket]);

  useEffect(() => {
    fetch(`${API_URL}/api/game/${GAME_ID}/state`)
      .then((res) => res.json())
      .then(setState)
      .catch(() => {});
  }, []);

  const start = async () => {
    await fetch(`${API_URL}/api/game/${GAME_ID}/start`, { method: 'POST' });
  };

  const triggerShock = async (command) => {
    await fetch(`${API_URL}/api/gm/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId: GAME_ID, command })
    });
  };

  return (
    <div>
      <h1>Game Master View</h1>
      <GameControls start={start} />
      <GlobalLevers levers={levers} onChange={setLevers} />
      <ShockEventControl trigger={triggerShock} />
      <PlayerStatus submitted={submitted} />
      <GMDashboard companies={state?.companies || []} />
    </div>
  );
};

export default GMView;
