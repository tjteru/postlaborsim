import './ErrorMessage.css';

const ErrorMessage = ({ 
  message, 
  onRetry, 
  variant = 'default',
  className = '' 
}) => {
  return (
    <div className={`error-message error-message--${variant} ${className}`} role="alert">
      <div className="error-message__icon">
        ⚠️
      </div>
      <div className="error-message__content">
        <p className="error-message__text">{message}</p>
        {onRetry && (
          <button 
            className="error-message__retry"
            onClick={onRetry}
            type="button"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;