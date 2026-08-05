import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "./_shared";

const COLS = 7;
const ROWS = 6;
const HUD = 70;
const W = 480;
const H = 560;
const CELL = W / COLS; // ~68.57
const R = CELL * 0.38; // disc radius
const BOARD_H = H - HUD; // 490 -> board fits ROWS*CELL = 411, centered

// 0 empty, 1 player (red), 2 AI (yellow)
type Cell = 0 | 1 | 2;

class ConnectFourScene extends Phaser.Scene {
  private board: Cell[][] = []; // board[row][col], row 0 = top
  private gfx!: Phaser.GameObjects.Graphics;
  private statusText!: Phaser.GameObjects.Text;
  private overText?: Phaser.GameObjects.Text;
  private over = false;
  private busy = false;
  private boardY = HUD; // top of board area

  constructor() {
    super("connect4");
  }

  create() {
    this.gfx = this.add.graphics();
    this.statusText = hudText(this, W / 2, 35, "Your turn (Red)", 24, "#ff5c6e");
    this.statusText.setOrigin(0.5);
    this.reset();

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.over) {
        this.reset();
        return;
      }
      if (this.busy) return;
      const col = Math.floor(p.x / CELL);
      if (col < 0 || col >= COLS) return;
      this.playPlayer(col);
    });
  }

  reset() {
    this.board = Array.from({ length: ROWS }, () => Array<Cell>(COLS).fill(0));
    this.over = false;
    this.busy = false;
    this.overText?.destroy();
    this.overText = undefined;
    this.statusText.setText("Your turn (Red)").setColor("#ff5c6e");
    this.render();
  }

  /** Lowest empty row in column, or -1 if full. */
  private dropRow(col: number, board: Cell[][]): number {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === 0) return r;
    }
    return -1;
  }

  private validCols(board: Cell[][]): number[] {
    const out: number[] = [];
    for (let c = 0; c < COLS; c++) if (this.dropRow(c, board) !== -1) out.push(c);
    return out;
  }

  private playPlayer(col: number) {
    const r = this.dropRow(col, this.board);
    if (r === -1) return;
    this.board[r][col] = 1;
    this.render();
    if (this.checkEnd(1)) return;

    this.busy = true;
    this.statusText.setText("AI thinking...").setColor("#ffd15c");
    this.time.delayedCall(350, () => {
      this.playAI();
      this.render();
      if (!this.checkEnd(2)) {
        this.busy = false;
        this.statusText.setText("Your turn (Red)").setColor("#ff5c6e");
      }
    });
  }

  /** Would placing `mark` in col create a 4-in-a-row? Returns the winning col or -1. */
  private findWinningCol(mark: Cell): number {
    for (const c of this.validCols(this.board)) {
      const r = this.dropRow(c, this.board);
      this.board[r][c] = mark;
      const win = this.isWinAt(r, c, mark);
      this.board[r][c] = 0;
      if (win) return c;
    }
    return -1;
  }

  private playAI() {
    let col = this.findWinningCol(2); // win
    if (col === -1) col = this.findWinningCol(1); // block player
    if (col === -1) {
      const valid = this.validCols(this.board);
      if (valid.length) col = Phaser.Utils.Array.GetRandom(valid);
    }
    if (col === -1) return;
    const r = this.dropRow(col, this.board);
    if (r !== -1) this.board[r][col] = 2;
  }

  /** Check 4-in-a-row through cell (r,c) for mark. */
  private isWinAt(r: number, c: number, mark: Cell): boolean {
    const dirs = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diag down-right
      [1, -1], // diag down-left
    ];
    for (const [dr, dc] of dirs) {
      let count = 1;
      // forward
      let rr = r + dr;
      let cc = c + dc;
      while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && this.board[rr][cc] === mark) {
        count++;
        rr += dr;
        cc += dc;
      }
      // backward
      rr = r - dr;
      cc = c - dc;
      while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && this.board[rr][cc] === mark) {
        count++;
        rr -= dr;
        cc -= dc;
      }
      if (count >= 4) return true;
    }
    return false;
  }

  private anyWin(mark: Cell): boolean {
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (this.board[r][c] === mark && this.isWinAt(r, c, mark)) return true;
    return false;
  }

  private checkEnd(lastMark: Cell): boolean {
    if (this.anyWin(lastMark)) {
      this.gameOver(lastMark === 1 ? "You win!" : "AI wins!");
      return true;
    }
    if (this.validCols(this.board).length === 0) {
      this.gameOver("Draw");
      return true;
    }
    return false;
  }

  private gameOver(msg: string) {
    this.over = true;
    this.busy = true;
    this.statusText.setText(msg).setColor("#ffffff");
    this.overText = this.add
      .text(W / 2, HUD + (ROWS * CELL) / 2, `${msg}\nTap to restart`, {
        fontFamily: "system-ui",
        fontStyle: "bold",
        fontSize: "38px",
        color: "#ffffff",
        align: "center",
        backgroundColor: "#000000cc",
        padding: { x: 24, y: 18 },
      })
      .setOrigin(0.5)
      .setDepth(2000);
  }

  private render() {
    const g = this.gfx;
    g.clear();
    const boardW = COLS * CELL;
    const boardHeight = ROWS * CELL;
    // blue board
    g.fillStyle(0x1f4bd8, 1).fillRoundedRect(0, this.boardY, boardW, boardHeight, 16);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cx = c * CELL + CELL / 2;
        const cy = this.boardY + r * CELL + CELL / 2;
        const v = this.board[r][c];
        let color = 0x0b0b14; // empty hole
        if (v === 1) color = 0xff3b4e; // red
        else if (v === 2) color = 0xffd15c; // yellow
        g.fillStyle(color, 1).fillCircle(cx, cy, R);
      }
    }
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, ConnectFourScene));
