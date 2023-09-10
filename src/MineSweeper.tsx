// MineSweeper.tsx
import React, { useState } from "react";
import styles from "./MineSweeper.module.css";

type Cell = {
  hasMine: boolean;
  isRevealed: boolean;
  numOfMineAround?: number;
  causeOfDeath: boolean;
};

enum Mode {
  Normal,
  Remove,
}

const initializeBoard = () => {
  return Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({
      hasMine: Math.random() < 0.0001,
      isRevealed: false,
      causeOfDeath: false,
    }))
  );
};

const MineSweeper: React.FC = () => {
  const [mode, setMode] = useState<Mode>(Mode.Normal);
  const [lock, setLock] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("ゲーム開始");

  const restart = () => {
    setStatusMessage("再スタート！");
    setLock(false);
    setGrid(initializeBoard);
  };
  const [grid, setGrid] = useState<Cell[][]>(initializeBoard());
  const isGameOver = (x: number, y: number) => {
    if (mode === Mode.Normal) {
      return grid[x][y].hasMine;
    } else {
      return !grid[x][y].hasMine;
    }
  };
  const isFinish = (board: Cell[][]) => {
    let all = true;
    for (let i = 0; i < grid.length; i++) {
      for (let k = 0; k < grid[i].length; k++) {
        all = all && !grid[i][k].hasMine && grid[i][k].isRevealed;
      }
    }
    return all;
  };

  const revealCell = (x: number, y: number) => {
    if (lock) return;
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
    if (isGameOver(x, y)) {
      setLock(true);
      setStatusMessage("おわおわり");
      newGrid[x][y].causeOfDeath = true;
    } else if (isFinish(newGrid)) {
      setLock(true);
      setStatusMessage("ゲームクリア！");
    }
    setGrid(newGrid);
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>{statusMessage}</div>
      <div className={styles.modeSwitch}>
        {lock && (
          <p>
            <button onClick={() => restart()} className={styles.clearButton}>
              再スタート
            </button>
          </p>
        )}
        <div className={styles.radioWrapper}>
          <input
            id="normalMode"
            type="radio"
            name="mode"
            className={styles.radioInput}
            checked={mode === Mode.Normal}
            onChange={() => setMode(Mode.Normal)}
          />
          <label htmlFor="normalMode" className={styles.radioLabel}>
            Normal
          </label>
          <div className={styles.description}>
            通常のマインスイーパーのパネルクリック挙動。爆弾をクリックしたらゲームオーバー
          </div>
        </div>
        <div className={styles.radioWrapper}>
          <input
            id="removeMode"
            type="radio"
            name="mode"
            className={styles.radioInput}
            checked={mode === Mode.Remove}
            onChange={() => setMode(Mode.Remove)}
          />
          <label htmlFor="removeMode" className={styles.radioLabel}>
            Remove
          </label>
          <div className={styles.description}>
            爆弾をクリックしなければゲームオーバー
          </div>
        </div>
      </div>
      <div>
        {grid.map((row, x) => (
          <div key={x}>
            {row.map((cell, y) => (
              <button
                key={y}
                className={`${styles.cell} ${
                  cell.isRevealed ? styles.revealed : styles.hidden
                } ${cell.causeOfDeath ? styles.causeOfDeath : ""}`}
                onClick={() => revealCell(x, y)}
              >
                {cell.isRevealed &&
                  (cell.hasMine ? "💣" : cell.numOfMineAround)}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MineSweeper;
