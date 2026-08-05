import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "./_shared";

const W = 400;
const H = 640;
const HUD = 50;
const COLS = 10;
const ROWS = 16;
// Fit square cells inside the area below the HUD.
const CELL = (H - HUD) / ROWS; // 36.875
const BOARD_W = COLS * CELL;
const BOARD_H = ROWS * CELL;
const OFFX = (W - BOARD_W) / 2;

// Each tetromino defined as list of rotation states, each a list of [x,y] offsets.
interface Piece {
  color: number;
  rotations: number[][][]; // rotations[r] = array of [x,y]
}

const PIECES: Piece[] = [
  // I
  {
    color: 0x00d4ff,
    rotations: [
      [[0, 1], [1, 1], [2, 1], [3, 1]],
      [[2, 0], [2, 1], [2, 2], [2, 3]],
      [[0, 2], [1, 2], [2, 2], [3, 2]],
      [[1, 0], [1, 1], [1, 2], [1, 3]],
    ],
  },
  // O
  {
    color: 0xffd15c,
    rotations: [
      [[1, 0], [2, 0], [1, 1], [2, 1]],
      [[1, 0], [2, 0], [1, 1], [2, 1]],
      [[1, 0], [2, 0], [1, 1], [2, 1]],
      [[1, 0], [2, 0], [1, 1], [2, 1]],
    ],
  },
  // T
  {
    color: 0x7c5cff,
    rotations: [
      [[1, 0], [0, 1], [1, 1], [2, 1]],
      [[1, 0], [1, 1], [2, 1], [1, 2]],
      [[0, 1], [1, 1], [2, 1], [1, 2]],
      [[1, 0], [0, 1], [1, 1], [1, 2]],
    ],
  },
  // S
  {
    color: 0x00ffa3,
    rotations: [
      [[1, 0], [2, 0], [0, 1], [1, 1]],
      [[1, 0], [1, 1], [2, 1], [2, 2]],
      [[1, 1], [2, 1], [0, 2], [1, 2]],
      [[0, 0], [0, 1], [1, 1], [1, 2]],
    ],
  },
  // Z
  {
    color: 0xff5c6e,
    rotations: [
      [[0, 0], [1, 0], [1, 1], [2, 1]],
      [[2, 0], [1, 1], [2, 1], [1, 2]],
      [[0, 1], [1, 1], [1, 2], [2, 2]],
      [[1, 0], [0, 1], [1, 1], [0, 2]],
    ],
  },
  // J
  {
    color: 0x5c8bff,
    rotations: [
      [[0, 0], [0, 1], [1, 1], [2, 1]],
      [[1, 0], [2, 0], [1, 1], [1, 2]],
      [[0, 1], [1, 1], [2, 1], [2, 2]],
      [[1, 0], [1, 1], [0, 2], [1, 2]],
    ],
  },
  // L
  {
    color: 0xff9f5c,
    rotations: [
      [[2, 0], [0, 1], [1, 1], [2, 1]],
      [[1, 0], [1, 1], [1, 2], [2, 2]],
      [[0, 1], [1, 1], [2, 1], [0, 2]],
      [[0, 0], [1, 0], [1, 1], [1, 2]],
    ],
  },
];

class BlockDropScene extends Phaser.Scene {
  private grid: number[][] = []; // 0 empty else color
  private gfx!: Phaser.GameObjects.Graphics;
  private scoreText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private overText?: Phaser.GameObjects.Text;

  private pieceIndex = 0;
  private rotation = 0;
  private px = 0;
  private py = 0;

  private score = 0;
  private over = false;
  private dropTimer = 0;
  private dropInterval = 600;

  constructor() {
    super("blockdrop");
  }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 12, 14, "Score 0", 24, "#ff9f5c");
    this.statusText = hudText(this, W - 130, 16, "", 18, "#8bd5ff");

    this.reset();

    this.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (this.over) {
        if (k === "r" || k === " ") this.reset();
        return;
      }
      if (k === "arrowleft" || k === "a") this.tryMove(-1, 0);
      else if (k === "arrowright" || k === "d") this.tryMove(1, 0);
      else if (k === "arrowup" || k === "w") this.tryRotate();
      else if (k === "arrowdown" || k === "s") this.softDrop();
    });

    // Touch controls
    this.input.on("pointerup", (p: Phaser.Input.Pointer) => {
      if (this.over) {
        this.reset();
        return;
      }
      const dx = p.x - p.downX;
      const dy = p.y - p.downY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (absX < 24 && absY < 24) {
        // tap: left/right half moves
        if (p.x < W / 2) this.tryMove(-1, 0);
        else this.tryMove(1, 0);
        return;
      }
      if (absY > absX) {
        if (dy < 0) this.tryRotate();
        else this.hardDrop();
      } else {
        this.tryMove(dx > 0 ? 1 : -1, 0);
      }
    });
  }

  private reset() {
    this.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    this.score = 0;
    this.over = false;
    this.dropTimer = 0;
    this.overText?.destroy();
    this.overText = undefined;
    this.scoreText.setText("Score 0");
    this.statusText.setText("");
    this.spawn();
    this.render();
  }

  private spawn() {
    this.pieceIndex = Phaser.Math.Between(0, PIECES.length - 1);
    this.rotation = 0;
    this.px = 3;
    this.py = 0;
    if (this.collides(this.px, this.py, this.rotation)) {
      this.gameOver();
    }
  }

  private cells(x: number, y: number, rot: number): number[][] {
    return PIECES[this.pieceIndex].rotations[rot].map(([ox, oy]) => [x + ox, y + oy]);
  }

  private collides(x: number, y: number, rot: number): boolean {
    return this.cells(x, y, rot).some(([cx, cy]) => {
      if (cx < 0 || cx >= COLS || cy >= ROWS) return true;
      if (cy < 0) return false;
      return this.grid[cy][cx] !== 0;
    });
  }

  private tryMove(dx: number, dy: number): boolean {
    if (this.over) return false;
    if (!this.collides(this.px + dx, this.py + dy, this.rotation)) {
      this.px += dx;
      this.py += dy;
      this.render();
      return true;
    }
    return false;
  }

  private tryRotate() {
    if (this.over) return;
    const next = (this.rotation + 1) % 4;
    // basic wall kick attempts
    for (const kick of [0, -1, 1, -2, 2]) {
      if (!this.collides(this.px + kick, this.py, next)) {
        this.rotation = next;
        this.px += kick;
        this.render();
        return;
      }
    }
  }

  private softDrop() {
    if (!this.tryMove(0, 1)) this.lock();
    this.dropTimer = 0;
  }

  private hardDrop() {
    while (this.tryMove(0, 1)) {
      /* keep dropping */
    }
    this.lock();
    this.dropTimer = 0;
  }

  private lock() {
    const color = PIECES[this.pieceIndex].color;
    this.cells(this.px, this.py, this.rotation).forEach(([cx, cy]) => {
      if (cy >= 0 && cy < ROWS && cx >= 0 && cx < COLS) this.grid[cy][cx] = color;
    });
    this.clearLines();
    if (!this.over) {
      this.spawn();
      this.render();
    }
  }

  private clearLines() {
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (this.grid[r].every((v) => v !== 0)) {
        this.grid.splice(r, 1);
        this.grid.unshift(Array(COLS).fill(0));
        cleared++;
        r++; // recheck same row index after shift
      }
    }
    if (cleared > 0) {
      this.score += cleared * 100;
      this.scoreText.setText("Score " + this.score);
    }
  }

  private gameOver() {
    this.over = true;
    this.statusText.setText("Over");
    this.overText = this.add
      .text(W / 2, HUD + BOARD_H / 2, `Game Over\nScore ${this.score}\nTap / R to restart`, {
        fontFamily: "system-ui",
        fontStyle: "bold",
        fontSize: "30px",
        color: "#ffffff",
        align: "center",
        backgroundColor: "#000000cc",
        padding: { x: 20, y: 16 },
      })
      .setOrigin(0.5)
      .setDepth(2000);
  }

  update(_t: number, dt: number) {
    if (this.over) return;
    this.dropTimer += dt;
    if (this.dropTimer >= this.dropInterval) {
      this.dropTimer = 0;
      if (!this.tryMove(0, 1)) this.lock();
    }
  }

  private drawCell(g: Phaser.GameObjects.Graphics, cx: number, cy: number, color: number) {
    const x = OFFX + cx * CELL;
    const y = HUD + cy * CELL;
    g.fillStyle(color, 1).fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
  }

  private render() {
    const g = this.gfx;
    g.clear();
    // board background
    g.fillStyle(0x12121c, 1).fillRect(OFFX, HUD, BOARD_W, BOARD_H);
    // grid lines
    g.lineStyle(1, 0x1e1e2e, 1);
    for (let c = 0; c <= COLS; c++)
      g.lineBetween(OFFX + c * CELL, HUD, OFFX + c * CELL, HUD + BOARD_H);
    for (let r = 0; r <= ROWS; r++)
      g.lineBetween(OFFX, HUD + r * CELL, OFFX + BOARD_W, HUD + r * CELL);

    // settled blocks
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) if (this.grid[r][c]) this.drawCell(g, c, r, this.grid[r][c]);

    // active piece
    if (!this.over) {
      const color = PIECES[this.pieceIndex].color;
      this.cells(this.px, this.py, this.rotation).forEach(([cx, cy]) => {
        if (cy >= 0) this.drawCell(g, cx, cy, color);
      });
    }
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, BlockDropScene));
