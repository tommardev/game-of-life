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
    const handleUp = () => {
      if (isMouseDownRef.current) {
        isMouseDownRef.current = false;
        const changes = Array.from(changesRef.current.values());
        if (changes.length > 0) {
          onSetCellsState(changes);
          changesRef.current.clear();
        }
      }
    };
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    window.addEventListener('touchcancel', handleUp);
    return () => {
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
      window.removeEventListener('touchcancel', handleUp);
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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
    if (element && element.dataset.row && element.dataset.col) {
      isMouseDownRef.current = true;
      const rowIndex = parseInt(element.dataset.row, 10);
      const colIndex = parseInt(element.dataset.col, 10);
      const cellAlive = grid[rowIndex][colIndex].alive;
      const targetState = !cellAlive;
      isDrawingAliveRef.current = targetState;

      changesRef.current.clear();
      changesRef.current.set(`${rowIndex}-${colIndex}`, {
        i: rowIndex,
        k: colIndex,
        alive: targetState,
      });

      element.style.backgroundColor = targetState
        ? 'hsl(48, 100%, 50%)'
        : '#1a1a1a';
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null;
    if (element && element.dataset.row && element.dataset.col) {
      const rowIndex = parseInt(element.dataset.row, 10);
      const colIndex = parseInt(element.dataset.col, 10);
      const key = `${rowIndex}-${colIndex}`;
      
      if (!changesRef.current.has(key)) {
        const targetState = isDrawingAliveRef.current;
        changesRef.current.set(key, {
          i: rowIndex,
          k: colIndex,
          alive: targetState,
        });

        element.style.backgroundColor = targetState
          ? 'hsl(48, 100%, 50%)'
          : '#1a1a1a';
      }
    }
  };

  return (
    <div
      className="grid-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{
        gridTemplateColumns: `repeat(${NUM_COLS}, 1fr)`,
      }}
    >
      {grid.map((row, i) =>
        row.map((cell, k) => (
          <Cell
            key={`${i}-${k}`}
            cell={cell}
            rowIndex={i}
            colIndex={k}
            onMouseDown={(e) => handleMouseDown(e, i, k, cell.alive)}
            onMouseEnter={(e) => handleMouseEnter(e, i, k)}
          />
        )),
      )}
    </div>
  );
};
