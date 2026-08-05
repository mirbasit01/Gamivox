import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const N = 4;
const HUD = 60;
const PAD = 12;
const W = 460;
const H = W + HUD;
const CELL = (W - PAD * (N + 1)) / N;

const TILE_COLORS: Record<number, number> = {
  2: 0x2b2b40, 4: 0x3a3a5a, 8: 0xff9f5c, 16: 0xff7a5c, 32: 0xff5c6e,
  64: 0xff5c9d, 128: 0x7c5cff, 256: 0x5c8bff, 512: 0x00d4ff,
  1024: 0x00ffa3, 2048: 0xffd15c,
};

class Game2048 extends Phaser.Scene {
  private grid: number[][] = [];
  private gfx!: Phaser.GameObjects.Graphics;
  private labels: Phaser.GameObjects.Text[] = [];
  private score = 0;
  private best = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;

  constructor() {
    super("g2048");
  }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 18, "Score 0", 24, "#ff9f5c");
    hudText(this, W - 90, 22, "2048", 22, "#3a3a55");
    this.reset();

    this.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (this.over) { if (k === "r" || k === " ") this.reset(); return; }
      let moved = false;
      if (k === "arrowleft" || k === "a") moved = this.move("L");
      else if (k === "arrowright" || k === "d") moved = this.move("R");
      else if (k === "arrowup" || k === "w") moved = this.move("U");
      else if (k === "arrowdown" || k === "s") moved = this.move("D");
      if (moved) {
        this.addTile();
        this.render();
        if (!this.canMove()) this.gameOver();
      }
    });

    // Touch / swipe controls for mobile
    this.input.on("pointerup", (p: Phaser.Input.Pointer) => {
      if (this.over) {
        this.reset();
        return;
      }
      const dx = p.x - p.downX;
      const dy = p.y - p.downY;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      let moved = false;
      if (Math.abs(dx) > Math.abs(dy)) moved = this.move(dx > 0 ? "R" : "L");
      else moved = this.move(dy > 0 ? "D" : "U");
      if (moved) {
        this.addTile();
        this.render();
        if (!this.canMove()) this.gameOver();
      }
    });
  }

  reset() {
    this.grid = Array.from({ length: N }, () => Array(N).fill(0));
    this.score = 0;
    this.over = false;
    this.overText?.destroy();
    this.overText = undefined;
    this.addTile();
    this.addTile();
    this.render();
  }

  addTile() {
    const empty: [number, number][] = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (this.grid[r][c] === 0) empty.push([r, c]);
    if (!empty.length) return;
    const [r, c] = Phaser.Utils.Array.GetRandom(empty);
    this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  private slide(row: number[]): number[] {
    let arr = row.filter((v) => v);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.score += arr[i];
        arr.splice(i + 1, 1);
      }
    }
    while (arr.length < N) arr.push(0);
    return arr;
  }

  move(dir: "L" | "R" | "U" | "D"): boolean {
    const before = JSON.stringify(this.grid);
    const g = this.grid;
    const getRow = (i: number): number[] => {
      if (dir === "L") return g[i].slice();
      if (dir === "R") return g[i].slice().reverse();
      if (dir === "U") return [g[0][i], g[1][i], g[2][i], g[3][i]];
      return [g[3][i], g[2][i], g[1][i], g[0][i]];
    };
    const setRow = (i: number, row: number[]) => {
      if (dir === "R") row = row.slice().reverse();
      if (dir === "D") row = row.slice().reverse();
      if (dir === "L" || dir === "R") g[i] = row;
      else for (let r = 0; r < N; r++) g[r][i] = row[r];
    };
    for (let i = 0; i < N; i++) setRow(i, this.slide(getRow(i)));
    this.best = Math.max(this.best, this.score);
    return JSON.stringify(this.grid) !== before;
  }

  canMove(): boolean {
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++) {
        if (this.grid[r][c] === 0) return true;
        if (c < N - 1 && this.grid[r][c] === this.grid[r][c + 1]) return true;
        if (r < N - 1 && this.grid[r][c] === this.grid[r + 1][c]) return true;
      }
    return false;
  }

  render() {
    this.scoreText.setText("Score " + this.score);
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x171722, 1).fillRoundedRect(0, HUD, W, W, 14);
    this.labels.forEach((l) => l.destroy());
    this.labels = [];
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const x = PAD + c * (CELL + PAD);
        const y = HUD + PAD + r * (CELL + PAD);
        const v = this.grid[r][c];
        g.fillStyle(v ? TILE_COLORS[v] ?? 0xffd15c : 0x22222f, 1);
        g.fillRoundedRect(x, y, CELL, CELL, 10);
        if (v) {
          this.labels.push(
            this.add
              .text(x + CELL / 2, y + CELL / 2, "" + v, {
                fontFamily: "system-ui",
                fontStyle: "bold",
                fontSize: `${v < 100 ? 40 : v < 1000 ? 32 : 26}px`,
                color: v <= 4 ? "#9a9ab0" : "#ffffff",
              })
              .setOrigin(0.5)
              .setDepth(500)
          );
        }
      }
    }
  }

  gameOver() {
    this.over = true;
    this.overText = this.add
      .text(W / 2, HUD + W / 2, `GAME OVER\nScore ${this.score}\nPress R`, {
        fontFamily: "system-ui",
        fontStyle: "bold",
        fontSize: "34px",
        color: "#ffffff",
        align: "center",
        backgroundColor: "#000000aa",
        padding: { x: 20, y: 16 },
      })
      .setOrigin(0.5)
      .setDepth(2000);
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, Game2048));
