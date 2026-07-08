import { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';

const NUM_ROWS = 50;
const NUM_COLS = 100;

const operations = [
  [0, 1], [0, -1], [1, -1], [-1, 1],
  [1, 1], [-1, -1], [1, 0], [-1, 0]
];

interface CellState {
  alive: boolean;
  age: number;
  neighbors: number; 
}

const countNeighbors = (g: CellState[][], i: number, k: number) => {
  let neighbors = 0;
  operations.forEach(([x, y]) => {
    const newI = i + x;
    const newK = k + y;
    if (newI >= 0 && newI < NUM_ROWS && newK >= 0 && newK < NUM_COLS) {
      if (g[newI][newK].alive) {
        neighbors += 1;
      }
    }
  });
  return neighbors;
};

const generateEmptyGrid = (): CellState[][] => {
  return Array.from({ length: NUM_ROWS }).map(() =>
    Array.from({ length: NUM_COLS }).map(() => ({ alive: false, age: 0, neighbors: 0 }))
  );
};

const generateRandomGrid = (): CellState[][] => {
  const grid = Array.from({ length: NUM_ROWS }).map(() =>
    Array.from({ length: NUM_COLS }).map(() => ({
      alive: Math.random() > 0.7,
      age: 1,
      neighbors: 0
    }))
  );
  // Calculate initial neighbors
  for (let i = 0; i < NUM_ROWS; i++) {
    for (let k = 0; k < NUM_COLS; k++) {
      grid[i][k].neighbors = countNeighbors(grid, i, k);
    }
  }
  return grid;
};

function App() {
  const [grid, setGrid] = useState<CellState[][]>(generateEmptyGrid);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [populationHistory, setPopulationHistory] = useState<number[]>([]);
  const [speed, setSpeed] = useState(100);

  const runningRef = useRef(running);
  runningRef.current = running;
  const speedRef = useRef(speed);

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      const nextGrid = g.map(row => row.map(cell => ({ ...cell })));
      let currentPopulation = 0;

      for (let i = 0; i < NUM_ROWS; i++) {
        for (let k = 0; k < NUM_COLS; k++) {
          const neighbors = countNeighbors(g, i, k);
          
          if (g[i][k].alive && (neighbors < 2 || neighbors > 3)) {
            nextGrid[i][k].alive = false;
            nextGrid[i][k].age = 0;
          } else if (!g[i][k].alive && neighbors === 3) {
            nextGrid[i][k].alive = true;
            nextGrid[i][k].age = 1;
          } else if (g[i][k].alive) {
            nextGrid[i][k].age += 1;
          }
        }
      }
      
      for (let i = 0; i < NUM_ROWS; i++) {
        for (let k = 0; k < NUM_COLS; k++) {
           nextGrid[i][k].neighbors = countNeighbors(nextGrid, i, k);
           if (nextGrid[i][k].alive) currentPopulation++;
        }
      }

      setPopulationHistory(prev => {
        const nextHist = [...prev, currentPopulation];
        if (nextHist.length > 50) nextHist.shift(); // Keep last 50
        return nextHist;
      });

      return nextGrid;
    });

    setGeneration((gen) => gen + 1);
    setTimeout(runSimulation, speedRef.current);
  }, []);

  useEffect(() => {
    if (running) {
      runSimulation();
    }
  }, [running, runSimulation]);

  const toggleCell = (i: number, k: number) => {
    const newGrid = [...grid];
    newGrid[i] = [...newGrid[i]];
    const wasAlive = newGrid[i][k].alive;
    newGrid[i][k] = { 
      ...newGrid[i][k], 
      alive: !wasAlive,
      age: !wasAlive ? 1 : 0 
    };
    
    // Update neighbors for accurate tooltips (naive approach for single click)
    for (let r = 0; r < NUM_ROWS; r++) {
      for (let c = 0; c < NUM_COLS; c++) {
        newGrid[r][c].neighbors = countNeighbors(newGrid, r, c);
      }
    }
    
    setGrid(newGrid);
  };

  const handleStartStop = () => {
    setRunning(!running);
  };

  const handleClear = () => {
    setGrid(generateEmptyGrid());
    setGeneration(0);
    setPopulationHistory([]);
    setRunning(false);
  };

  const handleRandom = () => {
    setGrid(generateRandomGrid());
    setGeneration(0);
    setPopulationHistory([]);
  };

  const getCellColor = (alive: boolean, age: number) => {
    if (!alive) return '#1a1a1a';
    // Heatmap: Age 1 starts at Hue 50 (Yellow). As age increases, hue drops to 0 (Red).
    const hue = Math.max(0, 50 - (age * 2));
    return `hsl(${hue}, 100%, 50%)`;
  };

  const getTooltipText = (cell: CellState) => {
    if (cell.alive) {
      if (cell.neighbors < 2) return { title: "Dying Next Turn", reason: "Crippling loneliness. (<2 neighbors)" };
      if (cell.neighbors > 3) return { title: "Dying Next Turn", reason: "Suffocating overpopulation. (>3 neighbors)" };
      return { title: `Surviving (Age: ${cell.age})`, reason: "Just right. The sweet spot of mediocrity." };
    } else {
      if (cell.neighbors === 3) return { title: "Being Born Next Turn", reason: "Miraculous digital conception. (3 neighbors)" };
      return { title: "Dead", reason: "Nothing to see here." };
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Conway's Game of Life</h1>
        <p className="subtitle">Where pixels desperately struggle for survival, just like you.</p>
        
        <div className="controls">
          <button onClick={handleStartStop}>
            {running ? 'Stop the Suffering' : 'Start the Simulation'}
          </button>
          <button onClick={handleRandom}>Randomize Chaos</button>
          <button onClick={handleClear}>Clear the Void</button>
          <div className="speed-control" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label htmlFor="speed-select" style={{ color: '#fff', fontSize: '0.9rem' }}>Speed:</label>
            <select 
              id="speed-select"
              value={speed} 
              onChange={(e) => {
                const val = Number(e.target.value);
                setSpeed(val);
                speedRef.current = val;
              }}
              style={{ padding: '0.3rem', borderRadius: '4px', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }}
            >
              <option value={500}>Sluggish (500ms)</option>
              <option value={200}>Slow (200ms)</option>
              <option value={100}>Normal (100ms)</option>
              <option value={50}>Fast (50ms)</option>
              <option value={16}>Ludicrous (16ms)</option>
            </select>
          </div>
        </div>
        
        <div className="stats">
          Generation: <span>{generation}</span>
        </div>
      </header>

      <div 
        className="grid-container"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${NUM_COLS}, 10px)`,
          gap: '1px',
          backgroundColor: '#333',
          justifyContent: 'center'
        }}
      >
        {grid.map((row, i) =>
          row.map((cell, k) => {
            const tooltip = getTooltipText(cell);
            return (
              <div
                key={`${i}-${k}`}
                onClick={() => toggleCell(i, k)}
                className="cell"
                style={{
                  width: 10,
                  height: 10,
                  backgroundColor: getCellColor(cell.alive, cell.age),
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                <div className="tooltip">
                  <div className="tooltip-title">{tooltip.title}</div>
                  <div className="tooltip-reason">{tooltip.reason}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {populationHistory.length > 0 && (
        <div className="chart-container" style={{ marginTop: '2rem', width: '100%', maxWidth: '1000px' }}>
          <h3 style={{ textAlign: 'center', color: '#ffaa00' }}>Demographic Collapse Chart (Population Over Time)</h3>
          <svg viewBox="0 0 500 100" style={{ width: '100%', height: '100px', backgroundColor: '#222', border: '1px solid #333', borderRadius: '4px' }}>
            {populationHistory.map((pop, i) => {
               const maxPop = Math.max(1, ...populationHistory);
               const x = (i / 49) * 500;
               const y = 100 - (pop / maxPop) * 90; // scale to 90% height
               
               if (i === 0) return <path key={i} d={`M ${x} ${y}`} stroke="#ff0055" strokeWidth="2" fill="none" />;
               
               // To draw a line from previous point to this one, we could use a single path, 
               // but rendering line segments is easier here.
               const prevPop = populationHistory[i - 1];
               const prevX = ((i - 1) / 49) * 500;
               const prevY = 100 - (prevPop / maxPop) * 90;
               return <line key={i} x1={prevX} y1={prevY} x2={x} y2={y} stroke="#ff0055" strokeWidth="2" />;
            })}
          </svg>
        </div>
      )}
    </div>
  );
}

export default App;
