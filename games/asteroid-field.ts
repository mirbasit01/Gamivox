import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "./_shared";

const W = 480;
const H = 640;

type Star = { x: number; y: number; s: number };
type Rock = { x: number; y: number; r: number; spin: number; rot: number; vy: number; sides: number; color: number };

class AsteroidScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private stars: Star[] = [];
  private rocks: Rock[] = [];
  private shipX = W / 2;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private dragging = false;
  private spawnAcc = 0;
  private elapsed = 0;
  private score = 0;
  private best = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private hint!: Phaser.GameObjects.Text;
  private state: "play" | "over" = "play";

  constructor() {
    super("asteroid");
  }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 14, "Time 0.0s", 22, "#00d4ff");
    this.hint = this.add
      .text(W / 2, H / 2, "", {
        fontFamily: "system-ui, sans-serif",
        fontStyle: "bold",
        fontSize: "26px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(2000);

    for (let i = 0; i < 80; i++)
      this.stars.push({
        x: Phaser.Math.Between(0, W),
        y: Phaser.Math.Between(0, H),
        s: Phaser.Math.FloatBetween(0.4, 1.8),
      });

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("A,D,SPACE,R") as Record<string, Phaser.Input.Keyboard.Key>;

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.state === "over") {
        this.reset();
        return;
      }
      this.dragging = true;
      this.shipX = Phaser.Math.Clamp(p.x, 22, W - 22);
    });
    this.input.on("pointerup", () => (this.dragging = false));
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (this.dragging && this.state === "play") this.shipX = Phaser.Math.Clamp(p.x, 22, W - 22);
    });

    this.reset();
  }

  reset() {
    this.rocks = [];
    this.shipX = W / 2;
    this.spawnAcc = 0;
    this.elapsed = 0;
    this.score = 0;
    this.dragging = false;
    this.state = "play";
    this.scoreText.setText("Time 0.0s");
    this.hint.setText("");
  }

  update(_t: number, dt: number) {
    const d = dt / 1000;

    // starfield scroll (speeds a little with time)
    const starBoost = 1 + this.elapsed * 0.02;
    this.stars.forEach((s) => {
      s.y += 40 * s.s * d * starBoost;
      if (s.y > H) {
        s.y = 0;
        s.x = Phaser.Math.Between(0, W);
      }
    });

    if (this.state === "over") {
      if (Phaser.Input.Keyboard.JustDown(this.keys.R) || Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.reset();
      this.draw();
      return;
    }

    this.elapsed += d;
    this.score = this.elapsed;
    this.scoreText.setText("Time " + this.elapsed.toFixed(1) + "s");

    // keyboard movement
    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    if (left) this.shipX -= 340 * d;
    if (right) this.shipX += 340 * d;
    this.shipX = Phaser.Math.Clamp(this.shipX, 22, W - 22);

    // spawn: rate and fall speed increase over time
    this.spawnAcc += dt;
    const spawnRate = Math.max(180, 700 - this.elapsed * 18);
    if (this.spawnAcc > spawnRate) {
      this.spawnAcc = 0;
      const r = Phaser.Math.Between(12, 28);
      this.rocks.push({
        x: Phaser.Math.Between(r, W - r),
        y: -r - 4,
        r,
        spin: Phaser.Math.FloatBetween(-2, 2),
        rot: Phaser.Math.FloatBetween(0, Math.PI * 2),
        vy: (110 + this.elapsed * 9) * Phaser.Math.FloatBetween(0.85, 1.3),
        sides: Phaser.Math.Between(5, 8),
        color: Phaser.Utils.Array.GetRandom([0x9aa4b2, 0xc0785c, 0x7d8fa8, 0xb0a08a]),
      });
    }

    // move rocks + collision
    const shipY = H - 54;
    for (const rk of this.rocks) {
      rk.y += rk.vy * d;
      rk.rot += rk.spin * d;
      // circular collision vs ship body (approx radius 18)
      const dx = rk.x - this.shipX;
      const dy = rk.y - shipY;
      if (dx * dx + dy * dy < (rk.r + 15) * (rk.r + 15)) {
        this.gameOver();
      }
    }
    this.rocks = this.rocks.filter((rk) => rk.y < H + rk.r + 10);

    this.draw();
  }

  gameOver() {
    if (this.state === "over") return;
    this.state = "over";
    if (this.elapsed > this.best) this.best = this.elapsed;
    this.hint.setText(
      `GAME OVER\nSurvived ${this.elapsed.toFixed(1)}s\nBest ${this.best.toFixed(1)}s\n\nTap / Space to restart`
    );
  }

  private drawRock(rk: Rock) {
    const g = this.gfx;
    g.fillStyle(rk.color, 1);
    g.lineStyle(2, 0x000000, 0.25);
    g.beginPath();
    for (let i = 0; i < rk.sides; i++) {
      const a = rk.rot + (i / rk.sides) * Math.PI * 2;
      const rad = rk.r * (0.82 + 0.18 * Math.sin(a * 3 + rk.rot));
      const px = rk.x + Math.cos(a) * rad;
      const py = rk.y + Math.sin(a) * rad;
      if (i === 0) g.moveTo(px, py);
      else g.lineTo(px, py);
    }
    g.closePath();
    g.fillPath();
    g.strokePath();
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillGradientStyle(0x05060f, 0x05060f, 0x0d1030, 0x1a0f3a, 1).fillRect(0, 0, W, H);
    this.stars.forEach((s) => g.fillStyle(0xffffff, 0.5 * s.s).fillCircle(s.x, s.y, s.s));

    this.rocks.forEach((rk) => this.drawRock(rk));

    if (this.state === "play") {
      const x = this.shipX;
      const y = H - 54;
      g.fillStyle(0x00d4ff, 0.3).fillCircle(x, y, 24);
      g.fillStyle(0xffffff, 1);
      g.fillTriangle(x, y - 20, x - 16, y + 16, x + 16, y + 16);
      g.fillStyle(0x00d4ff, 1).fillTriangle(x, y - 8, x - 8, y + 12, x + 8, y + 12);
      // thruster
      g.fillStyle(0xff8a3c, 0.9).fillTriangle(x - 6, y + 16, x + 6, y + 16, x, y + 16 + Phaser.Math.Between(8, 16));
    }
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, AsteroidScene));
