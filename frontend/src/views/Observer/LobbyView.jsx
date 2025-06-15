import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSocket } from '../../context/SocketProvider';

const LobbyView = ({ gameId }) => {
  const { socket } = useSocket();
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
    <div style={{
      backgroundColor: 'var(--color-background)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--border-radius-lg)',
      padding: 'var(--spacing-lg)',
      textAlign: 'center'
    }}>
      <h2 style={{ margin: '0 0 var(--spacing-lg) 0', color: 'var(--color-text-primary)' }}>
        Player Lobby
      </h2>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 'var(--spacing-lg)'
      }}>
        <div>
          <h3 style={{ margin: '0 0 var(--spacing-md) 0', color: 'var(--color-text-secondary)' }}>
            Scan to Join Game
          </h3>
          <div style={{
            padding: 'var(--spacing-md)',
            backgroundColor: 'white',
            borderRadius: 'var(--border-radius-md)',
            display: 'inline-block'
          }}>
            <QRCodeSVG value={joinUrl} size={200} />
          </div>
          <p style={{ 
            margin: 'var(--spacing-sm) 0 0 0', 
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-muted)',
            wordBreak: 'break-all'
          }}>
            Or visit: {joinUrl}
          </p>
        </div>
        
        <div style={{ width: '100%' }}>
          <h3 style={{ margin: '0 0 var(--spacing-md) 0', color: 'var(--color-text-secondary)' }}>
            Connected Players ({players.length})
          </h3>
          {players.length > 0 ? (
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gap: 'var(--spacing-sm)'
            }}>
              {players.map((p, i) => (
                <li key={i} style={{
                  padding: 'var(--spacing-sm)',
                  backgroundColor: 'var(--color-background-alt)',
                  borderRadius: 'var(--border-radius-sm)',
                  color: 'var(--color-text-primary)'
                }}>
                  {p.name || p}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ 
              color: 'var(--color-text-muted)', 
              fontStyle: 'italic',
              margin: 0
            }}>
              No players connected yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LobbyView;
