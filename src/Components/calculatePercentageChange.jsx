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
