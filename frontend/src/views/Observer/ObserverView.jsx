import React, { useEffect, useState } from 'react';
import LobbyView from './LobbyView';
import MacroDashboard from './MacroDashboard';
import NewsFeed from './NewsFeed';
import { useSocket } from '../../context/SocketProvider';

const ObserverView = () => {
  const socket = useSocket();
  const [state, setState] = useState({ history: [] });
  const [news, setNews] = useState([]);
  const [gameId] = useState('game_1');

  useEffect(() => {
    if (!socket) return;
    socket.emit('joinRoom', { gameId });

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
  }, [socket, gameId]);

  return (
    <div>
      <LobbyView gameId={gameId} />
      <MacroDashboard data={state.history.map((s, i) => ({
        quarter: i + 1,
        gdp: s.economy?.gdp,
        unemployment: s.economy?.unemployment
      }))} />
      <NewsFeed news={news} />
    </div>
  );
};

export default ObserverView;
