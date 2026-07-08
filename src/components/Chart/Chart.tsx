import './Chart.css';

interface ChartProps {
  populationHistory: number[];
}

export const Chart = ({ populationHistory }: ChartProps) => {
  if (populationHistory.length === 0) return null;

  const maxPop = Math.max(1, ...populationHistory);

  return (
    <div className="chart-container">
      <h3>Demographic Collapse Chart (Population Over Time)</h3>
      <svg viewBox="0 0 500 100">
        {populationHistory.map((pop, i) => {
          const x = (i / 49) * 500;
          const y = 100 - (pop / maxPop) * 90;
          
          if (i === 0) return <path key={i} d={`M ${x} ${y}`} />;
          
          const prevPop = populationHistory[i - 1];
          const prevX = ((i - 1) / 49) * 500;
          const prevY = 100 - (prevPop / maxPop) * 90;
          return <line key={i} x1={prevX} y1={prevY} x2={x} y2={y} />;
        })}
      </svg>
    </div>
  );
};
