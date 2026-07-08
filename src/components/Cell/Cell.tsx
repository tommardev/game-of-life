import type { CellState } from '../../types';
import { getCellColor, getTooltipText } from '../../utils/gameUtils';
import './Cell.css';

interface CellProps {
  cell: CellState;
  onClick: () => void;
}

export const Cell = ({ cell, onClick }: CellProps) => {
  const tooltip = getTooltipText(cell);
  
  return (
    <div
      onClick={onClick}
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
};
