import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSocket } from '../../context/SocketProvider';

const LobbyView = ({ gameId }) => {
  const socket = useSocket();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!socket) return;
    const handleJoined = (player) => {
      setPlayers((prev) => [...prev, player]);
    };
    socket.on('playerJoined', handleJoined);
    return () => {
      socket.off('playerJoined', handleJoined);
    };
  }, [socket]);

  const joinUrl = `${window.location.origin}/player/${gameId}`;

  return (
    <div>
      <h2>Lobby</h2>
      <QRCodeSVG value={joinUrl} />
      <h3>Connected Players</h3>
      <ul>
        {players.map((p, i) => (
          <li key={i}>{p.name || p}</li>
        ))}
      </ul>
    </div>
  );
};

export default LobbyView;
