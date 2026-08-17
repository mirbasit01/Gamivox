import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 600, HUD = 60;
const COLS = 10, ROWS = 8, R = 22;
const COLORS = [0xff3b4e, 0x00d4ff, 0xffd15c, 0x00ffa3, 0xc94bff];

class BubbleScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private grid: (number | null)[][] = [];
  private shooterX = W / 2;
  private currentColor = 0;
  private nextColor = 0;
  private angle = -Math.PI / 2;
  private bullet: { x: number; y: number; vx: number; vy: number; color: number } | null = null;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;

  constructor() { super("bubble"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Score 0", 22, "#00d4ff");
    this.reset();
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (this.over) return;
      const dx = p.x - this.shooterX, dy = p.y - (H - 40);
      this.angle = Math.atan2(dy, dx);
    });
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.over) { this.reset(); return; }
      if (this.bullet) return;
      const dx = p.x - this.shooterX, dy = p.y - (H - 40);
      const a = Math.atan2(dy, dx);
      const spd = 500;
      this.bullet = { x: this.shooterX, y: H - 40, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, color: this.currentColor };
      this.currentColor = this.nextColor;
      this.nextColor = Phaser.Math.Between(0, COLORS.length - 1);
    });
  }

  reset() {
    this.grid = Array.from({ length: ROWS }, (_, r) =>
      Array.from({ length: COLS }, (_, c) => (r < 5 && (r + c) % 3 !== 0) ? Phaser.Math.Between(0, COLORS.length - 1) : null)
    );
    this.currentColor = Phaser.Math.Between(0, COLORS.length - 1);
    this.nextColor = Phaser.Math.Between(0, COLORS.length - 1);
    this.bullet = null;
    this.score = 0;
    this.over = false;
    this.overText?.destroy();
    this.overText = undefined;
    this.scoreText.setText("Score 0");
  }

  private cellPos(r: number, c: number) {
    const ox = r % 2 === 0 ? 0 : R;
    return { x: R + c * R * 2 + ox, y: HUD + R + r * R * 1.73 };
  }

  update(_t: number, dt: number) {
    if (this.over || !this.bullet) { this.draw(); return; }
    const d = dt / 1000;
    this.bullet.x += this.bullet.vx * d;
    this.bullet.y += this.bullet.vy * d;
    if (this.bullet.x < R) { this.bullet.x = R; this.bullet.vx *= -1; }
    if (this.bullet.x > W - R) { this.bullet.x = W - R; this.bullet.vx *= -1; }
    if (this.bullet.y < HUD + R) { this.snapBullet(); return; }
    // check collision with grid
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (this.grid[r][c] === null) continue;
        const p = this.cellPos(r, c);
        const dx = this.bullet!.x - p.x, dy = this.bullet!.y - p.y;
        if (dx * dx + dy * dy < (R * 1.9) ** 2) { this.snapBullet(); return; }
      }
    }
    this.draw();
  }

  private snapBullet() {
    if (!this.bullet) return;
    let bestR = 0, bestC = 0, bestD = Infinity;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (this.grid[r][c] !== null) continue;
        const p = this.cellPos(r, c);
        const d = (this.bullet!.x - p.x) ** 2 + (this.bullet!.y - p.y) ** 2;
        if (d < bestD) { bestD = d; bestR = r; bestC = c; }
      }
    }
    this.grid[bestR][bestC] = this.bullet.color;
    this.popMatches(bestR, bestC, this.bullet.color);
    this.bullet = null;
    // check lose
    if (this.grid[ROWS - 1].some(v => v !== null)) {
      this.over = true;
      this.overText = this.add.text(W / 2, H / 2, `Game Over\nScore ${this.score}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "32px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
    }
    this.draw();
  }

  private popMatches(r: number, c: number, color: number) {
    const visited = new Set<string>();
    const stack = [[r, c]];
    const group: [number, number][] = [];
    while (stack.length) {
      const [cr, cc] = stack.pop()!;
      const key = `${cr},${cc}`;
      if (visited.has(key)) continue;
      visited.add(key);
      if (this.grid[cr]?.[cc] !== color) continue;
      group.push([cr, cc]);
      for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0],[1,1],[-1,1]]) stack.push([cr+dr, cc+dc]);
    }
    if (group.length >= 3) {
      group.forEach(([gr, gc]) => { this.grid[gr][gc] = null; });
      this.score += group.length * 10;
      this.scoreText.setText("Score " + this.score);
    }
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const v = this.grid[r][c];
        if (v === null) continue;
        const p = this.cellPos(r, c);
        g.fillStyle(COLORS[v], 0.3).fillCircle(p.x, p.y, R);
        g.fillStyle(COLORS[v]).fillCircle(p.x, p.y, R - 3);
      }
    }
    // shooter
    g.fillStyle(COLORS[this.currentColor], 0.4).fillCircle(this.shooterX, H - 40, R + 4);
    g.fillStyle(COLORS[this.currentColor]).fillCircle(this.shooterX, H - 40, R - 3);
    // aim line
    g.lineStyle(1, 0xffffff, 0.3);
    g.beginPath();
    g.moveTo(this.shooterX, H - 40);
    g.lineTo(this.shooterX + Math.cos(this.angle) * 80, H - 40 + Math.sin(this.angle) * 80);
    g.strokePath();
    // next bubble
    g.fillStyle(COLORS[this.nextColor], 0.3).fillCircle(W - 40, H - 40, R);
    g.fillStyle(COLORS[this.nextColor]).fillCircle(W - 40, H - 40, R - 3);
    // bullet
    if (this.bullet) {
      g.fillStyle(COLORS[this.bullet.color], 0.4).fillCircle(this.bullet.x, this.bullet.y, R);
      g.fillStyle(COLORS[this.bullet.color]).fillCircle(this.bullet.x, this.bullet.y, R - 3);
    }
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, BubbleScene));
