import React from 'react';

const ShockEventControl = ({ trigger }) => (
  <div>
    <h3>Shock Events</h3>
    <button type="button" onClick={() => trigger('marketCrash')}>Market Crash</button>
    <button type="button" onClick={() => trigger('techBreakthrough')}>Tech Breakthrough</button>
  </div>
);

export default ShockEventControl;
