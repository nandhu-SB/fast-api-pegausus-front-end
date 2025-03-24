import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Brush,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import "./Home.css";
import Navbar from "./Navbar";
import Ticker from "./Ticker";

function HomePage() {
  const [ticker, setTicker] = useState("");
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  // // Logs whenever stockData updates
  // useEffect(() => {
  //   if (stockData && stockData.news) {
  //     console.log("Updated News Data (useEffect):", stockData.news);
  //   }
  // }, [stockData]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      fetchStockData();
    }
  };

  const fetchStockData = async () => {
    if (!ticker) return;
    setLoading(true);

    try {
      // const response = await fetch(`http://127.0.0.1:8000/stock/${ticker}.NS`);
      const response = await fetch(`${apiUrl}/stock/${ticker}.NS`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setStockData(null);
      } else {
        console.log("Fetched News Data (fetchStockData):", data.news); // Direct log after fetching
        setStockData(data);
        setError("");
      }
    } catch (err) {
      setError("Failed to fetch data");
    }
    setLoading(false);
  };

  const formatMarketCap = (value) => {
    if (!value || value === "N/A") return "N/A";

    if (value >= 1_00_00_00_000) {
      return (value / 1_00_00_00_000).toFixed(2) + " Cr";
    } else if (value >= 1_00_000) {
      return (value / 1_00_000).toFixed(2) + " L";
    } else {
      return value.toFixed(2);
    }
  };
  const getHoldingsData = () => {
    if (stockData && stockData.holders && stockData.holders.Value) {
      return [
        {
          name: "Insiders",
          value: stockData.holders.Value.insidersPercentHeld * 100,
        },
        {
          name: "Institutions",
          value: stockData.holders.Value.institutionsPercentHeld * 100,
        },
        {
          name: "Institutions Float",
          value: stockData.holders.Value.institutionsFloatPercentHeld * 100,
        },
      ];
    }
    return [];
  };

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

  return (
    <>
      <Ticker />
      <div className="home-container">
        {/* <Navbar /> */}

        <h1>Project Pegasus</h1>

        <input
          type="text"
          placeholder="Enter stock symbol"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type="button" onClick={fetchStockData}>
          Search
        </button>
        {loading && <p>Loading Data...</p>}

        {error && (
          <p className="error" id="error">
            Please check the stock name again. Something went wrong
          </p>
        )}

        {stockData && (
          <div className="stock-info">
            <h2>{stockData.symbol}</h2>
            <p>Sector: {stockData.sector}</p>
            <p>Industry: {stockData.industry}</p>
            <div className="container-section" id="summary">
              <p>
                <strong>Overview</strong>
                <br />
                {stockData.business_summary}
              </p>
            </div>

            <div className="container-section" id="fundaementals">
              <h3>Fundamentals</h3>
              <div className="section">
                <div className="subsection">
                  <p>
                    <strong>Price:</strong> ₹{stockData.price}
                  </p>
                  <p>
                    <strong>Open:</strong> ₹{stockData.open}
                  </p>
                  <p>
                    <strong>High:</strong> ₹{stockData.high}
                  </p>
                  <p>
                    <strong>Low:</strong> ₹{stockData.low}
                  </p>
                  <p>
                    <strong>Previous Close:</strong> ₹{stockData.previous_close}
                  </p>
                  <p>
                    <strong>52-Week High:</strong> ₹{stockData["52_week_high"]}
                  </p>
                  <p>
                    <strong>52-Week Low:</strong> ₹{stockData["52_week_low"]}
                  </p>
                </div>

                <div className="subsection">
                  <p>
                    <strong>Market Cap:</strong>{" "}
                    {formatMarketCap(stockData.market_cap)}
                  </p>
                  <p>
                    <strong>P/E Ratio:</strong> {stockData.pe_ratio}
                  </p>
                  <p>
                    <strong>Dividend Yield:</strong> {stockData.dividend_yield}
                  </p>
                  <p>
                    <strong>Sector:</strong> {stockData.sector}
                  </p>
                  <p>
                    <strong>Industry:</strong> {stockData.industry}
                  </p>
                  <p>
                    <strong>Volume:</strong> {formatMarketCap(stockData.volume)}
                  </p>
                  <p>
                    <strong>Average Volume:</strong>{" "}
                    {formatMarketCap(stockData.average_volume)}
                  </p>
                </div>
              </div>
            </div>

            {stockData.history && stockData.history.length > 0 && (
              <div className="container-section" id="price-chart">
                <h3>1-Day Price Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stockData.history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => {
                        const options = { month: "short", day: "numeric" };
                        return new Date(date).toLocaleDateString(
                          "en-US",
                          options
                        );
                      }}
                    />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div
                              style={{
                                background: "#333",
                                padding: "10px",
                                borderRadius: "8px",
                                color: "#fff",
                              }}
                            >
                              <p>
                                <strong>
                                  {new Date(label).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </strong>
                              </p>
                              <p>Close: ₹{payload[0].value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="close"
                      stroke="#8884d8"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />

                    <Brush
                      dataKey="date"
                      height={30}
                      stroke="#8884d8"
                      travellerWidth={8}
                      startIndex={0}
                      endIndex={stockData.history.length - 1}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {stockData.quarterly_financials && (
              <div className="container-section" id="qoq">
                <h3>Quarterly Financials</h3>
                <div className="responsive-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Quarter</th>
                        {Object.keys(
                          stockData.quarterly_financials[
                            Object.keys(stockData.quarterly_financials)[0]
                          ] || {}
                        ).map((key, idx) => (
                          <th key={idx}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(stockData.quarterly_financials).map(
                        ([date, values], idx) => (
                          <tr key={idx}>
                            <td>{date}</td>
                            {Object.values(values).map((val, i) => (
                              <td key={i}>
                                {val !== 0 ? val.toLocaleString() : "N/A"}
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {stockData.yearly_financials && (
              <div className="container-section" id="yoy">
                <h3>Yearly Financials</h3>
                <div className="responsive-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Year</th>
                        {Object.keys(
                          stockData.yearly_financials[
                            Object.keys(stockData.yearly_financials)[0]
                          ] || {}
                        ).map((key, idx) => (
                          <th key={idx}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(stockData.yearly_financials).map(
                        ([date, values], idx) => (
                          <tr key={idx}>
                            <td>{date}</td>
                            {Object.values(values).map((val, i) => (
                              <td key={i}>
                                {val !== 0 ? val.toLocaleString() : "N/A"}
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="container-section" id="holdings">
              <h3>Ownership Breakdown</h3>
              {stockData.holders && stockData.holders.Value && (
                <section
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <PieChart width={400} height={300}>
                    <Pie
                      data={getHoldingsData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(1)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getHoldingsData().map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>

                  <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                    <li>
                      <strong>Number of Institutions:</strong>{" "}
                      {stockData.holders.Value.institutionsCount}
                    </li>
                  </ul>
                </section>
              )}
            </div>

            {/* News Section */}
            <div className="container-section" id="news">
              <h3>Around the world</h3>

              {stockData.news && stockData.news.length > 0 ? (
                <section className="news-section">
                  <ul className="news-list">
                    {stockData.news.map((article, index) => (
                      <li key={index} className="news-item">
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="news-title"
                        >
                          <h3>{article.title}</h3>
                          <p className="news-summary">{article.summary}</p>
                          <p className="news-publisher">
                            Published by: {article.publisher}
                          </p>
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : (
                <p>No recent news available.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;
