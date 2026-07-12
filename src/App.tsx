import { useState } from 'react';
import { useGameOfLife } from './hooks/useGameOfLife';
import { Header } from './components/Header/Header';
import { Controls } from './components/Controls/Controls';
import { Grid } from './components/Grid/Grid';
import { Chart } from './components/Chart/Chart';
import { InfoPanel } from './components/InfoPanel/InfoPanel';
import { MobileControls } from './components/MobileControls/MobileControls';
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
    setCellsState,
    handleStartStop,
    handleClear,
    handleRandom,
    lastRunStats,
    currentStats,
    showInfoPanel,
    setShowInfoPanel,
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
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

      <div className="main-content">
        <div className="main-content-inner">
          <InfoPanel 
            isOpen={!!currentStats} 
            stats={currentStats} 
            variant="embedded" 
          />
          <Grid grid={grid} onSetCellsState={setCellsState} />
        </div>
      </div>

      <MobileControls
        running={running}
        onStartStop={handleStartStop}
        onClear={handleClear}
        onRandom={handleRandom}
      />

      <InfoPanel
        isOpen={showInfoPanel}
        stats={lastRunStats}
        onClose={() => setShowInfoPanel(false)}
        variant="modal"
      />
    </div>
  );
}

export default App;
