import React, { useState } from "react";

const FinancialsTable = ({ financials, title, selectedKeys }) => {
  const [showAll, setShowAll] = useState(false);

  // Helper: Format a number to Crores with commas
  const formatToCrores = (value) => {
    if (value == null || value === 0) return "N/A";
    const crores = value / 1e7; // Convert to crores
    return `${Math.round(crores).toLocaleString("en-IN")} Cr`;
  };

  const formatNumbers = (value) => {
    if (value == null || value === "N/A") return "N/A";

    const absValue = Math.abs(value);
    const sign = value < 0 ? "-" : "";

    if (absValue >= 1_00_00_000) {
      return (
        sign +
        (+(absValue / 1_00_00_000).toFixed(2)).toLocaleString("en-IN") +
        " Cr"
      );
    } else if (absValue >= 1_00_000) {
      return (
        sign +
        (+(absValue / 1_00_000).toFixed(2)).toLocaleString("en-IN") +
        " L"
      );
    } else {
      return sign + absValue.toFixed(2);
    }
  };

  // Extract all financial keys (metrics)
  const allKeys = Object.keys(financials || {});

  // Extract periods (dates) from the first metric
  const periods =
    allKeys.length > 0 && financials[allKeys[0]]
      ? Object.keys(financials[allKeys[0]])
      : [];

  if (!financials || allKeys.length === 0) {
    return <p>No financial data available.</p>;
  }

  return (
    <div>
      <h3>{title}</h3>
      <button onClick={() => setShowAll(!showAll)}>
        {showAll
          ? `Show Selected (${selectedKeys.length})`
          : `Show All (${allKeys.length})`}
      </button>

      <div className="responsive-table">
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              {periods.map((date) => (
                <th key={date}>{date}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allKeys
              .filter((key) => showAll || selectedKeys.includes(key))
              .map((key) => (
                <tr key={key}>
                  <td>{key}</td>
                  {periods.map((date) => (
                    <td key={`${key}-${date}`} style={{ textAlign: "right" }}>
                      {formatNumbers(financials[key][date])}
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
