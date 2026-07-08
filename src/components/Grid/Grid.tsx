import type { CellState } from '../../types';
import { NUM_COLS } from '../../constants';
import { Cell } from '../Cell/Cell';
import './Grid.css';

interface GridProps {
  grid: CellState[][];
  onToggleCell: (i: number, k: number) => void;
}

export const Grid = ({ grid, onToggleCell }: GridProps) => {
  return (
    <div 
      className="grid-container"
      style={{
        gridTemplateColumns: `repeat(${NUM_COLS}, 10px)`
      }}
    >
      {grid.map((row, i) =>
        row.map((cell, k) => (
          <Cell 
            key={`${i}-${k}`} 
            cell={cell} 
            onClick={() => onToggleCell(i, k)} 
          />
        ))
      )}
    </div>
  );
};
