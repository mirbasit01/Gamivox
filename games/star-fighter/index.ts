import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "./_shared";

const W = 480;
const H = 640;

type Bullet = { x: number; y: number };
type Enemy = { x: number; y: number; hp: number; color: number; wob: number };

class ShooterScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private stars: { x: number; y: number; s: number }[] = [];
  private shipX = W / 2;
  private bullets: Bullet[] = [];
  private enemies: Enemy[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private fireAcc = 0;
  private spawnAcc = 0;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private state: "play" | "over" = "play";
  private hint!: Phaser.GameObjects.Text;

  constructor() {
    super("shooter");
  }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 14, "Score 0", 22, "#ff2e97");
    this.hint = this.add
      .text(W / 2, H / 2, "", {
        fontFamily: "system-ui",
        fontStyle: "bold",
        fontSize: "28px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(2000);

    for (let i = 0; i < 60; i++)
      this.stars.push({ x: Phaser.Math.Between(0, W), y: Phaser.Math.Between(0, H), s: Phaser.Math.FloatBetween(0.4, 1.6) });

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("A,D,SPACE,R") as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => (this.shipX = Phaser.Math.Clamp(p.x, 24, W - 24)));
    this.input.on("pointerdown", () => { if (this.state === "over") this.reset(); });
  }

  reset() {
    this.bullets = [];
    this.enemies = [];
    this.score = 0;
    this.shipX = W / 2;
    this.state = "play";
    this.scoreText.setText("Score 0");
    this.hint.setText("");
  }

  update(_t: number, dt: number) {
    const d = dt / 1000;
    // stars scroll
    this.stars.forEach((s) => {
      s.y += 40 * s.s * d;
      if (s.y > H) { s.y = 0; s.x = Phaser.Math.Between(0, W); }
    });

    if (this.state === "over") {
      if (Phaser.Input.Keyboard.JustDown(this.keys.R)) this.reset();
      this.draw();
      return;
    }

    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    if (left) this.shipX -= 320 * d;
    if (right) this.shipX += 320 * d;
    this.shipX = Phaser.Math.Clamp(this.shipX, 24, W - 24);

    // fire
    this.fireAcc += dt;
    const firing = this.cursors.space?.isDown || this.keys.SPACE.isDown || this.input.activePointer.isDown;
    if (firing && this.fireAcc > 220) {
      this.fireAcc = 0;
      this.bullets.push({ x: this.shipX, y: H - 60 });
    }
    this.bullets.forEach((b) => (b.y -= 520 * d));
    this.bullets = this.bullets.filter((b) => b.y > -10);

    // spawn enemies
    this.spawnAcc += dt;
    const rate = Math.max(500, 1400 - this.score * 4);
    if (this.spawnAcc > rate) {
      this.spawnAcc = 0;
      this.enemies.push({
        x: Phaser.Math.Between(30, W - 30),
        y: -20,
        hp: 1,
        color: Phaser.Utils.Array.GetRandom([0xff2e97, 0x5c1cff, 0x00d4ff, 0xffd15c]),
        wob: Phaser.Math.FloatBetween(0, Math.PI * 2),
      });
    }
    const fall = 60 + this.score * 0.6;
    this.enemies.forEach((e) => {
      e.y += fall * d;
      e.wob += d * 3;
      e.x += Math.sin(e.wob) * 30 * d;
    });

    // collisions bullet-enemy
    for (const e of this.enemies) {
      for (const b of this.bullets) {
        if (Math.abs(e.x - b.x) < 20 && Math.abs(e.y - b.y) < 20) {
          e.hp = 0;
          b.y = -999;
          this.score += 5;
          this.scoreText.setText("Score " + this.score);
        }
      }
      // reached ship / bottom
      if (e.y > H - 44 && Math.abs(e.x - this.shipX) < 28) this.gameOver();
      if (e.y > H + 20) this.gameOver();
    }
    this.enemies = this.enemies.filter((e) => e.hp > 0 && e.y < H + 20);
    this.bullets = this.bullets.filter((b) => b.y > -10);

    this.draw();
  }

  gameOver() {
    if (this.state === "over") return;
    this.state = "over";
    this.hint.setText(`GAME OVER\nScore ${this.score}\nPress R / click`);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillGradientStyle(0x0a0018, 0x0a0018, 0x1a0033, 0x2a0044, 1).fillRect(0, 0, W, H);
    this.stars.forEach((s) => g.fillStyle(0xffffff, 0.5 * s.s).fillCircle(s.x, s.y, s.s));
    // bullets
    this.bullets.forEach((b) => {
      g.fillStyle(0xff2e97, 1).fillRect(b.x - 2, b.y - 8, 4, 12);
    });
    // enemies
    this.enemies.forEach((e) => {
      g.fillStyle(e.color, 0.3).fillCircle(e.x, e.y, 18);
      g.fillStyle(e.color, 1);
      g.fillTriangle(e.x - 14, e.y - 10, e.x + 14, e.y - 10, e.x, e.y + 14);
    });
    // ship
    if (this.state === "play") {
      const x = this.shipX, y = H - 44;
      g.fillStyle(0x00d4ff, 0.35).fillCircle(x, y, 22);
      g.fillStyle(0xffffff, 1);
      g.fillTriangle(x, y - 18, x - 16, y + 16, x + 16, y + 16);
      g.fillStyle(0xff2e97, 1).fillTriangle(x, y + 6, x - 7, y + 22, x + 7, y + 22);
    }
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, ShooterScene));
