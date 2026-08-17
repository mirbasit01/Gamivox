import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 400, HUD = 60;
const COLORS = [0xff3b4e, 0xffd15c, 0x00ffa3, 0x00d4ff, 0xc94bff];
const NAMES = ["Red", "Yellow", "Green", "Cyan", "Purple"];

interface Fruit { x: number; y: number; vy: number; r: number; color: number; sliced: boolean; sliceAcc: number; }

class FruitSlicerScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private fruits: Fruit[] = [];
  private score = 0;
  private lives = 3;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private spawnAcc = 0;
  private trail: { x: number; y: number; t: number }[] = [];
  private prevPointer = { x: 0, y: 0 };

  constructor() { super("fruitslicer"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Score 0", 22, "#ffd15c");
    this.livesText = hudText(this, W - 16, 16, "❤❤❤", 22, "#ff3b4e").setOrigin(1, 0);
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (this.over || !p.isDown) return;
      this.trail.push({ x: p.x, y: p.y, t: 200 });
      this.checkSlice(this.prevPointer.x, this.prevPointer.y, p.x, p.y);
      this.prevPointer = { x: p.x, y: p.y };
    });
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.over) { this.reset(); return; }
      this.prevPointer = { x: p.x, y: p.y };
    });
    this.reset();
  }

  reset() {
    this.fruits = []; this.score = 0; this.lives = 3;
    this.over = false; this.spawnAcc = 0; this.trail = [];
    this.scoreText.setText("Score 0");
    this.livesText.setText("❤❤❤");
    this.overText?.destroy(); this.overText = undefined;
  }

  checkSlice(x1: number, y1: number, x2: number, y2: number) {
    for (const f of this.fruits) {
      if (f.sliced) continue;
      // segment-circle intersection
      const dx = x2 - x1, dy = y2 - y1;
      const fx = x1 - f.x, fy = y1 - f.y;
      const a = dx * dx + dy * dy;
      if (a === 0) continue;
      const b = 2 * (fx * dx + fy * dy);
      const c = fx * fx + fy * fy - f.r * f.r;
      const disc = b * b - 4 * a * c;
      if (disc >= 0) { f.sliced = true; f.sliceAcc = 0; this.score += 10; this.scoreText.setText("Score " + this.score); }
    }
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    const d = dt / 1000;
    this.spawnAcc += dt;
    const interval = Math.max(500, 1200 - this.score * 3);
    if (this.spawnAcc > interval) {
      this.spawnAcc = 0;
      const x = Phaser.Math.Between(40, W - 40);
      this.fruits.push({ x, y: H + 30, vy: -(300 + Phaser.Math.Between(0, 150)), r: Phaser.Math.Between(20, 32), color: Phaser.Utils.Array.GetRandom(COLORS), sliced: false, sliceAcc: 0 });
    }
    this.fruits.forEach(f => {
      if (!f.sliced) { f.vy += 600 * d; f.y += f.vy * d; }
      else f.sliceAcc += dt;
    });
    this.fruits = this.fruits.filter(f => {
      if (!f.sliced && f.y > H + 60) { this.lives--; this.livesText.setText("❤".repeat(Math.max(0, this.lives))); if (this.lives <= 0) this.endGame(); return false; }
      if (f.sliced && f.sliceAcc > 400) return false;
      return true;
    });
    this.trail = this.trail.filter(t => { t.t -= dt; return t.t > 0; });
    this.draw();
  }

  endGame() {
    this.over = true;
    this.overText = this.add.text(W / 2, H / 2, `Game Over\nScore ${this.score}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "32px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    this.fruits.forEach(f => {
      if (f.sliced) {
        const t = f.sliceAcc / 400;
        g.fillStyle(f.color, 1 - t).fillCircle(f.x - 10 * t, f.y - 5 * t, f.r * (1 - t * 0.5));
        g.fillStyle(f.color, 1 - t).fillCircle(f.x + 10 * t, f.y + 5 * t, f.r * (1 - t * 0.5));
        return;
      }
      g.fillStyle(f.color, 0.3).fillCircle(f.x, f.y, f.r + 5);
      g.fillStyle(f.color).fillCircle(f.x, f.y, f.r);
      g.fillStyle(0xffffff, 0.5).fillCircle(f.x - f.r * 0.3, f.y - f.r * 0.3, f.r * 0.25);
    });
    // trail
    for (let i = 1; i < this.trail.length; i++) {
      const a = this.trail[i].t / 200;
      g.lineStyle(3, 0xffffff, a).beginPath().moveTo(this.trail[i - 1].x, this.trail[i - 1].y).lineTo(this.trail[i].x, this.trail[i].y).strokePath();
    }
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, FruitSlicerScene));
