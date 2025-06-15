import React from 'react';

const GameControls = ({ start }) => (
  <div>
    <h3>Game Controls</h3>
    <button type="button" onClick={start}>Start Game</button>
  </div>
);

export default GameControls;
