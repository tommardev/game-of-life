import { memo } from 'react';
import type { CellState } from '../../types';
import { getCellColor, getTooltipText } from '../../utils/gameUtils';
import './Cell.css';

interface CellProps {
  cell: CellState;
  rowIndex: number;
  colIndex: number;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Cell = memo(({ cell, rowIndex, colIndex, onMouseDown, onMouseEnter }: CellProps) => {
  const tooltip = getTooltipText(cell);

  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      className="cell"
      data-row={rowIndex}
      data-col={colIndex}
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
