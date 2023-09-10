// MineSweeper.tsx
import React, { useState } from "react";
import styles from "./MineSweeper.module.css";

type Cell = {
  hasMine: boolean;
  isRevealed: boolean;
  numOfMineAround?: number;
};

const MineSweeper: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>(
    Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({
        hasMine: Math.random() < 0.2,
        isRevealed: false,
      }))
    )
  );

  const revealCell = (x: number, y: number) => {
    const newGrid = [...grid];
    newGrid[x][y].isRevealed = true;
    let numOfMineAround = 0;
    for (let i = -1; i < 2 && x + i < grid.length; i++) {
      for (let k = -1; k < 2 && y + k < grid[0].length; k++) {
        if (-1 < y + k && -1 < x + i) {
          numOfMineAround += grid[x + i][y + k].hasMine ? 1 : 0;
        }
      }
    }
    newGrid[x][y].numOfMineAround = numOfMineAround;
    setGrid(newGrid);
  };

  return (
    <div>
      {grid.map((row, x) => (
        <div key={x}>
          {row.map((cell, y) => (
            <button
              key={y}
              className={`${styles.cell} ${
                cell.isRevealed ? styles.revealed : styles.hidden
              }`}
              onClick={() => revealCell(x, y)}
            >
              {cell.isRevealed && (cell.hasMine ? "💣" : cell.numOfMineAround)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MineSweeper;
