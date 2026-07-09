import { useEffect } from 'react';
import type { RunStats } from '../../types';
import './InfoPanel.css';

interface InfoPanelProps {
  isOpen: boolean;
  stats: RunStats | null;
  onClose: () => void;
}

export const InfoPanel = ({ isOpen, stats, onClose }: InfoPanelProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !stats) return null;

  const {
    generationsElapsed,
    startPopulation,
    endPopulation,
    peakPopulation,
    populationHistory,
  } = stats;

  // Analysis function to compute custom narrative based on simulation outcomes
  const analyzeRun = (): {
    title: string;
    story: string;
    badge: string;
    themeClass: string;
    accentColor: string;
  } => {
    if (generationsElapsed < 5) {
      return {
        title: 'A Fleeting Spark',
        story:
          'Your universe existed for only a brief moment. Before the digital cells could truly comprehend their own existence, the simulation was halted. A short-lived cosmic whisper.',
        badge: 'Blink of an Eye',
        themeClass: 'theme-fleeting',
        accentColor: '#94a3b8',
      };
    }

    if (endPopulation === 0) {
      return {
        title: 'The Age of Extinction',
        story:
          "A silent void remains. Every single cell perished under the unforgiving rules of Conway's nature. Life proved too fragile for this universe, leaving behind a cold, empty grid.",
        badge: 'Extinction Event',
        themeClass: 'theme-extinction',
        accentColor: '#ef4444',
      };
    }

    const lastFive = populationHistory.slice(-5);
    const isStable =
      lastFive.length >= 5 && lastFive.every((p) => p === endPopulation);
    if (isStable) {
      return {
        title: 'The Golden Age of Stability',
        story:
          'A peaceful harmony was achieved! The cells arranged themselves into perfect, unchanging structures. The universe has reached its ultimate equilibrium of eternal order.',
        badge: 'Stable Utopia',
        themeClass: 'theme-stability',
        accentColor: '#22c55e',
      };
    }

    if (endPopulation > startPopulation * 1.5) {
      return {
        title: 'The Age of Expansion',
        story:
          'An absolute triumph of life! The cells multiplied rapidly, conquering new territories and establishing massive, thriving colonies. The population boomed, filling the canvas.',
        badge: 'Expansion Peak',
        themeClass: 'theme-expansion',
        accentColor: '#06b6d4',
      };
    }

    if (endPopulation < startPopulation * 0.4) {
      return {
        title: 'The Great Decadence',
        story:
          'A tragic decline. What started as a promising and bustling society collapsed into a sparse collection of survivors. A dark age swept through the grid, leaving only a fraction of life.',
        badge: 'Survivors of Chaos',
        themeClass: 'theme-decadence',
        accentColor: '#f97316',
      };
    }

    return {
      title: 'The Turbulent Cosmos',
      story:
        'A dynamic era of constant struggle and adaptation. Cities rose and fell in rapid succession. The universe remains active and full of potential, with life constantly reshaping itself.',
      badge: 'Eternal Evolution',
      themeClass: 'theme-cosmos',
      accentColor: '#a855f7',
    };
  };

  const analysis = analyzeRun();
  const netChange = endPopulation - startPopulation;
  const netChangeText = netChange >= 0 ? `+${netChange}` : `${netChange}`;
  const netChangeClass =
    netChange > 0
      ? 'text-positive'
      : netChange < 0
        ? 'text-negative'
        : 'text-neutral';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${analysis.themeClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-badge-container">
          <span
            className="modal-badge"
            style={{
              borderColor: analysis.accentColor,
              color: analysis.accentColor,
            }}
          >
            {analysis.badge}
          </span>
        </div>
        <h2 className="modal-title">{analysis.title}</h2>
        <p className="modal-story">{analysis.story}</p>

        <div className="modal-divider"></div>

        <h3 className="section-title">Simulation Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="card-label">Generations</span>
            <span className="card-val">{generationsElapsed}</span>
          </div>
          <div className="stat-card">
            <span className="card-label">Peak Population</span>
            <span className="card-val">{peakPopulation}</span>
          </div>
          <div className="stat-card">
            <span className="card-label">Net Change</span>
            <span className={`card-val ${netChangeClass}`}>
              {netChangeText}
            </span>
          </div>
          <div className="stat-card">
            <span className="card-label">Starting Pop</span>
            <span className="card-val">{startPopulation}</span>
          </div>
          <div className="stat-card">
            <span className="card-label">Ending Pop</span>
            <span className="card-val">{endPopulation}</span>
          </div>
        </div>

        <button className="modal-close-btn" onClick={onClose}>
          Acknowledge & Continue
        </button>
      </div>
    </div>
  );
};
