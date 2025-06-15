import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './MacroDashboard.css';

const MacroDashboard = ({ data = [] }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="macro-dashboard">
      <h2 className="macro-dashboard__title">Economic Indicators</h2>
      <div className="macro-dashboard__chart-container">
        {hasData ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="quarter" 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-text-secondary)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-background)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--border-radius-md)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="gdp" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                name="GDP Growth (%)"
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="unemployment" 
                stroke="var(--color-accent)" 
                strokeWidth={3}
                name="Unemployment (%)"
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-accent)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="macro-dashboard__no-data">
            <p>No economic data available yet. Start the game to see indicators.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MacroDashboard;
