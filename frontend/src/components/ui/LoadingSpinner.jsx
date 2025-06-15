import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`loading-spinner loading-spinner--${size} ${className}`} role="status" aria-label="Loading">
      <div className="loading-spinner__circle"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;