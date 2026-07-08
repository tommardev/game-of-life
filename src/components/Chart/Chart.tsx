import './Chart.css';

interface ChartProps {
  populationHistory: number[];
}

export const Chart = ({ populationHistory }: ChartProps) => {
  if (populationHistory.length === 0) return null;

  const maxPop = Math.max(1, ...populationHistory);
  const currentPop = populationHistory[populationHistory.length - 1];

  const areaPoints = populationHistory.map((pop, i) => {
    const x = (i / Math.max(1, populationHistory.length - 1)) * 500;
    const y = 100 - (pop / maxPop) * 90;
    return `${x},${y}`;
  });

  const areaPath = `M 0 100 L ${areaPoints.join(' L ')} L 500 100 Z`;
  const linePath = `M ${areaPoints.join(' L ')}`;

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Population History</h3>
        <div className="chart-stats">
          <div className="stat">
            <span className="stat-label">Current:</span>
            <span className="stat-value current">{currentPop}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Max:</span>
            <span className="stat-value max">{maxPop}</span>
          </div>
        </div>
      </div>
      <div className="svg-wrapper">
        <svg viewBox="0 0 500 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="popGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ff0055" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ff0055" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#popGradient)" />
          <path d={linePath} className="chart-line" />
        </svg>
        <div className="chart-grid">
          <div className="grid-line" style={{ bottom: '10%' }}></div>
          <div className="grid-line" style={{ bottom: '55%' }}></div>
          <div className="grid-line" style={{ bottom: '100%' }}></div>
        </div>
      </div>
    </div>
  );
};
