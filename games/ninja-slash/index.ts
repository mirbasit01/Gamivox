import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 560, HUD = 60;

interface Enemy { x: number; y: number; vx: number; vy: number; hp: number; r: number; }
interface Slash { x1: number; y1: number; x2: number; y2: number; t: number; }

class NinjaSlashScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private enemies: Enemy[] = [];
  private slashes: Slash[] = [];
  private score = 0;
  private lives = 5;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private spawnAcc = 0;
  private prevP = { x: 0, y: 0 };
  private stars: { x: number; y: number }[] = [];

  constructor() { super("ninjashlash"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Score 0", 22, "#00ffa3");
    this.livesText = hudText(this, W - 16, 16, "❤❤❤❤❤", 20, "#ff3b4e").setOrigin(1, 0);
    for (let i = 0; i < 40; i++) this.stars.push({ x: Phaser.Math.Between(0, W), y: Phaser.Math.Between(0, H) });
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.over) { this.reset(); return; }
      this.prevP = { x: p.x, y: p.y };
    });
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (this.over || !p.isDown) return;
      this.slashes.push({ x1: this.prevP.x, y1: this.prevP.y, x2: p.x, y2: p.y, t: 250 });
      this.checkSlash(this.prevP.x, this.prevP.y, p.x, p.y);
      this.prevP = { x: p.x, y: p.y };
    });
    this.reset();
  }

  reset() {
    this.enemies = []; this.slashes = []; this.score = 0; this.lives = 5;
    this.over = false; this.spawnAcc = 0;
    this.scoreText.setText("Score 0");
    this.livesText.setText("❤❤❤❤❤");
    this.overText?.destroy(); this.overText = undefined;
  }

  checkSlash(x1: number, y1: number, x2: number, y2: number) {
    this.enemies = this.enemies.filter(e => {
      const dx = x2 - x1, dy = y2 - y1;
      const fx = x1 - e.x, fy = y1 - e.y;
      const a = dx * dx + dy * dy;
      if (a === 0) return true;
      const b = 2 * (fx * dx + fy * dy);
      const c = fx * fx + fy * fy - e.r * e.r;
      if (b * b - 4 * a * c >= 0) { this.score += 20; this.scoreText.setText("Score " + this.score); return false; }
      return true;
    });
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    const d = dt / 1000;
    this.spawnAcc += dt;
    const rate = Math.max(400, 1500 - this.score * 2);
    if (this.spawnAcc > rate) {
      this.spawnAcc = 0;
      const side = Phaser.Math.Between(0, 3);
      let x = 0, y = 0, vx = 0, vy = 0;
      const spd = 80 + Math.floor(this.score / 200) * 10;
      if (side === 0) { x = Phaser.Math.Between(0, W); y = HUD; vx = Phaser.Math.FloatBetween(-50, 50); vy = spd; }
      else if (side === 1) { x = W; y = Phaser.Math.Between(HUD, H); vx = -spd; vy = Phaser.Math.FloatBetween(-50, 50); }
      else if (side === 2) { x = Phaser.Math.Between(0, W); y = H; vx = Phaser.Math.FloatBetween(-50, 50); vy = -spd; }
      else { x = 0; y = Phaser.Math.Between(HUD, H); vx = spd; vy = Phaser.Math.FloatBetween(-50, 50); }
      this.enemies.push({ x, y, vx, vy, hp: 1, r: Phaser.Math.Between(18, 28) });
    }
    this.enemies.forEach(e => { e.x += e.vx * d; e.y += e.vy * d; });
    this.enemies = this.enemies.filter(e => {
      if (e.x > -50 && e.x < W + 50 && e.y > HUD - 50 && e.y < H + 50) return true;
      this.lives--; this.livesText.setText("❤".repeat(Math.max(0, this.lives)));
      if (this.lives <= 0) this.endGame();
      return false;
    });
    this.slashes = this.slashes.filter(s => { s.t -= dt; return s.t > 0; });
    this.draw();
  }

  endGame() {
    this.over = true;
    this.overText = this.add.text(W / 2, H / 2, `Game Over\nScore ${this.score}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "32px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x050510).fillRect(0, 0, W, H);
    this.stars.forEach(s => g.fillStyle(0xffffff, 0.3).fillCircle(s.x, s.y, 1));
    this.enemies.forEach(e => {
      g.fillStyle(0xff3b4e, 0.25).fillCircle(e.x, e.y, e.r + 5);
      g.fillStyle(0xff3b4e).fillCircle(e.x, e.y, e.r);
      g.fillStyle(0xffffff, 0.6).fillCircle(e.x - e.r * 0.3, e.y - e.r * 0.3, e.r * 0.2);
    });
    this.slashes.forEach(s => {
      const a = s.t / 250;
      g.lineStyle(3, 0x00ffa3, a).beginPath().moveTo(s.x1, s.y1).lineTo(s.x2, s.y2).strokePath();
    });
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, NinjaSlashScene));
