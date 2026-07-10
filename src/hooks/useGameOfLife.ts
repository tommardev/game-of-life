import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import type { CellState, RunStats } from '../types';
import { NUM_ROWS, NUM_COLS, operations } from '../constants';
import {
  generateEmptyGrid,
  generateRandomGrid,
  countNeighbors,
  countAliveCells,
} from '../utils/gameUtils';

export const useGameOfLife = () => {
  const [grid, setGrid] = useState<CellState[][]>(generateEmptyGrid);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [populationHistory, setPopulationHistory] = useState<number[]>([]);
  const [speed, setSpeed] = useState(100);
  const [lastRunStats, setLastRunStats] = useState<RunStats | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  const runStatsRef = useRef<{
    startGeneration: number;
    startPopulation: number;
    peakPopulation: number;
    history: number[];
  } | null>(null);

  const runningRef = useRef(running);
  runningRef.current = running;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      const nextGrid = g.map((row) => [...row]);
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

          if (
            nextAlive !== cell.alive ||
            nextAge !== cell.age ||
            neighbors !== cell.neighbors
          ) {
            nextGrid[i][k] = {
              ...cell,
              alive: nextAlive,
              age: nextAge,
              neighbors,
            };
          }

          if (nextAlive) {
            currentPopulation++;
          }
        }
      }

      if (runStatsRef.current) {
        runStatsRef.current.peakPopulation = Math.max(
          runStatsRef.current.peakPopulation,
          currentPopulation,
        );
        runStatsRef.current.history.push(currentPopulation);
      }

      setPopulationHistory((prev) => {
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

  const setCellsState = useCallback(
    (changes: { i: number; k: number; alive: boolean }[]) => {
      if (changes.length === 0) return;

      setGrid((g) => {
        const newGrid = g.map((row) => [...row]);

        changes.forEach(({ i, k, alive }) => {
          newGrid[i][k] = {
            ...newGrid[i][k],
            alive: alive,
            age: alive ? 1 : 0,
          };
        });

        // Collect all affected cells (the changed ones + their 8 neighbors)
        const affectedCells = new Set<string>();
        changes.forEach(({ i, k }) => {
          affectedCells.add(`${i},${k}`);
          operations.forEach(([x, y]) => {
            const newI = i + x;
            const newK = k + y;
            if (newI >= 0 && newI < NUM_ROWS && newK >= 0 && newK < NUM_COLS) {
              affectedCells.add(`${newI},${newK}`);
            }
          });
        });

        // Recalculate countNeighbors only for the unique affected cells
        affectedCells.forEach((key) => {
          const [i, k] = key.split(',').map(Number);
          newGrid[i][k] = {
            ...newGrid[i][k],
            neighbors: countNeighbors(newGrid, i, k),
          };
        });

        return newGrid;
      });
    },
    [],
  );

  const handleStartStop = useCallback(() => {
    if (!running) {
      if (!runStatsRef.current) {
        const initialPop = countAliveCells(grid);
        runStatsRef.current = {
          startGeneration: generation,
          startPopulation: initialPop,
          peakPopulation: initialPop,
          history: [initialPop],
        };
      }
    } else {
      if (runStatsRef.current) {
        const finalPop = countAliveCells(grid);
        const elapsed = generation - runStatsRef.current.startGeneration;
        if (elapsed >= 1) {
          const stats: RunStats = {
            generationsElapsed: elapsed,
            startPopulation: runStatsRef.current.startPopulation,
            endPopulation: finalPop,
            peakPopulation: Math.max(
              runStatsRef.current.peakPopulation,
              finalPop,
            ),
            populationHistory: [...runStatsRef.current.history, finalPop],
          };
          setLastRunStats(stats);
          setShowInfoPanel(true);
        }
      }
    }
    setRunning((r) => !r);
  }, [running, grid, generation]);

  const handleClear = useCallback(() => {
    setGrid(generateEmptyGrid());
    setGeneration(0);
    setPopulationHistory([]);
    setRunning(false);
    setLastRunStats(null);
    setShowInfoPanel(false);
    runStatsRef.current = null;
  }, []);

  const handleRandom = useCallback(() => {
    setGrid(generateRandomGrid());
    setGeneration(0);
    setPopulationHistory([]);
    setLastRunStats(null);
    setShowInfoPanel(false);
    runStatsRef.current = null;
  }, []);

  const currentStats = useMemo(() => {
    const currentPop = countAliveCells(grid);
    if (!runStatsRef.current) {
      return {
        generationsElapsed: 0,
        startPopulation: currentPop,
        endPopulation: currentPop,
        peakPopulation: currentPop,
        populationHistory: [currentPop],
      };
    }
    const elapsed = generation - runStatsRef.current.startGeneration;
    
    return {
      generationsElapsed: elapsed,
      startPopulation: runStatsRef.current.startPopulation,
      endPopulation: currentPop,
      peakPopulation: Math.max(runStatsRef.current.peakPopulation, currentPop),
      populationHistory: [...runStatsRef.current.history, currentPop],
    };
  }, [grid, generation]);

  return {
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
  };
};
