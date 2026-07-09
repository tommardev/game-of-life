import './Controls.css';

interface ControlsProps {
  running: boolean;
  speed: number;
  onStartStop: () => void;
  onRandom: () => void;
  onClear: () => void;
  onSpeedChange: (speed: number) => void;
}

export const Controls = ({
  running,
  speed,
  onStartStop,
  onRandom,
  onClear,
  onSpeedChange,
}: ControlsProps) => {
  return (
    <div className="controls">
      <button onClick={onStartStop}>
        {running ? 'Stop the Suffering' : 'Start the Simulation'}
      </button>
      <button onClick={onRandom}>Randomize Chaos</button>
      <button onClick={onClear}>Clear the Void</button>

      <div className="speed-control">
        <label htmlFor="speed-select">Speed:</label>
        <select
          id="speed-select"
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
        >
          <option value={500}>Sluggish (500ms)</option>
          <option value={200}>Slow (200ms)</option>
          <option value={100}>Normal (100ms)</option>
          <option value={50}>Fast (50ms)</option>
          <option value={16}>Ludicrous (16ms)</option>
        </select>
      </div>
    </div>
  );
};
