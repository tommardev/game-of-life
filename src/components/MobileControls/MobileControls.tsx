import './MobileControls.css';

interface MobileControlsProps {
  running: boolean;
  onStartStop: () => void;
  onClear: () => void;
  onRandom: () => void;
}

export const MobileControls = ({
  running,
  onStartStop,
  onClear,
  onRandom,
}: MobileControlsProps) => {
  return (
    <div className="mobile-controls">
      <button className="mc-btn" onClick={onRandom} title="Randomize">
        🎲
      </button>
      <button className="mc-btn mc-play-btn" onClick={onStartStop} title={running ? 'Pause' : 'Play'}>
        {running ? '⏸' : '▶'}
      </button>
      <button className="mc-btn" onClick={onClear} title="Clear">
        🗑
      </button>
    </div>
  );
};
