import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"]; // Purple, Green, Yellow shades

const HoldingsPieChart = ({ holders }) => {
  const getHoldingsData = () => {
    if (!holders) return [];

    return holders.map((holder) => ({
      name: holder[0],
      value: holder[1],
    }));
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div style={{ width: "100%", height: 400 }}>
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
        Ownership Breakdown
      </h3>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={getHoldingsData()}
            cx="50%"
            cy="50%"
            label={renderCustomizedLabel}
            labelLine={false}
            outerRadius={120}
            dataKey="value"
          >
            {getHoldingsData().map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HoldingsPieChart;
