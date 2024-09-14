import React, { useState } from 'react';
import './App.css';  // Import the CSS file

function App() {
  const [report, setReport] = useState([]);

  const handleGenerateReport = async () => {
    try {
      // Step 1: Fetch and store the data
      await fetch('http://localhost:5000/fetch-store-data');
      console.log('Data fetched and stored.');

      // Step 2: Generate the report
      const response = await fetch('http://localhost:5000/generate-report');
      const reportData = await response.json();
      setReport(reportData); // Store report data in state
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="container">
      <h1 className="title">Store Information</h1>
      <p className="description">Click the "Generate Report" button to connect to the API, fetch the latest data, store it in the database, and display the list of top purchasers.</p>
      <button className="generate-btn" onClick={handleGenerateReport}>Generate Report</button>

      {report.length > 0 && (
        <>
          <h2 className="subtitle">List of Top Purchasers:</h2>
          <table className="report-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {report.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>{item.total_spent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;

