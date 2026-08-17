import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 520, HUD = 60;
const COLS = 8, ROWS = 8, CELL = Math.floor((W - 40) / COLS);
const OX = 20, OY = HUD + 10;
const COLORS = [0xff3b4e, 0x00d4ff, 0xffd15c, 0x00ffa3, 0xc94bff, 0xff8a5c];

class GemSwapScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private board: number[][] = [];
  private selected = { r: -1, c: -1 };
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private animating = false;

  constructor() { super("gemswap"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Score 0", 22, "#ffd15c");
    this.statusText = hudText(this, W / 2, H - 30, "Tap two adjacent gems to swap", 15, "#888899").setOrigin(0.5);
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => this.onTap(p));
    this.reset();
  }

  reset() {
    this.score = 0; this.selected = { r: -1, c: -1 }; this.animating = false;
    this.scoreText.setText("Score 0");
    do { this.board = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => Phaser.Math.Between(0, COLORS.length - 1))); }
    while (this.findMatches().length === 0);
    this.clearMatches();
  }

  findMatches(): [number, number][] {
    const matches = new Set<string>();
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS - 2; c++) {
      if (this.board[r][c] === this.board[r][c+1] && this.board[r][c] === this.board[r][c+2]) { matches.add(`${r},${c}`); matches.add(`${r},${c+1}`); matches.add(`${r},${c+2}`); }
    }
    for (let r = 0; r < ROWS - 2; r++) for (let c = 0; c < COLS; c++) {
      if (this.board[r][c] === this.board[r+1][c] && this.board[r][c] === this.board[r+2][c]) { matches.add(`${r},${c}`); matches.add(`${r+1},${c}`); matches.add(`${r+2},${c}`); }
    }
    return [...matches].map(k => k.split(",").map(Number) as [number, number]);
  }

  clearMatches() {
    let matches = this.findMatches();
    while (matches.length > 0) {
      this.score += matches.length * 10;
      this.scoreText.setText("Score " + this.score);
      matches.forEach(([r, c]) => { this.board[r][c] = -1; });
      // drop
      for (let c = 0; c < COLS; c++) {
        const col = this.board.map(r => r[c]).filter(v => v !== -1);
        while (col.length < ROWS) col.unshift(Phaser.Math.Between(0, COLORS.length - 1));
        for (let r = 0; r < ROWS; r++) this.board[r][c] = col[r];
      }
      matches = this.findMatches();
    }
  }

  onTap(p: Phaser.Input.Pointer) {
    if (this.animating) return;
    const c = Math.floor((p.x - OX) / CELL), r = Math.floor((p.y - OY) / CELL);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
    if (this.selected.r < 0) { this.selected = { r, c }; return; }
    const dr = Math.abs(r - this.selected.r), dc = Math.abs(c - this.selected.c);
    if (dr + dc === 1) {
      const tmp = this.board[r][c]; this.board[r][c] = this.board[this.selected.r][this.selected.c]; this.board[this.selected.r][this.selected.c] = tmp;
      if (this.findMatches().length === 0) { const tmp2 = this.board[r][c]; this.board[r][c] = this.board[this.selected.r][this.selected.c]; this.board[this.selected.r][this.selected.c] = tmp2; }
      else { this.clearMatches(); }
    }
    this.selected = { r: -1, c: -1 };
  }

  update() { this.draw(); }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const x = OX + c * CELL, y = OY + r * CELL;
      const v = this.board[r][c];
      const sel = this.selected.r === r && this.selected.c === c;
      g.fillStyle(0x111122).fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      if (v >= 0) {
        const color = COLORS[v];
        g.fillStyle(color, 0.25).fillCircle(x + CELL / 2, y + CELL / 2, CELL / 2 - 2);
        g.fillStyle(color).fillCircle(x + CELL / 2, y + CELL / 2, CELL / 2 - 6);
        g.fillStyle(0xffffff, 0.5).fillCircle(x + CELL / 2 - 4, y + CELL / 2 - 4, 4);
      }
      if (sel) g.lineStyle(2, 0xffffff, 0.8).strokeRect(x + 2, y + 2, CELL - 4, CELL - 4);
    }
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, GemSwapScene));
