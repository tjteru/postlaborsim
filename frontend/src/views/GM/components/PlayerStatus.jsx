import React from 'react';

const PlayerStatus = ({ submitted = [] }) => (
  <div>
    <h3>Player Status</h3>
    <ul>
      {submitted.map((p, i) => (
        <li key={i}>{p} submitted</li>
      ))}
    </ul>
  </div>
);

export default PlayerStatus;
