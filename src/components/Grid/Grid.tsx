import { useRef, useEffect } from 'react';
import type { CellState } from '../../types';
import { NUM_COLS } from '../../constants';
import { Cell } from '../Cell/Cell';
import './Grid.css';

interface GridProps {
  grid: CellState[][];
  onSetCellsState: (
    changes: { i: number; k: number; alive: boolean }[],
  ) => void;
}

export const Grid = ({ grid, onSetCellsState }: GridProps) => {
  const isMouseDownRef = useRef(false);
  const isDrawingAliveRef = useRef(true);
  const changesRef = useRef<
    Map<string, { i: number; k: number; alive: boolean }>
  >(new Map());

  useEffect(() => {
    const handleMouseUp = () => {
      if (isMouseDownRef.current) {
        isMouseDownRef.current = false;
        const changes = Array.from(changesRef.current.values());
        onSetCellsState(changes);
        changesRef.current.clear();
      }
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onSetCellsState]);

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    rowIndex: number,
    colIndex: number,
    cellAlive: boolean,
  ) => {
    e.preventDefault();
    isMouseDownRef.current = true;
    const targetState = !cellAlive;
    isDrawingAliveRef.current = targetState;

    changesRef.current.clear();
    changesRef.current.set(`${rowIndex}-${colIndex}`, {
      i: rowIndex,
      k: colIndex,
      alive: targetState,
    });

    e.currentTarget.style.backgroundColor = targetState
      ? 'hsl(48, 100%, 50%)'
      : '#1a1a1a';
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    rowIndex: number,
    colIndex: number,
  ) => {
    if (isMouseDownRef.current) {
      const key = `${rowIndex}-${colIndex}`;
      if (!changesRef.current.has(key)) {
        const targetState = isDrawingAliveRef.current;
        changesRef.current.set(key, {
          i: rowIndex,
          k: colIndex,
          alive: targetState,
        });

        e.currentTarget.style.backgroundColor = targetState
          ? 'hsl(48, 100%, 50%)'
          : '#1a1a1a';
      }
    }
  };

  return (
    <div
      className="grid-container"
      style={{
        gridTemplateColumns: `repeat(${NUM_COLS}, 1fr)`,
      }}
    >
      {grid.map((row, i) =>
        row.map((cell, k) => (
          <Cell
            key={`${i}-${k}`}
            cell={cell}
            onMouseDown={(e) => handleMouseDown(e, i, k, cell.alive)}
            onMouseEnter={(e) => handleMouseEnter(e, i, k)}
          />
        )),
      )}
    </div>
  );
};
