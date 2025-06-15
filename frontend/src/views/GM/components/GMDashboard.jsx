import React from 'react';

const GMDashboard = ({ companies = [] }) => (
  <div>
    <h2>Companies</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Cash</th>
          <th>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {companies.map((c, i) => (
          <tr key={i}>
            <td>{c.name}</td>
            <td>{c.cash}</td>
            <td>{c.revenue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default GMDashboard;
