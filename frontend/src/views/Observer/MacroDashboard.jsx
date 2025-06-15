import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MacroDashboard = ({ data }) => {
  return (
    <div>
      <h2>Economic Indicators</h2>
      <LineChart width={600} height={300} data={data}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="quarter" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="gdp" stroke="#8884d8" name="GDP" />
        <Line type="monotone" dataKey="unemployment" stroke="#82ca9d" name="Unemployment" />
      </LineChart>
    </div>
  );
};

export default MacroDashboard;
