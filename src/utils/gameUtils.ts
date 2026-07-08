import type { CellState } from '../types';
import { NUM_ROWS, NUM_COLS, operations } from '../constants';

export const countNeighbors = (g: CellState[][], i: number, k: number) => {
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

export const generateEmptyGrid = (): CellState[][] => {
  return Array.from({ length: NUM_ROWS }).map(() =>
    Array.from({ length: NUM_COLS }).map(() => ({ alive: false, age: 0, neighbors: 0 }))
  );
};

export const generateRandomGrid = (): CellState[][] => {
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

export const getCellColor = (alive: boolean, age: number) => {
  if (!alive) return '#1a1a1a';
  // Heatmap: Age 1 starts at Hue 50 (Yellow). As age increases, hue drops to 0 (Red).
  const hue = Math.max(0, 50 - (age * 2));
  return `hsl(${hue}, 100%, 50%)`;
};

export const getTooltipText = (cell: CellState) => {
  if (cell.alive) {
    if (cell.neighbors < 2) return { title: "Dying Next Turn", reason: "Crippling loneliness. (<2 neighbors)" };
    if (cell.neighbors > 3) return { title: "Dying Next Turn", reason: "Suffocating overpopulation. (>3 neighbors)" };
    return { title: `Surviving (Age: ${cell.age})`, reason: "Just right. The sweet spot of mediocrity." };
  } else {
    if (cell.neighbors === 3) return { title: "Being Born Next Turn", reason: "Miraculous digital conception. (3 neighbors)" };
    return { title: "Dead", reason: "Nothing to see here." };
  }
};
