export interface CellState {
  alive: boolean;
  age: number;
  neighbors: number;
}

export interface RunStats {
  generationsElapsed: number;
  startPopulation: number;
  endPopulation: number;
  peakPopulation: number;
  populationHistory: number[];
}
