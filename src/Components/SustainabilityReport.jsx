import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Component to display excluded industries
const Exclusions = ({ exclusions }) => {
  return (
    <div className="exclusions-container">
      <h3>Excluded Industries</h3>
      <div className="grid">
        {Object.entries(exclusions).map(([key, value]) => (
          <span key={key} className={`badge ${value ? "allowed" : "excluded"}`}>
            {key.replace(/([A-Z])/g, " $1")}{" "}
            {/* Formats "palmOil" -> "Palm Oil" */}
          </span>
        ))}
      </div>
    </div>
  );
};

// Component to display ESG scores in a table
const EsgScores = ({ data }) => {
  return (
    <div className="esg-scores">
      <h3>ESG Scores</h3>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Score</th>
            <th>Percentile</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Environment</td>
            <td>{data.environmentScore}</td>
            <td>{data.environmentPercentile}%</td>
          </tr>
          <tr>
            <td>Social</td>
            <td>{data.socialScore}</td>
            <td>{data.socialPercentile}%</td>
          </tr>
          <tr>
            <td>Governance</td>
            <td>{data.governanceScore}</td>
            <td>{data.governancePercentile}%</td>
          </tr>
          <tr>
            <td>
              <strong>Total ESG</strong>
            </td>
            <td>
              <strong>{data.totalEsg}</strong>
            </td>
            <td>
              <strong>{data.percentile}%</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Component for Peer Comparison (Chart)
const PeerComparison = ({ data }) => {
  const chartData = [
    {
      name: "Environment",
      Score: data.environmentScore,
      Peer: data.peerEnvironmentPerformance.avg,
    },
    {
      name: "Social",
      Score: data.socialScore,
      Peer: data.peerSocialPerformance.avg,
    },
    {
      name: "Governance",
      Score: data.governanceScore,
      Peer: data.peerGovernancePerformance.avg,
    },
    {
      name: "Total ESG",
      Score: data.totalEsg,
      Peer: data.peerEsgScorePerformance.avg,
    },
  ];

  return (
    <div className="peer-comparison">
      <h3>Peer Comparison</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Score" fill="#8884d8" />
          <Bar dataKey="Peer" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Component to display related controversies
const Controversies = ({ data }) => {
  return (
    <div className="controversies">
      <h3>Controversies</h3>
      <p>Below controversies are found:</p>
      {data.relatedControversy.length > 0 ? (
        <ul>
          {data.relatedControversy.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No major controversies.</p>
      )}
    </div>
  );
};

// Main component that combines everything
const SustainabilityReport = ({ data }) => {
  return (
    <div>
      <h2>Sustainability Report</h2>
      {/* <Exclusions exclusions={data} /> */}
      <EsgScores data={data} />
      <PeerComparison data={data} />
      <Controversies data={data} />
    </div>
  );
};

export default SustainabilityReport;
