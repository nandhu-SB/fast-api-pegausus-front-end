import React, { useState } from "react";

const FinancialsTable = ({ financials, title, selectedKeys }) => {
  const [showAll, setShowAll] = useState(false);

  // Extract all available financial keys
  const allKeys = Object.keys(financials);

  // Extract all periods (dates) from the first financial key
  const periods = financials[allKeys[0]]
    ? Object.keys(financials[allKeys[0]])
    : [];

  return (
    <div className="container-section">
      <h3>{title}</h3>
      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? "Show Selected" : "Show All"}
      </button>

      <div className="responsive-table">
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              {periods.map((date, idx) => (
                <th key={idx}>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allKeys
              .filter((key) => showAll || selectedKeys.includes(key))
              .map((key, idx) => (
                <tr key={idx}>
                  <td>{key}</td>
                  {periods.map((date, i) => (
                    <td key={i}>
                      {financials[key][date] !== 0
                        ? financials[key][date].toLocaleString()
                        : "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialsTable;
