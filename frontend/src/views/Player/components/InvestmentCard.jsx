import React, { useState } from 'react';

const InvestmentCard = ({ onSelect, selected }) => {
  const [amount, setAmount] = useState(0);
  const handleClick = () => {
    onSelect({ type: 'investment', amount: Number(amount) });
  };
  return (
    <div style={{ border: selected ? '2px solid #32b8c6' : '1px solid #ccc', padding: '8px', marginBottom: '8px' }}>
      <h4>Investment</h4>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button type="button" onClick={handleClick}>Select</button>
    </div>
  );
};

export default InvestmentCard;
