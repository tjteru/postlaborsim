import React, { useState } from 'react';
import AIOpportunityCard from './AIOpportunityCard';
import InvestmentCard from './InvestmentCard';

const DecisionDeck = ({ onSubmit }) => {
  const [selected, setSelected] = useState(null);

  const handleSelect = (action) => setSelected(action);

  const handleSubmit = () => {
    if (selected) onSubmit(selected);
  };

  return (
    <div>
      <h3>Decisions</h3>
      <AIOpportunityCard selected={selected?.type === 'aiOpportunity'} onSelect={handleSelect} />
      <InvestmentCard selected={selected?.type === 'investment'} onSelect={handleSelect} />
      <button type="button" onClick={handleSubmit} disabled={!selected}>Submit</button>
    </div>
  );
};

export default DecisionDeck;
