import { useSocket } from '../../context/SocketProvider';
import './ConnectionStatus.css';

const ConnectionStatus = () => {
  const { connectionStatus } = useSocket();

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'success';
      case 'connecting': return 'warning';
      case 'disconnected': 
      case 'error': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected': return 'Connected';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Disconnected';
      case 'error': return 'Connection Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`connection-status connection-status--${getStatusColor(connectionStatus)}`}>
      <div className="connection-status__indicator"></div>
      <span className="connection-status__text">
        {getStatusText(connectionStatus)}
      </span>
    </div>
  );
};

export default ConnectionStatus;