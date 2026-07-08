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
      const nextGrid = g.map(row => [...row]);
      let currentPopulation = 0;

      for (let i = 0; i < NUM_ROWS; i++) {
        for (let k = 0; k < NUM_COLS; k++) {
          const cell = g[i][k];
          const neighbors = countNeighbors(g, i, k);
          
          let nextAlive = cell.alive;
          let nextAge = cell.age;
          
          if (cell.alive && (neighbors < 2 || neighbors > 3)) {
            nextAlive = false;
            nextAge = 0;
          } else if (!cell.alive && neighbors === 3) {
            nextAlive = true;
            nextAge = 1;
          } else if (cell.alive) {
            nextAge += 1;
          }

          if (nextAlive !== cell.alive || nextAge !== cell.age) {
            nextGrid[i][k] = { ...cell, alive: nextAlive, age: nextAge };
          }
        }
      }
      
      for (let i = 0; i < NUM_ROWS; i++) {
        for (let k = 0; k < NUM_COLS; k++) {
           const newNeighbors = countNeighbors(nextGrid, i, k);
           const cell = nextGrid[i][k];
           
           if (cell.neighbors !== newNeighbors) {
             nextGrid[i][k] = { ...cell, neighbors: newNeighbors };
           }
           
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

  const toggleCell = useCallback((i: number, k: number) => {
    setGrid((g) => {
      const newGrid = g.map(row => [...row]);
      const wasAlive = newGrid[i][k].alive;
      newGrid[i][k] = { 
        ...newGrid[i][k], 
        alive: !wasAlive,
        age: !wasAlive ? 1 : 0 
      };
      
      for (let r = 0; r < NUM_ROWS; r++) {
        for (let c = 0; c < NUM_COLS; c++) {
          const newNeighbors = countNeighbors(newGrid, r, c);
          const cell = newGrid[r][c];
          if (cell.neighbors !== newNeighbors) {
            newGrid[r][c] = { ...cell, neighbors: newNeighbors };
          }
        }
      }
      
      return newGrid;
    });
  }, []);

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
