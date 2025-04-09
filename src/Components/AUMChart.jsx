import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { year: "Mar-20", aum: 7.2 },
  { year: "Jun-20", aum: 8.27 },
  { year: "Sep-20", aum: 9.15 },
  { year: "Dec-20", aum: 10.64 },
  { year: "Mar-21", aum: 8.19 },
  { year: "Jun-21", aum: 10.31 },
  { year: "Sep-21", aum: 13.02 },
  { year: "Dec-21", aum: 15.06 },
  { year: "Mar-22", aum: 16.79 },
  { year: "Jun-22", aum: 21.81 },
  { year: "Sep-22", aum: 35.9 },
  { year: "Dec-22", aum: 81.96 },
  { year: "Mar-23", aum: 46.31 },
  { year: "Jun-23", aum: 62.35 },
  { year: "Sep-23", aum: 80.23 },
  { year: "Dec-23", aum: 105.59 },
  { year: "Mar-24", aum: 125.75 },
  { year: "Jun-24", aum: 185.73 },
  { year: "Sep-24", aum: 215.59 },
  { year: "Dec-24", aum: 224.3 },
];

const AUMChart = () => {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="aum"
            stroke="#8884d8"
            strokeWidth={3}
            dot={{ r: 4 }}
            isAnimationActive={true}
            animationBegin={1000}
            animationDuration={2000}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AUMChart;
