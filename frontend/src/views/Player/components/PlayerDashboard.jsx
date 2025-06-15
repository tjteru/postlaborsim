import React from 'react';

const PlayerDashboard = ({ company }) => {
  if (!company) return <p>No company data</p>;
  return (
    <div>
      <h2>{company.name}</h2>
      <p>Cash: {company.cash}</p>
      <p>Revenue: {company.revenue}</p>
    </div>
  );
};

export default PlayerDashboard;
