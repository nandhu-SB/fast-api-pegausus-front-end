import React from "react";

const scenarios = [
  [-10, 30, 20, 25, 25],
  [25, -10, 30, 20, 25],
  [25, 25, -10, 30, 20],
  [20, 25, 25, -10, 30],
  [30, 20, 25, 25, -10],
];

const PortfolioRisk = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mt-6 p-4 border rounded-lg shadow-sm bg-gray-100">
        <h3 className="text-lg font-semibold text-gray-700">ASSUMPTIONS</h3>
        <ul className="list-disc pl-5 text-gray-600">
          <li>Key long-term secular growth story of our country is intact.</li>
          <li>
            VERY bad year within a 5 Year cycle. One like 2008, 2010, 2015, or
            2020.
          </li>
          <li>
            CAGR of <strong>17.5% in 5 Years</strong>
          </li>
          <li>
            Negative returns in Year 1 and even Year 2 in case of bad year at
            start.
          </li>
          <li>
            Outperformance in at least 1 Year, Avg in 2 Years & base performance
            in 1 Year during the 5 Year cycle.
          </li>
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700">
          Probable Scenarios in a 5 Year Cycle (Incl. dividend yield of 1%)
        </h3>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="border border-gray-300 p-2">SCENARIOS</th>
              {Array.from({ length: 5 }, (_, i) => (
                <th key={i} className="border border-gray-300 p-2">
                  YEAR {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario, i) => (
              <tr key={i} className="text-center">
                <td className="border border-gray-300 p-2 font-bold">
                  {i + 1}
                </td>
                {scenario.map((value, j) => (
                  <td
                    key={j}
                    className={`border border-gray-300 p-2 ${
                      value < 0
                        ? "bg-red-200 text-red-700"
                        : "bg-green-200 text-green-700"
                    }`}
                  >
                    {value}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-gray-500 text-sm mt-4">
        *Projected/expected returns. #Incl dividend yield of 1%. Excluding fee,
        charges, and taxes.
      </p>
      <p className="text-gray-600">
        *Doubling of Portfolio will get extended by 2 years
      </p>
    </div>
  );
};

export default PortfolioRisk;
