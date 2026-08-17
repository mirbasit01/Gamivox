import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 480, HUD = 60;
const COLS = 8, ROWS = 8, CELL = Math.floor((W - 40) / COLS), OX = 20, OY = HUD + 10;
const COLORS = [0xff3b4e, 0x00d4ff, 0xffd15c, 0x00ffa3, 0xc94bff, 0xff8a5c];

class ColorFloodScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private board: number[][] = [];
  private moves = 0;
  private maxMoves = 25;
  private movesText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private solved = false;

  constructor() { super("colorflood"); }

  create() {
    this.gfx = this.add.graphics();
    hudText(this, W / 2, 16, "Color Flood", 22, "#c94bff").setOrigin(0.5, 0);
    this.movesText = hudText(this, W - 16, 16, `Moves 0/${this.maxMoves}`, 18, "#ffd15c").setOrigin(1, 0);
    this.statusText = hudText(this, W / 2, H - 30, "Tap a color to flood from top-left", 14, "#888899").setOrigin(0.5);
    // color buttons
    for (let i = 0; i < COLORS.length; i++) {
      const bx = OX + i * (CELL + 4) + CELL / 2;
      const by = OY + ROWS * CELL + 20;
      this.add.graphics().fillStyle(COLORS[i]).fillCircle(bx, by, 18).setDepth(100).setInteractive(new Phaser.Geom.Circle(bx, by, 18), Phaser.Geom.Circle.Contains).on("pointerdown", () => this.flood(i));
    }
    this.input.on("pointerdown", () => { if (this.solved) this.reset(); });
    this.reset();
  }

  reset() {
    this.board = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => Phaser.Math.Between(0, COLORS.length - 1)));
    this.moves = 0; this.solved = false;
    this.movesText.setText(`Moves 0/${this.maxMoves}`);
    this.statusText?.setText("Tap a color to flood from top-left");
  }

  flood(color: number) {
    if (this.solved) return;
    const current = this.board[0][0];
    if (color === current) return;
    this.fill(0, 0, current, color);
    this.moves++;
    this.movesText.setText(`Moves ${this.moves}/${this.maxMoves}`);
    if (this.board.every(r => r.every(v => v === color))) {
      this.solved = true;
      this.statusText.setText(`🎉 Flooded in ${this.moves} moves! Tap to restart`);
    } else if (this.moves >= this.maxMoves) {
      this.solved = true;
      this.statusText.setText(`Out of moves! Tap to restart`);
    }
  }

  fill(r: number, c: number, from: number, to: number) {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || this.board[r][c] !== from) return;
    this.board[r][c] = to;
    this.fill(r - 1, c, from, to); this.fill(r + 1, c, from, to);
    this.fill(r, c - 1, from, to); this.fill(r, c + 1, from, to);
  }

  update() { this.draw(); }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const x = OX + c * CELL, y = OY + r * CELL;
      g.fillStyle(COLORS[this.board[r][c]]).fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
    }
    // highlight top-left region
    g.lineStyle(2, 0xffffff, 0.3).strokeRect(OX, OY, CELL, CELL);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, ColorFloodScene));
