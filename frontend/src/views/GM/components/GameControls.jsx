import React from 'react';
import './GameControls.css';

const GameControls = ({ gameId, startGame }) => {
  return (
    <div className="game-controls">
      <h3 className="game-controls__title">Game Controls</h3>
      <div className="game-controls__info">
        <p><strong>Game ID:</strong> {gameId}</p>
        <p><strong>Status:</strong> Ready to start</p>
      </div>
      <div className="game-controls__actions">
        <button 
          type="button" 
          onClick={startGame}
          className="game-controls__button game-controls__button--start"
        >
          ▶️ Start Game
        </button>
        <button 
          type="button" 
          className="game-controls__button game-controls__button--secondary"
          onClick={() => window.location.reload()}
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default GameControls;
