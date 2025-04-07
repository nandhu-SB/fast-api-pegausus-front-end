import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
} from "recharts";

const PriceChart = ({ stockData, fetchStockData }) => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  useEffect(() => {
    fetchStockData(selectedPeriod);
  }, [selectedPeriod]);

  return (
    <div className="container-section" id="price-chart">
      <h3>Stock Price Trend</h3>

      {/* Dropdown to Select Time Period */}
      <label htmlFor="period">Select Period: </label>
      <select
        id="period"
        value={selectedPeriod}
        onChange={(e) => setSelectedPeriod(e.target.value)}
      >
        <option value="1d">1 Day</option>
        <option value="7d">7 Days</option>
        <option value="1mo">1 Month</option>
        <option value="3mo">3 Months</option>
        <option value="1y">1 Year</option>
      </select>

      {stockData.history && stockData.history.length > 0 && (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stockData.history}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) =>
                new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
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
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PriceChart;
