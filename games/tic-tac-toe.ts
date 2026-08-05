import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "./_shared";

const W = 480;
const H = 560;
const HUD = 80;
const BOARD = W; // 480 board area, cells 160
const CELL = BOARD / 3;

type Mark = "" | "X" | "O";

const WIN_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

class TicTacToeScene extends Phaser.Scene {
  private board: Mark[] = [];
  private gfx!: Phaser.GameObjects.Graphics;
  private marks: Phaser.GameObjects.Text[] = [];
  private statusText!: Phaser.GameObjects.Text;
  private overText?: Phaser.GameObjects.Text;
  private busy = false; // true while AI "thinks" or game over
  private over = false;

  constructor() {
    super("tictactoe");
  }

  create() {
    this.gfx = this.add.graphics();
    this.statusText = hudText(this, W / 2, 40, "Your turn (X)", 26, "#00d4ff");
    this.statusText.setOrigin(0.5);
    this.reset();

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.over) {
        this.reset();
        return;
      }
      if (this.busy) return;
      const y = p.y - HUD;
      if (y < 0) return;
      const c = Math.floor(p.x / CELL);
      const r = Math.floor(y / CELL);
      if (r < 0 || r > 2 || c < 0 || c > 2) return;
      const idx = r * 3 + c;
      if (this.board[idx] !== "") return;
      this.playPlayer(idx);
    });
  }

  reset() {
    this.board = Array(9).fill("");
    this.over = false;
    this.busy = false;
    this.overText?.destroy();
    this.overText = undefined;
    this.statusText.setText("Your turn (X)").setColor("#00d4ff");
    this.render();
  }

  private playPlayer(idx: number) {
    this.board[idx] = "X";
    this.render();
    if (this.checkEnd()) return;
    this.busy = true;
    this.statusText.setText("AI thinking...").setColor("#ffd15c");
    this.time.delayedCall(350, () => {
      this.playAI();
      this.render();
      if (!this.checkEnd()) {
        this.busy = false;
        this.statusText.setText("Your turn (X)").setColor("#00d4ff");
      }
    });
  }

  private emptyCells(): number[] {
    const out: number[] = [];
    for (let i = 0; i < 9; i++) if (this.board[i] === "") out.push(i);
    return out;
  }

  /** Returns index that completes a line for mark, or -1. */
  private findWinningMove(mark: Mark): number {
    for (const line of WIN_LINES) {
      const vals = line.map((i) => this.board[i]);
      const marks = vals.filter((v) => v === mark).length;
      const empties = vals.filter((v) => v === "").length;
      if (marks === 2 && empties === 1) {
        return line[vals.indexOf("")];
      }
    }
    return -1;
  }

  private playAI() {
    let move = this.findWinningMove("O"); // win
    if (move === -1) move = this.findWinningMove("X"); // block
    if (move === -1 && this.board[4] === "") move = 4; // center
    if (move === -1) {
      const empty = this.emptyCells();
      if (empty.length) move = Phaser.Utils.Array.GetRandom(empty);
    }
    if (move !== -1 && move !== undefined) this.board[move] = "O";
  }

  private winner(): Mark {
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (this.board[a] !== "" && this.board[a] === this.board[b] && this.board[b] === this.board[c]) {
        return this.board[a];
      }
    }
    return "";
  }

  /** Returns true if game ended (win or draw). */
  private checkEnd(): boolean {
    const w = this.winner();
    if (w !== "") {
      this.gameOver(w === "X" ? "You win!" : "AI wins!");
      return true;
    }
    if (this.emptyCells().length === 0) {
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
      .text(W / 2, HUD + BOARD / 2, `${msg}\nTap to restart`, {
        fontFamily: "system-ui",
        fontStyle: "bold",
        fontSize: "40px",
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
    // board background
    g.fillStyle(0x171722, 1).fillRect(0, HUD, BOARD, BOARD);
    // grid lines
    g.lineStyle(6, 0x3a3a55, 1);
    for (let i = 1; i < 3; i++) {
      g.beginPath();
      g.moveTo(i * CELL, HUD);
      g.lineTo(i * CELL, HUD + BOARD);
      g.strokePath();
      g.beginPath();
      g.moveTo(0, HUD + i * CELL);
      g.lineTo(BOARD, HUD + i * CELL);
      g.strokePath();
    }

    this.marks.forEach((m) => m.destroy());
    this.marks = [];
    for (let i = 0; i < 9; i++) {
      const v = this.board[i];
      if (v === "") continue;
      const r = Math.floor(i / 3);
      const c = i % 3;
      const x = c * CELL + CELL / 2;
      const y = HUD + r * CELL + CELL / 2;
      this.marks.push(
        this.add
          .text(x, y, v, {
            fontFamily: "system-ui",
            fontStyle: "bold",
            fontSize: "96px",
            color: v === "X" ? "#00d4ff" : "#ff5c6e",
          })
          .setOrigin(0.5)
          .setDepth(500)
      );
    }
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, TicTacToeScene));
