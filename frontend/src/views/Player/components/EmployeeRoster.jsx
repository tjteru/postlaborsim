import React from 'react';

const EmployeeRoster = ({ employees }) => (
  <div>
    <h3>Employees</h3>
    <ul>
      {employees && employees.length > 0 ? (
        employees.map((e, i) => (
          <li key={i}>{e.name} - {e.role}</li>
        ))
      ) : (
        <li>No employees</li>
      )}
    </ul>
  </div>
);

export default EmployeeRoster;
