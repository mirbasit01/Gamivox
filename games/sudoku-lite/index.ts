import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 560, HUD = 60;
const GRID = 9, CELL = Math.floor((W - 40) / GRID);

// Simple sudoku puzzle (0 = empty)
const PUZZLE = [
  [5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],
  [8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],
  [0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9],
];
const SOLUTION = [
  [5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9],
];

class SudokuScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private board: number[][] = [];
  private fixed: boolean[][] = [];
  private selected = { r: -1, c: -1 };
  private statusText!: Phaser.GameObjects.Text;
  private cellTexts: Phaser.GameObjects.Text[][] = [];
  private won = false;
  private ox = 20;
  private oy = HUD + 10;

  constructor() { super("sudoku"); }

  create() {
    this.gfx = this.add.graphics();
    hudText(this, W / 2, 16, "Sudoku Lite", 22, "#00d4ff").setOrigin(0.5, 0);
    this.statusText = hudText(this, W / 2, H - 30, "Tap a cell, then tap a number", 16, "#888899").setOrigin(0.5);
    this.cellTexts = Array.from({ length: GRID }, () => Array(GRID).fill(null));
    this.reset();
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => this.onTap(p));
    // number buttons
    for (let n = 1; n <= 9; n++) {
      const bx = this.ox + (n - 1) * CELL + CELL / 2;
      const by = this.oy + GRID * CELL + 20;
      this.add.text(bx, by, "" + n, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "20px", color: "#00ffa3" }).setOrigin(0.5).setDepth(100).setInteractive().on("pointerdown", () => this.inputNumber(n));
    }
    this.add.text(this.ox + GRID * CELL / 2, this.oy + GRID * CELL + 44, "0 = clear", { fontFamily: "system-ui", fontSize: "13px", color: "#555577" }).setOrigin(0.5).setDepth(100).setInteractive().on("pointerdown", () => this.inputNumber(0));
  }

  reset() {
    this.board = PUZZLE.map(r => [...r]);
    this.fixed = PUZZLE.map(r => r.map(v => v !== 0));
    this.selected = { r: -1, c: -1 };
    this.won = false;
    this.statusText?.setText("Tap a cell, then tap a number");
    this.renderCells();
  }

  renderCells() {
    for (let r = 0; r < GRID; r++) for (let c = 0; c < GRID; c++) {
      if (this.cellTexts[r][c]) this.cellTexts[r][c].destroy();
      const v = this.board[r][c];
      const x = this.ox + c * CELL + CELL / 2, y = this.oy + r * CELL + CELL / 2;
      const color = this.fixed[r][c] ? "#ffffff" : (v !== 0 && v !== SOLUTION[r][c] ? "#ff3b4e" : "#00ffa3");
      this.cellTexts[r][c] = this.add.text(x, y, v ? "" + v : "", { fontFamily: "system-ui", fontStyle: "bold", fontSize: "18px", color }).setOrigin(0.5).setDepth(100);
    }
  }

  onTap(p: Phaser.Input.Pointer) {
    const c = Math.floor((p.x - this.ox) / CELL), r = Math.floor((p.y - this.oy) / CELL);
    if (r >= 0 && r < GRID && c >= 0 && c < GRID) { this.selected = { r, c }; this.draw(); }
  }

  inputNumber(n: number) {
    const { r, c } = this.selected;
    if (r < 0 || this.fixed[r][c] || this.won) return;
    this.board[r][c] = n;
    this.renderCells();
    this.draw();
    if (this.checkWin()) { this.won = true; this.statusText.setText("🎉 Solved! Tap to restart"); }
  }

  checkWin() {
    for (let r = 0; r < GRID; r++) for (let c = 0; c < GRID; c++) if (this.board[r][c] !== SOLUTION[r][c]) return false;
    return true;
  }

  update() { this.draw(); }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    for (let r = 0; r < GRID; r++) for (let c = 0; c < GRID; c++) {
      const x = this.ox + c * CELL, y = this.oy + r * CELL;
      const sel = this.selected.r === r && this.selected.c === c;
      const sameBox = this.selected.r >= 0 && Math.floor(r / 3) === Math.floor(this.selected.r / 3) && Math.floor(c / 3) === Math.floor(this.selected.c / 3);
      g.fillStyle(sel ? 0x00d4ff : sameBox ? 0x1a1a2e : 0x111122, sel ? 0.3 : 0.5).fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      g.lineStyle(c % 3 === 0 ? 2 : 0.5, c % 3 === 0 ? 0x00d4ff : 0x333355).strokeRect(x, y, CELL, CELL);
    }
    // box borders
    for (let i = 0; i <= 3; i++) {
      g.lineStyle(2, 0x00d4ff, 0.8);
      g.beginPath().moveTo(this.ox + i * CELL * 3, this.oy).lineTo(this.ox + i * CELL * 3, this.oy + GRID * CELL).strokePath();
      g.beginPath().moveTo(this.ox, this.oy + i * CELL * 3).lineTo(this.ox + GRID * CELL, this.oy + i * CELL * 3).strokePath();
    }
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, SudokuScene));
