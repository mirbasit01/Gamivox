import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 520;
const H = 560;

type Bullet = { x: number; y: number; vx: number; vy: number };
type Drone = { x: number; y: number; vx: number; vy: number; r: number; hp: number; color: number; wob: number };

class TurretScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private bullets: Bullet[] = [];
  private drones: Drone[] = [];
  private tx = W / 2;
  private ty = H - 40;
  private aim = -Math.PI / 2;
  private spawnAcc = 0;
  private fireCd = 0;
  private score = 0;
  private lives = 3;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private hint!: Phaser.GameObjects.Text;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private state: "play" | "over" = "play";

  constructor() {
    super("turret");
  }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 14, "Score 0", 22, "#ffd15c");
    this.livesText = hudText(this, W - 130, 14, "Lives 3", 22, "#ff5c7a");
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

    this.keys = this.input.keyboard!.addKeys("R,SPACE") as Record<string, Phaser.Input.Keyboard.Key>;

    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      this.aim = Phaser.Math.Angle.Between(this.tx, this.ty, p.x, p.y);
    });
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.state === "over") {
        this.reset();
        return;
      }
      this.aim = Phaser.Math.Angle.Between(this.tx, this.ty, p.x, p.y);
      this.fire();
    });

    this.reset();
  }

  reset() {
    this.bullets = [];
    this.drones = [];
    this.aim = -Math.PI / 2;
    this.spawnAcc = 0;
    this.fireCd = 0;
    this.score = 0;
    this.lives = 3;
    this.state = "play";
    this.scoreText.setText("Score 0");
    this.livesText.setText("Lives 3");
    this.hint.setText("");
  }

  fire() {
    if (this.fireCd > 0) return;
    this.fireCd = 150;
    const speed = 620;
    this.bullets.push({
      x: this.tx + Math.cos(this.aim) * 34,
      y: this.ty + Math.sin(this.aim) * 34,
      vx: Math.cos(this.aim) * speed,
      vy: Math.sin(this.aim) * speed,
    });
  }

  update(_t: number, dt: number) {
    const d = dt / 1000;

    if (this.state === "over") {
      if (Phaser.Input.Keyboard.JustDown(this.keys.R) || Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.reset();
      this.draw();
      return;
    }

    if (this.fireCd > 0) this.fireCd -= dt;
    if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) this.fire();

    // spawn drones (harder over time via score)
    this.spawnAcc += dt;
    const rate = Math.max(500, 1300 - this.score * 6);
    if (this.spawnAcc > rate) {
      this.spawnAcc = 0;
      const x = Phaser.Math.Between(30, W - 30);
      const ang = Phaser.Math.Angle.Between(x, -20, this.tx, this.ty);
      const spd = 45 + Phaser.Math.FloatBetween(0, 30) + this.score * 0.7;
      this.drones.push({
        x,
        y: -20,
        vx: Math.cos(ang) * spd * 0.5,
        vy: Math.max(35, Math.sin(ang) * spd),
        r: Phaser.Math.Between(14, 20),
        hp: 1,
        color: Phaser.Utils.Array.GetRandom([0x5c1cff, 0x00d4ff, 0xff2e97, 0x3cff8a]),
        wob: Phaser.Math.FloatBetween(0, Math.PI * 2),
      });
    }

    // move bullets
    for (const b of this.bullets) {
      b.x += b.vx * d;
      b.y += b.vy * d;
    }
    this.bullets = this.bullets.filter((b) => b.x > -20 && b.x < W + 20 && b.y > -20 && b.y < H + 20);

    // move drones
    const line = this.ty - 6;
    for (const dr of this.drones) {
      dr.wob += d * 4;
      dr.x += dr.vx * d + Math.sin(dr.wob) * 12 * d;
      dr.y += dr.vy * d;
      dr.x = Phaser.Math.Clamp(dr.x, dr.r, W - dr.r);
      if (dr.y >= line) {
        dr.hp = 0;
        this.loseLife();
      }
    }

    // bullet vs drone
    for (const dr of this.drones) {
      if (dr.hp <= 0) continue;
      for (const b of this.bullets) {
        const dx = dr.x - b.x;
        const dy = dr.y - b.y;
        if (dx * dx + dy * dy < (dr.r + 4) * (dr.r + 4)) {
          dr.hp = 0;
          b.x = -999;
          this.score += 10;
          this.scoreText.setText("Score " + this.score);
          break;
        }
      }
    }

    this.drones = this.drones.filter((dr) => dr.hp > 0);
    this.bullets = this.bullets.filter((b) => b.x > -900);

    this.draw();
  }

  loseLife() {
    this.lives -= 1;
    this.livesText.setText("Lives " + Math.max(0, this.lives));
    if (this.lives <= 0) this.gameOver();
  }

  gameOver() {
    if (this.state === "over") return;
    this.state = "over";
    this.hint.setText(`GAME OVER\nScore ${this.score}\n\nTap / R to restart`);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillGradientStyle(0x080a16, 0x080a16, 0x101636, 0x0a0f28, 1).fillRect(0, 0, W, H);

    // turret ground line
    g.lineStyle(2, 0x2a3358, 1).lineBetween(0, this.ty - 6, W, this.ty - 6);
    g.fillStyle(0x141a30, 1).fillRect(0, this.ty - 6, W, H - (this.ty - 6));

    // drones
    this.drones.forEach((dr) => {
      g.fillStyle(dr.color, 0.25).fillCircle(dr.x, dr.y, dr.r + 5);
      g.fillStyle(dr.color, 1).fillCircle(dr.x, dr.y, dr.r);
      g.fillStyle(0xffffff, 0.9).fillCircle(dr.x, dr.y, dr.r * 0.4);
    });

    // bullets
    this.bullets.forEach((b) => {
      g.fillStyle(0xffd15c, 1).fillCircle(b.x, b.y, 4);
    });

    // turret base + barrel
    g.fillStyle(0x3cff8a, 0.25).fillCircle(this.tx, this.ty, 30);
    g.fillStyle(0x24304f, 1).fillCircle(this.tx, this.ty, 22);
    const bx = this.tx + Math.cos(this.aim) * 40;
    const by = this.ty + Math.sin(this.aim) * 40;
    g.lineStyle(10, 0x9aa4b2, 1).lineBetween(this.tx, this.ty, bx, by);
    g.fillStyle(0x3cff8a, 1).fillCircle(this.tx, this.ty, 12);
    if (this.state === "play") g.fillStyle(0xffd15c, 1).fillCircle(bx, by, 5);
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, TurretScene));
