import { useState, useCallback, useRef, useEffect } from 'react';
import type { CellState } from '../types';
import { NUM_ROWS, NUM_COLS } from '../constants';
import { generateEmptyGrid, generateRandomGrid, countNeighbors } from '../utils/gameUtils';

export const useGameOfLife = () => {
  const [grid, setGrid] = useState<CellState[][]>(generateEmptyGrid);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [populationHistory, setPopulationHistory] = useState<number[]>([]);
  const [speed, setSpeed] = useState(100);

  const runningRef = useRef(running);
  runningRef.current = running;
  const speedRef = useRef(speed);
  speedRef.current = speed;

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

  return {
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
  };
};
