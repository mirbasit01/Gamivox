import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 480, HUD = 60;
const COLS = 6, ROWS = 6, CELL = Math.floor((W - 40) / COLS);
const OX = 20, OY = HUD + 10;
// Pipe types: 0=empty, 1=straight-H, 2=straight-V, 3=corner-NE, 4=corner-SE, 5=corner-SW, 6=corner-NW
// connections: [N,E,S,W]
const CONN: Record<number, boolean[]> = {
  0: [false,false,false,false],
  1: [false,true,false,true],
  2: [true,false,true,false],
  3: [true,true,false,false],
  4: [false,true,true,false],
  5: [false,false,true,true],
  6: [true,false,false,true],
};
const COLORS = [0x00d4ff, 0x00ffa3, 0xffd15c, 0xff3b4e, 0xc94bff];

class PipeConnectScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private grid: number[][] = [];
  private rotation: number[][] = [];
  private solved = false;
  private statusText!: Phaser.GameObjects.Text;
  private source = { r: 0, c: 0 };
  private sink = { r: ROWS - 1, c: COLS - 1 };

  constructor() { super("pipeconnect"); }

  create() {
    this.gfx = this.add.graphics();
    hudText(this, W / 2, 16, "Pipe Connect", 22, "#00d4ff").setOrigin(0.5, 0);
    this.statusText = hudText(this, W / 2, H - 30, "Tap pipes to rotate them", 16, "#888899").setOrigin(0.5);
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.solved) { this.reset(); return; }
      const c = Math.floor((p.x - OX) / CELL), r = Math.floor((p.y - OY) / CELL);
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        this.rotation[r][c] = (this.rotation[r][c] + 1) % 4;
        if (this.checkSolved()) { this.solved = true; this.statusText.setText("🎉 Connected! Tap to play again"); }
      }
    });
    this.reset();
  }

  reset() {
    this.solved = false;
    this.statusText?.setText("Tap pipes to rotate them");
    // generate a simple random grid
    this.grid = Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => Phaser.Math.Between(1, 6)));
    this.rotation = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    // ensure source and sink have connections
    this.grid[this.source.r][this.source.c] = 4;
    this.grid[this.sink.r][this.sink.c] = 6;
  }

  getConn(r: number, c: number): boolean[] {
    const type = this.grid[r][c];
    const rot = this.rotation[r][c];
    const base = CONN[type];
    const result = [...base];
    for (let i = 0; i < rot; i++) { const tmp = result[0]; result[0] = result[3]; result[3] = result[2]; result[2] = result[1]; result[1] = tmp; }
    return result;
  }

  checkSolved(): boolean {
    const visited = new Set<string>();
    const stack = [[this.source.r, this.source.c]];
    while (stack.length) {
      const [r, c] = stack.pop()!;
      const key = `${r},${c}`;
      if (visited.has(key)) continue;
      visited.add(key);
      const conn = this.getConn(r, c);
      const dirs = [[-1,0,0,2],[0,1,1,3],[1,0,2,0],[0,-1,3,1]];
      for (const [dr, dc, myDir, theirDir] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        if (conn[myDir] && this.getConn(nr, nc)[theirDir]) stack.push([nr, nc]);
      }
    }
    return visited.has(`${this.sink.r},${this.sink.c}`);
  }

  update() { this.draw(); }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    const connected = new Set<string>();
    if (this.solved) {
      const stack = [[this.source.r, this.source.c]];
      const visited = new Set<string>();
      while (stack.length) {
        const [r, c] = stack.pop()!;
        const key = `${r},${c}`;
        if (visited.has(key)) continue;
        visited.add(key); connected.add(key);
        const conn = this.getConn(r, c);
        const dirs = [[-1,0,0,2],[0,1,1,3],[1,0,2,0],[0,-1,3,1]];
        for (const [dr, dc, myDir, theirDir] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
          if (conn[myDir] && this.getConn(nr, nc)[theirDir]) stack.push([nr, nc]);
        }
      }
    }
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const x = OX + c * CELL, y = OY + r * CELL;
      const isConn = connected.has(`${r},${c}`);
      const color = isConn ? 0x00ffa3 : 0x00d4ff;
      g.fillStyle(0x111122).fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      g.lineStyle(1, 0x222233).strokeRect(x, y, CELL, CELL);
      const cx = x + CELL / 2, cy = y + CELL / 2;
      const conn = this.getConn(r, c);
      const hw = 5;
      g.lineStyle(hw, color, 0.8);
      if (conn[0]) { g.beginPath().moveTo(cx, cy).lineTo(cx, y).strokePath(); }
      if (conn[1]) { g.beginPath().moveTo(cx, cy).lineTo(x + CELL, cy).strokePath(); }
      if (conn[2]) { g.beginPath().moveTo(cx, cy).lineTo(cx, y + CELL).strokePath(); }
      if (conn[3]) { g.beginPath().moveTo(cx, cy).lineTo(x, cy).strokePath(); }
      g.fillStyle(color).fillCircle(cx, cy, 5);
    }
    // source/sink markers
    const sx = OX + this.source.c * CELL + CELL / 2, sy = OY + this.source.r * CELL + CELL / 2;
    const ex = OX + this.sink.c * CELL + CELL / 2, ey = OY + this.sink.r * CELL + CELL / 2;
    g.fillStyle(0xffd15c, 0.5).fillCircle(sx, sy, 10);
    g.fillStyle(0xff3b4e, 0.5).fillCircle(ex, ey, 10);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, PipeConnectScene));
