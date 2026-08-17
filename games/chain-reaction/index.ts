import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 480, HUD = 60;
const GRID = 5, CELL = Math.floor((W - 60) / GRID), OX = 30, OY = HUD + 20;

class ChainReactionScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private board: { color: number; count: number }[][] = [];
  private currentPlayer = 0;
  private scores = [0, 0];
  private scoreText!: Phaser.GameObjects.Text;
  private turnText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private animating = false;
  private playerColors = [0xff3b4e, 0x00d4ff];

  constructor() { super("chainreaction"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "🔴 0  🔵 0", 20, "#ffffff");
    this.turnText = hudText(this, W - 16, 16, "Red's turn", 20, "#ff3b4e").setOrigin(1, 0);
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.over) { this.reset(); return; }
      if (this.animating) return;
      const c = Math.floor((p.x - OX) / CELL), r = Math.floor((p.y - OY) / CELL);
      if (r >= 0 && r < GRID && c >= 0 && c < GRID) this.place(r, c);
    });
    this.reset();
  }

  reset() {
    this.board = Array.from({ length: GRID }, () => Array.from({ length: GRID }, () => ({ color: -1, count: 0 })));
    this.currentPlayer = 0; this.scores = [0, 0]; this.over = false; this.animating = false;
    this.scoreText.setText("🔴 0  🔵 0");
    this.turnText.setText("Red's turn").setColor("#ff3b4e");
    this.overText?.destroy(); this.overText = undefined;
  }

  maxOrbs(r: number, c: number) {
    let n = 4;
    if (r === 0 || r === GRID - 1) n--;
    if (c === 0 || c === GRID - 1) n--;
    return n;
  }

  place(r: number, c: number) {
    const cell = this.board[r][c];
    if (cell.color !== -1 && cell.color !== this.currentPlayer) return;
    cell.color = this.currentPlayer;
    cell.count++;
    this.scores[this.currentPlayer]++;
    this.scoreText.setText(`🔴 ${this.scores[0]}  🔵 ${this.scores[1]}`);
    this.explode(r, c);
  }

  explode(r: number, c: number) {
    const cell = this.board[r][c];
    if (cell.count < this.maxOrbs(r, c)) { this.nextTurn(); return; }
    this.animating = true;
    const color = cell.color;
    cell.count = 0; cell.color = -1;
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    let pending = 0;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= GRID || nc < 0 || nc >= GRID) continue;
      pending++;
      this.time.delayedCall(200, () => {
        this.board[nr][nc].color = color;
        this.board[nr][nc].count++;
        this.scores[color]++;
        this.scoreText.setText(`🔴 ${this.scores[0]}  🔵 ${this.scores[1]}`);
        pending--;
        if (pending === 0) {
          this.animating = false;
          // check chain
          const toExplode = [];
          for (let rr = 0; rr < GRID; rr++) for (let cc = 0; cc < GRID; cc++) {
            if (this.board[rr][cc].count >= this.maxOrbs(rr, cc) && this.board[rr][cc].color === color) toExplode.push([rr, cc]);
          }
          if (toExplode.length > 0) { this.animating = true; toExplode.forEach(([er, ec]) => this.explode(er, ec)); }
          else this.nextTurn();
        }
      });
    }
    if (pending === 0) { this.animating = false; this.nextTurn(); }
  }

  nextTurn() {
    // check win
    const total = this.board.flat().filter(c => c.color !== -1).length;
    if (total > GRID && this.board.flat().every(c => c.color === -1 || c.color === this.currentPlayer)) {
      this.over = true;
      const winner = this.currentPlayer === 0 ? "Red" : "Blue";
      this.overText = this.add.text(W / 2, H / 2, `${winner} Wins!\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "36px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
      return;
    }
    this.currentPlayer = 1 - this.currentPlayer;
    this.turnText.setText(this.currentPlayer === 0 ? "Red's turn" : "Blue's turn").setColor(this.currentPlayer === 0 ? "#ff3b4e" : "#00d4ff");
  }

  update() { this.draw(); }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    for (let r = 0; r < GRID; r++) for (let c = 0; c < GRID; c++) {
      const x = OX + c * CELL, y = OY + r * CELL;
      g.fillStyle(0x111122).fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      g.lineStyle(1, 0x222233).strokeRect(x, y, CELL, CELL);
      const cell = this.board[r][c];
      if (cell.count > 0) {
        const color = this.playerColors[cell.color];
        const cx = x + CELL / 2, cy = y + CELL / 2;
        const positions = [[0,0],[-10,0],[10,0],[0,-10],[0,10]].slice(0, cell.count);
        positions.forEach(([ox, oy]) => { g.fillStyle(color, 0.3).fillCircle(cx + ox, cy + oy, 10); g.fillStyle(color).fillCircle(cx + ox, cy + oy, 7); });
      }
    }
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, ChainReactionScene));
