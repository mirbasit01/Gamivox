import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 400, HUD = 60;
const GRAVITY = 1200;

interface Platform { x: number; y: number; w: number; flipped: boolean; }

class GravityFlipScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private px = 80;
  private py = H / 2;
  private vel = 0;
  private gravDir = 1; // 1 = down, -1 = up
  private platforms: Platform[] = [];
  private score = 0;
  private speed = 200;
  private scoreText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private scrollX = 0;
  private nextX = W;

  constructor() { super("gravityflip"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Score 0", 22, "#c94bff");
    const flip = () => { if (this.over) { this.reset(); return; } this.gravDir *= -1; };
    this.input.on("pointerdown", flip);
    this.input.keyboard!.on("keydown-SPACE", flip);
    this.input.keyboard!.on("keydown-UP", flip);
    this.reset();
  }

  reset() {
    this.px = 80; this.py = H / 2; this.vel = 0; this.gravDir = 1;
    this.platforms = []; this.score = 0; this.speed = 200; this.scrollX = 0; this.nextX = W;
    this.over = false;
    this.scoreText.setText("Score 0");
    this.overText?.destroy(); this.overText = undefined;
    // initial floor/ceiling
    this.platforms.push({ x: 0, y: H - 20, w: W * 2, flipped: false });
    this.platforms.push({ x: 0, y: HUD, w: W * 2, flipped: true });
    this.generatePlatforms();
  }

  generatePlatforms() {
    while (this.nextX < this.scrollX + W + 400) {
      const gap = Phaser.Math.Between(80, 140);
      const flipped = Math.random() < 0.5;
      const y = flipped ? HUD : H - 20;
      this.platforms.push({ x: this.nextX, y, w: Phaser.Math.Between(60, 120), flipped });
      this.nextX += gap + Phaser.Math.Between(60, 120);
    }
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    const d = dt / 1000;
    this.score += dt;
    this.speed = 200 + Math.floor(this.score / 3000) * 20;
    this.scoreText.setText("Score " + Math.floor(this.score / 100));
    this.scrollX += this.speed * d;
    this.generatePlatforms();
    this.platforms = this.platforms.filter(p => p.x + p.w > this.scrollX - 50);

    this.vel += GRAVITY * this.gravDir * d;
    this.vel = Phaser.Math.Clamp(this.vel, -600, 600);
    this.py += this.vel * d;

    // collision
    for (const p of this.platforms) {
      const px = p.x - this.scrollX;
      if (this.px + 12 > px && this.px - 12 < px + p.w) {
        if (!p.flipped && this.py + 14 > p.y && this.py + 14 < p.y + 20 && this.vel > 0) { this.py = p.y - 14; this.vel = 0; }
        if (p.flipped && this.py - 14 < p.y + 20 && this.py - 14 > p.y && this.vel < 0) { this.py = p.y + 34; this.vel = 0; }
      }
    }

    if (this.py > H + 20 || this.py < HUD - 20) this.endGame();
    this.draw();
  }

  endGame() {
    this.over = true;
    this.overText = this.add.text(W / 2, H / 2, `Crashed!\nScore ${Math.floor(this.score / 100)}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "32px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillGradientStyle(0x0a0018, 0x0a0018, 0x1a0033, 0x1a0033, 1).fillRect(0, 0, W, H);
    this.platforms.forEach(p => {
      const sx = p.x - this.scrollX;
      g.fillStyle(0xc94bff, 0.15).fillRect(sx, p.flipped ? p.y : p.y - 4, p.w, 24);
      g.fillStyle(0xc94bff).fillRect(sx, p.flipped ? p.y : p.y - 4, p.w, 8);
    });
    // player
    g.fillStyle(0xffd15c, 0.3).fillCircle(this.px, this.py, 18);
    g.fillStyle(0xffd15c).fillRect(this.px - 12, this.py - 12, 24, 24);
    g.fillStyle(0xffaa00).fillRect(this.px - 8, this.py - 8, 16, 16);
    // gravity arrow
    g.lineStyle(2, 0xffffff, 0.5);
    const ay = this.gravDir > 0 ? this.py + 20 : this.py - 20;
    g.beginPath().moveTo(this.px, this.py).lineTo(this.px, ay).strokePath();
    g.fillStyle(0xffffff, 0.5).fillTriangle(this.px - 5, ay, this.px + 5, ay, this.px, ay + this.gravDir * 8);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, GravityFlipScene));
