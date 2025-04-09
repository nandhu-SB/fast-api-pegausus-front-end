import React, { useRef, useState, useEffect } from "react";
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
  BarChart,
  Bar,
} from "recharts";

import "./Home.css";
import Navbar from "./Navbar";
import Ticker from "./Ticker";
import PriceChart from "./PriceChart";
import QuarterlyFinancials from "./QuarterlyFinancials";
import FinancialsTable from "./QuarterlyFinancials";
import SustainabilityReport from "./Sustainabilityreport";

function HomePage() {
  const [historyPeriod, setHistoryPeriod] = useState("7d");
  const [ticker, setTicker] = useState("");
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  const menuScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setSidebarOpen(false);
  };

  const [sectionMap, setSectionMap] = useState({});
  const [visibleSections, setVisibleSections] = useState([]);
  const allowedIds = [
    "Fundamentals",
    "Performance",
    "Quarterly_Financials",
    "Yearly_Financials",
    "Quarterly_Balance_Sheet",
    "Yearly_Balance_Sheet",
    "Holdings",
    "Sustainability",
    "Recommendations",
    "News",
  ];
  const [titleVisible, setTitleVisible] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  const correctPassword = "1234"; // Change this to your desired password
  const aboutRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const updateSectionMap = () => {
    const sections = Array.from(document.querySelectorAll("[id]"));
    const map = {};
    const visibleIds = [];

    sections.forEach((el) => {
      if (allowedIds.includes(el.id)) {
        map[el.id] = el.offsetTop;
        visibleIds.push(el.id);
      }
    });
    setSectionMap(map); // Still stores offsetTop data
    setVisibleSections(visibleIds); // Store filtered visible ids
  };

  // Call this after data fetch
  useEffect(() => {
    updateSectionMap();
  }, [stockData]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const getRecommendationsData = () => {
    if (stockData && stockData.recommendations) {
      return stockData.recommendations.map((item) => ({
        period: `T-${item.period}`,
        strongBuy: item.strongBuy,
        buy: item.buy,
        hold: item.hold,
        sell: item.sell,
        strongSell: item.strongSell,
      }));
    }
    return [];
  };

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

  const fetchStockData = async (period = "7d") => {
    if (!ticker) return;
    setLoading(true);

    try {
      const response = await fetch(
        `${apiUrl}/stock/${ticker}.NS?period=${period}`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setStockData(null);
      } else {
        // console.log("Fetched News Data (fetchStockData):", data.news);
        setStockData(data);
        setError("");
      }
    } catch (err) {
      setError("Failed to fetch data");
    }
    setLoading(false);
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
  const calculatePercentageChange = (history, periodDays) => {
    if (!history || history.length === 0) return null;

    const sorted = [...history].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    const latest = sorted[sorted.length - 1];
    const latestDate = new Date(latest.date);
    const targetDate = new Date(latestDate);
    targetDate.setDate(targetDate.getDate() - periodDays);

    // Find the closest date before or equal to targetDate
    let past = sorted.findLast((item) => new Date(item.date) <= targetDate);

    if (!past) past = sorted[0];

    const change = ((latest.close - past.close) / past.close) * 100;
    return change.toFixed(2); // returns string like "5.43"
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      setTitleVisible(window.scrollY <= 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password! Please try again.");
    }
  };
  const handleKeyDown2 = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePasswordSubmit();
    }
  };
  if (!isAuthenticated) {
    return (
      <div className="landing-page">
        <div
          className="title-container"
          style={{
            transform: titleVisible
              ? `translateY(${scrollPosition * 0.5}px)`
              : "translateY(-100%)",
            opacity: titleVisible ? 1 : 0,
          }}
        >
          <h1>DEEPFINDER</h1>
          <h3>Enter Password</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown2}
            placeholder="Enter password"
          />
          <button onClick={handlePasswordSubmit} type="submit">
            Submit
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Ticker />
      <>
        {visibleSections && visibleSections.length > 0 && (
          <button className="hamburger" onClick={toggleSidebar}>
            ☰
          </button>
        )}

        {/* Hamburger Icon */}

        {/* Sidebar */}
        <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          {visibleSections.map((id) => (
            <button key={id} onClick={() => scrollToSection(id)}>
              {id.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
          ))}
        </div>

        {/* Overlay */}
        {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
      </>
      {/* 
      <div className="section-nav-sticky">
        {Object.keys(sectionMap).map((id) => (
          <button key={id} onClick={() => scrollToSection(id)}>
            {id.replace("-", " ")}
          </button>
        ))}
      </div> */}
      <div className="home-container">
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
            <div className="container-sections" id="summary">
              <p>
                <strong>Overview</strong>
                <br />
                {stockData.business_summary}
              </p>
            </div>

            <div className="container-sections" id="Fundamentals">
              <h3>Fundamentals</h3>
              <div className="sections">
                <div className="subsections">
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
                <div className="subsections">
                  <p>
                    <strong>Market Cap:</strong>{" "}
                    {formatNumbers(stockData.market_cap)}
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
                    <strong>Volume:</strong> {formatNumbers(stockData.volume)}
                  </p>
                  <p>
                    <strong>Average Volume:</strong>{" "}
                    {formatNumbers(stockData.average_volume)}
                  </p>
                </div>
              </div>
            </div>
            <div className="container-sections" id="Performance">
              <h3>Performance Summary</h3>
              <div className="cards">
                <div className="card">
                  <h4>1 Year</h4>
                  <p
                    style={{
                      color:
                        parseFloat(
                          calculatePercentageChange(stockData.history, 251)
                        ) >= 0
                          ? "green"
                          : "red",
                    }}
                  >
                    {calculatePercentageChange(stockData.history, 251)}%
                  </p>
                </div>
                <div className="card">
                  <h4>6 Month</h4>
                  <p
                    style={{
                      color:
                        parseFloat(
                          calculatePercentageChange(stockData.history, 104)
                        ) >= 0
                          ? "green"
                          : "red",
                    }}
                  >
                    {calculatePercentageChange(stockData.history, 104)}%
                  </p>
                </div>
                <div className="card">
                  <h4>1 Month</h4>
                  <p
                    style={{
                      color:
                        parseFloat(
                          calculatePercentageChange(stockData.history, 21)
                        ) >= 0
                          ? "green"
                          : "red",
                    }}
                  >
                    {calculatePercentageChange(stockData.history, 21)}%
                  </p>
                </div>
              </div>
              <PriceChart
                stockData={stockData}
                fetchStockData={fetchStockData}
              />
            </div>
            <div className="container-sections" id="Quarterly_Financials">
              {stockData.quarterly_financials && (
                <FinancialsTable
                  financials={stockData.quarterly_financials}
                  title="Quarterly Financials"
                  selectedKeys={[
                    "Operating Revenue",
                    "Total Revenue",
                    "Cost Of Revenue",
                    "Gross Profit",
                    "Operating Expense",
                    "Other Operating Expenses",
                    "Operating Income",
                    "Net Non Operating Interest Income Expense",
                  ]}
                />
              )}
            </div>
            <div className="container-sections" id="Yearly_Financials">
              {stockData.yearly_financials && (
                <FinancialsTable
                  financials={stockData.yearly_financials}
                  title="Yearly Financials"
                  selectedKeys={[
                    "Operating Revenue",
                    "Total Revenue",
                    "Cost Of Revenue",
                    "Gross Profit",
                    "Operating Expense",
                    "Other Operating Expenses",
                    "Operating Income",
                    "Net Non Operating Interest Income Expense",
                  ]}
                />
              )}
            </div>
            <div className="container-sections" id="Quarterly_Balance_Sheet">
              {stockData.quarterly_balance_sheet && (
                <FinancialsTable
                  financials={stockData.quarterly_balance_sheet}
                  title="Quarterly Balance Sheet"
                  selectedKeys={[
                    "Current Assets",
                    "Total Non Current Assets",
                    "Total Assets",
                    "Current Liabilities",
                    "Total Non Current Liabilities Net Minority Interest",
                    "Total Liabilities Net Minority Interest",
                    "Total Equity Gross Minority Interest",
                  ]}
                />
              )}
            </div>
            <div className="container-sections" id="Yearly_Balance_Sheet">
              {stockData.yearly_balance_sheet && (
                <FinancialsTable
                  financials={stockData.yearly_balance_sheet}
                  title="Yearly Balance Sheet"
                  selectedKeys={[
                    "Current Assets",
                    "Total Non Current Assets",
                    "Total Assets",
                    "Current Liabilities",
                    "Total Non Current Liabilities Net Minority Interest",
                    "Total Liabilities Net Minority Interest",
                    "Total Equity Gross Minority Interest",
                  ]}
                />
              )}
            </div>
            <div className="container-sections" id="Yearly_Cashflow">
              {stockData.yearly_cashflow && (
                <FinancialsTable
                  financials={stockData.yearly_cashflow}
                  title="Yearly Cash Flow"
                  selectedKeys={[
                    "Cash Flow Statement",
                    "Operating Cash Flow",
                    "Investing Cash Flow",
                    "Financing Cash Flow",
                    "Changes In Cash",
                    "Beginning Cash Position",
                    "End Cash Position",
                  ]}
                />
              )}
            </div>

            {stockData.holders && stockData.holders.Value && (
              <div className="container-sections" id="Holdings">
                <h3>Holdings</h3>
                <sections
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "600px",
                      height: "300px",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getHoldingsData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(1)}%`
                          }
                          outerRadius="60%"
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
                        <Legend verticalAlign="bottom" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <ul
                    style={{
                      listStyle: "none",
                      paddingLeft: 0,
                      marginTop: "1rem",
                    }}
                  >
                    <li>
                      <strong>Number of Institutions:</strong>{" "}
                      {stockData.holders.Value.institutionsCount}
                    </li>
                  </ul>
                </sections>
              </div>
            )}

            {stockData.sustainability_score &&
              Object.keys(stockData.sustainability_score).length > 0 && (
                <div className="container-sections" id="Sustainability">
                  <SustainabilityReport data={stockData.sustainability_score} />
                </div>
              )}

            <div className="container-sections" id="Recommendations">
              <h3>Analyst Recommendations</h3>
              {stockData.recommendations &&
              stockData.recommendations.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={getRecommendationsData()}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="strongBuy" fill="#008000" name="Strong Buy" />
                    <Bar dataKey="buy" fill="#00FF00" name="Buy" />
                    <Bar dataKey="hold" fill="#FFA500" name="Hold" />
                    <Bar dataKey="sell" fill="#FF4500" name="Sell" />
                    <Bar
                      dataKey="strongSell"
                      fill="#FF0000"
                      name="Strong Sell"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p>No recommendations available</p>
              )}
            </div>

            <div className="container-sections" id="News">
              <h3>Around the world</h3>

              {stockData.news && stockData.news.length > 0 ? (
                <sections className="news-sections">
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
                </sections>
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
