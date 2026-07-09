import { useState } from 'react';
import { useGameOfLife } from './hooks/useGameOfLife';
import { Header } from './components/Header/Header';
import { Controls } from './components/Controls/Controls';
import { Grid } from './components/Grid/Grid';
import { Chart } from './components/Chart/Chart';
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const {
    grid,
    running,
    generation,
    populationHistory,
    speed,
    setSpeed,
    toggleCell,
    handleStartStop,
    handleClear,
    handleRandom,
  } = useGameOfLife();

  return (
    <div className="app-container">
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <button
          className="sidebar-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '◀' : '▶'}
        </button>
        <div className="sidebar-content">
          <Header generation={generation} />
          <Controls
            running={running}
            speed={speed}
            onStartStop={handleStartStop}
            onRandom={handleRandom}
            onClear={handleClear}
            onSpeedChange={setSpeed}
          />
          <Chart populationHistory={populationHistory} />
        </div>
      </div>

      <div className="main-content">
        <Grid grid={grid} onToggleCell={toggleCell} />
      </div>
    </div>
  );
}

export default App;
