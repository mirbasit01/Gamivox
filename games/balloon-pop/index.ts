import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 600, HUD = 60;
const COLORS = [0xff3b4e, 0x00d4ff, 0xffd15c, 0x00ffa3, 0xc94bff, 0xff8a5c];

interface Balloon { x: number; y: number; vy: number; r: number; color: number; popped: boolean; popAcc: number; }

class BalloonScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private balloons: Balloon[] = [];
  private score = 0;
  private missed = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private spawnAcc = 0;

  constructor() { super("balloon"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Score 0", 22, "#00ffa3");
    this.livesText = hudText(this, W - 16, 16, "❤❤❤❤❤", 20, "#ff3b4e").setOrigin(1, 0);
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.over) { this.reset(); return; }
      for (const b of this.balloons) {
        if (b.popped) continue;
        const dx = p.x - b.x, dy = p.y - b.y;
        if (dx * dx + dy * dy < b.r * b.r) { b.popped = true; b.popAcc = 0; this.score += 10; this.scoreText.setText("Score " + this.score); break; }
      }
    });
    this.reset();
  }

  reset() {
    this.balloons = []; this.score = 0; this.missed = 0;
    this.over = false; this.spawnAcc = 0;
    this.scoreText.setText("Score 0");
    this.livesText.setText("❤❤❤❤❤");
    this.overText?.destroy(); this.overText = undefined;
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    const d = dt / 1000;
    this.spawnAcc += dt;
    const interval = Math.max(400, 900 - this.score * 2);
    if (this.spawnAcc > interval) {
      this.spawnAcc = 0;
      this.balloons.push({ x: Phaser.Math.Between(40, W - 40), y: H + 40, vy: -(60 + Phaser.Math.Between(0, 60) + this.score * 0.3), r: Phaser.Math.Between(22, 38), color: Phaser.Utils.Array.GetRandom(COLORS), popped: false, popAcc: 0 });
    }
    this.balloons.forEach(b => {
      if (!b.popped) b.y += b.vy * d;
      else b.popAcc += dt;
    });
    this.balloons = this.balloons.filter(b => {
      if (!b.popped && b.y < HUD - 50) { this.missed++; this.livesText.setText("❤".repeat(Math.max(0, 5 - this.missed))); if (this.missed >= 5) this.endGame(); return false; }
      if (b.popped && b.popAcc > 300) return false;
      return true;
    });
    this.draw();
  }

  endGame() {
    this.over = true;
    this.overText = this.add.text(W / 2, H / 2, `Game Over\nScore ${this.score}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "32px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a1030, 0x1a1030, 1).fillRect(0, 0, W, H);
    this.balloons.forEach(b => {
      if (b.popped) {
        const t = b.popAcc / 300;
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * Math.PI * 2;
          g.fillStyle(b.color, 1 - t).fillCircle(b.x + Math.cos(a) * b.r * t * 1.5, b.y + Math.sin(a) * b.r * t * 1.5, 5 * (1 - t));
        }
        return;
      }
      g.fillStyle(b.color, 0.25).fillCircle(b.x, b.y, b.r + 6);
      g.fillStyle(b.color).fillCircle(b.x, b.y, b.r);
      g.fillStyle(0xffffff, 0.5).fillCircle(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.25);
      g.lineStyle(1, 0x888888, 0.5).beginPath().moveTo(b.x, b.y + b.r).lineTo(b.x + 4, b.y + b.r + 20).strokePath();
    });
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, BalloonScene));
