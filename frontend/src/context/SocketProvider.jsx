import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    const s = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3100');
    
    s.on('connect', () => {
      setConnectionStatus('connected');
    });
    
    s.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });
    
    s.on('connect_error', () => {
      setConnectionStatus('error');
    });
    
    s.on('reconnect', () => {
      setConnectionStatus('connected');
    });
    
    s.on('reconnecting', () => {
      setConnectionStatus('connecting');
    });
    
    setSocket(s);
    
    return () => {
      s.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connectionStatus }}>
      {children}
    </SocketContext.Provider>
  );
};
