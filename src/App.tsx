import { useGameOfLife } from './hooks/useGameOfLife';
import { Header } from './components/Header/Header';
import { Controls } from './components/Controls/Controls';
import { Grid } from './components/Grid/Grid';
import { Chart } from './components/Chart/Chart';
import './App.css';

function App() {
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
    handleRandom
  } = useGameOfLife();

  return (
    <div className="app-container">
      <Header generation={generation} />
      
      <Controls 
        running={running}
        speed={speed}
        onStartStop={handleStartStop}
        onRandom={handleRandom}
        onClear={handleClear}
        onSpeedChange={setSpeed}
      />

      <Grid grid={grid} onToggleCell={toggleCell} />

      <Chart populationHistory={populationHistory} />
    </div>
  );
}

export default App;
