import React from 'react';

const AIOpportunityCard = ({ selected, onSelect }) => (
  <div onClick={() => onSelect({ type: 'aiOpportunity', adopt: true })} style={{ border: selected ? '2px solid #32b8c6' : '1px solid #ccc', padding: '8px', marginBottom: '8px', cursor: 'pointer' }}>
    <h4>AI Opportunity</h4>
    <p>Invest in AI to improve efficiency.</p>
  </div>
);

export default AIOpportunityCard;
