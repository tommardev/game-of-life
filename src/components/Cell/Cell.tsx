import { memo } from 'react';
import type { CellState } from '../../types';
import { getCellColor, getTooltipText } from '../../utils/gameUtils';
import './Cell.css';

interface CellProps {
  cell: CellState;
  rowIndex: number;
  colIndex: number;
  onToggleCell: (i: number, k: number) => void;
}

export const Cell = memo(({ cell, rowIndex, colIndex, onToggleCell }: CellProps) => {
  const tooltip = getTooltipText(cell);
  
  return (
    <div
      onClick={() => onToggleCell(rowIndex, colIndex)}
      className="cell"
      style={{
        backgroundColor: getCellColor(cell.alive, cell.age),
      }}
    >
      <div className="tooltip">
        <div className="tooltip-title">{tooltip.title}</div>
        <div className="tooltip-reason">{tooltip.reason}</div>
      </div>
    </div>
  );
});
