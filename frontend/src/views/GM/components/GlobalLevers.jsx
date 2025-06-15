import React from 'react';

const GlobalLevers = ({ onChange, levers }) => (
  <div>
    <h3>Global Levers</h3>
    <label>
      Tax Rate: {levers.taxRate}%
      <input type="range" min="0" max="100" value={levers.taxRate}
        onChange={(e) => onChange({ ...levers, taxRate: Number(e.target.value) })}
      />
    </label>
  </div>
);

export default GlobalLevers;
