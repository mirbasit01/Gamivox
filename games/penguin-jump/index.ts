import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 600, HUD = 60;
const GRAVITY = 1800, JUMP_VEL = -620;
const PLATFORM_W = 80, PLATFORM_H = 14;

interface Platform { x: number; y: number; }

class PenguinJumpScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private px = W / 2;
  private py = 0;
  private vel = 0;
  private platforms: Platform[] = [];
  private score = 0;
  private highScore = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private cameraY = 0;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;

  constructor() { super("penguinjump"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Height 0", 22, "#00d4ff");
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("A,D") as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.on("pointerdown", () => { if (this.over) this.reset(); });
    this.reset();
  }

  reset() {
    this.platforms = [];
    this.cameraY = 0;
    for (let i = 0; i < 15; i++) {
      this.platforms.push({ x: i === 0 ? W / 2 - PLATFORM_W / 2 : Phaser.Math.Between(20, W - PLATFORM_W - 20), y: H - 80 - i * 80 });
    }
    this.px = W / 2; this.py = H - 100; this.vel = JUMP_VEL;
    this.score = 0; this.over = false;
    this.scoreText.setText("Height 0");
    this.overText?.destroy(); this.overText = undefined;
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    const d = dt / 1000;
    const spd = 240;
    if (this.cursors.left.isDown || this.keys.A.isDown) this.px -= spd * d;
    if (this.cursors.right.isDown || this.keys.D.isDown) this.px += spd * d;
    if (this.px < 0) this.px = W;
    if (this.px > W) this.px = 0;

    this.vel += GRAVITY * d;
    this.py += this.vel * d;

    // platform collision (only when falling)
    if (this.vel > 0) {
      for (const p of this.platforms) {
        const screenY = p.y - this.cameraY;
        if (this.px + 14 > p.x && this.px - 14 < p.x + PLATFORM_W && this.py > screenY && this.py < screenY + PLATFORM_H + 20 && this.py - this.vel * d < screenY) {
          this.vel = JUMP_VEL;
          break;
        }
      }
    }

    // scroll camera up
    if (this.py < H / 2) {
      const diff = H / 2 - this.py;
      this.cameraY -= diff;
      this.py = H / 2;
      this.score = Math.max(this.score, Math.floor(-this.cameraY / 10));
      this.scoreText.setText("Height " + this.score);
    }

    // generate new platforms
    const topY = this.cameraY;
    while (this.platforms.length < 20) {
      const minY = Math.min(...this.platforms.map(p => p.y));
      this.platforms.push({ x: Phaser.Math.Between(20, W - PLATFORM_W - 20), y: minY - Phaser.Math.Between(60, 100) });
    }
    this.platforms = this.platforms.filter(p => p.y - this.cameraY < H + 50);

    if (this.py > H + 50) {
      if (this.score > this.highScore) this.highScore = this.score;
      this.endGame();
    }
    this.draw();
  }

  endGame() {
    this.over = true;
    this.overText = this.add.text(W / 2, H / 2, `Fell!\nHeight ${this.score}\nBest ${this.highScore}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "28px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillGradientStyle(0x050a1a, 0x050a1a, 0x0a1a3a, 0x0a1a3a, 1).fillRect(0, 0, W, H);
    this.platforms.forEach(p => {
      const sy = p.y - this.cameraY;
      g.fillStyle(0x00ffa3, 0.15).fillRoundedRect(p.x, sy + 2, PLATFORM_W, PLATFORM_H, 6);
      g.fillStyle(0x00ffa3).fillRoundedRect(p.x, sy, PLATFORM_W, PLATFORM_H, 6);
    });
    // penguin
    g.fillStyle(0x1a1a2e).fillEllipse(this.px, this.py - 10, 28, 36);
    g.fillStyle(0xffffff).fillEllipse(this.px, this.py - 8, 18, 26);
    g.fillStyle(0xffd15c).fillTriangle(this.px - 4, this.py + 2, this.px + 4, this.py + 2, this.px, this.py + 8);
    g.fillStyle(0x111111).fillCircle(this.px - 5, this.py - 14, 3);
    g.fillStyle(0x111111).fillCircle(this.px + 5, this.py - 14, 3);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, PenguinJumpScene));
