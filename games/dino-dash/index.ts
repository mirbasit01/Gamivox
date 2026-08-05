import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 640;
const H = 300;
const GROUND_Y = H - 50;
const GRAVITY = 2200;
const JUMP_VEL = -760;

interface Obstacle {
  x: number;
  w: number;
  h: number;
}

class DinoScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private dinoY = GROUND_Y;
  private vel = 0;
  private onGround = true;
  private obstacles: Obstacle[] = [];
  private spawnAcc = 0;
  private nextSpawn = 1200;
  private speed = 260;
  private dist = 0;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private overText?: Phaser.GameObjects.Text;
  private state: "play" | "dead" = "play";
  private groundScroll = 0;
  private clouds: { x: number; y: number; s: number }[] = [];

  constructor() {
    super("dino");
  }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, W - 16, 16, "0", 22, "#ffffff").setOrigin(1, 0);

    const act = () => this.act();
    this.input.on("pointerdown", act);
    this.input.keyboard!.on("keydown-SPACE", act);
    this.input.keyboard!.on("keydown-UP", act);

    this.clouds = [
      { x: 120, y: 60, s: 14 },
      { x: 360, y: 40, s: 18 },
      { x: 540, y: 80, s: 12 },
    ];
    this.reset();
  }

  reset() {
    this.dinoY = GROUND_Y;
    this.vel = 0;
    this.onGround = true;
    this.obstacles = [];
    this.spawnAcc = 0;
    this.nextSpawn = 1200;
    this.speed = 260;
    this.dist = 0;
    this.score = 0;
    this.state = "play";
    this.scoreText.setText("0");
    this.overText?.destroy();
    this.overText = undefined;
  }

  act() {
    if (this.state === "dead") {
      this.reset();
      return;
    }
    if (this.onGround) {
      this.vel = JUMP_VEL;
      this.onGround = false;
    }
  }

  spawnObstacle() {
    const tall = Math.random() < 0.4;
    this.obstacles.push({
      x: W + 20,
      w: tall ? 18 : Phaser.Math.Between(18, 34),
      h: tall ? Phaser.Math.Between(46, 60) : Phaser.Math.Between(28, 42),
    });
  }

  update(_t: number, dt: number) {
    const d = dt / 1000;
    if (this.state === "play") {
      // difficulty ramps with distance
      this.speed = 260 + this.dist * 0.02;

      this.vel += GRAVITY * d;
      this.dinoY += this.vel * d;
      if (this.dinoY >= GROUND_Y) {
        this.dinoY = GROUND_Y;
        this.vel = 0;
        this.onGround = true;
      }

      this.spawnAcc += dt;
      if (this.spawnAcc >= this.nextSpawn) {
        this.spawnAcc = 0;
        this.nextSpawn = Phaser.Math.Between(700, 1400) * (260 / this.speed) + 300;
        this.spawnObstacle();
      }

      this.obstacles.forEach((o) => (o.x -= this.speed * d));
      this.obstacles = this.obstacles.filter((o) => o.x > -o.w - 10);

      this.dist += this.speed * d;
      this.score = Math.floor(this.dist / 10);
      this.scoreText.setText("" + this.score);

      this.groundScroll = (this.groundScroll + this.speed * d) % 40;
      this.clouds.forEach((c) => {
        c.x -= this.speed * 0.15 * d;
        if (c.x < -30) c.x = W + 30;
      });

      // collision
      const dinoX = 70;
      const dinoW = 34;
      const dinoH = 40;
      for (const o of this.obstacles) {
        const overlapX = dinoX + dinoW * 0.5 > o.x - o.w * 0.5 && dinoX - dinoW * 0.5 < o.x + o.w * 0.5;
        const dinoTop = this.dinoY - dinoH;
        const obsTop = GROUND_Y - o.h;
        const overlapY = dinoTop < GROUND_Y && this.dinoY > obsTop;
        if (overlapX && overlapY) {
          this.die();
          break;
        }
      }
    }
    this.draw();
  }

  die() {
    if (this.state === "dead") return;
    this.state = "dead";
    this.overText = this.add
      .text(W / 2, H / 2 - 10, `GAME OVER\nScore ${this.score}\nTap / Space to retry`, {
        fontFamily: "system-ui, sans-serif",
        fontStyle: "bold",
        fontSize: "26px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    // sky
    g.fillGradientStyle(0x101026, 0x101026, 0x1c2444, 0x2a2350, 1);
    g.fillRect(0, 0, W, H);
    // clouds
    this.clouds.forEach((c) => {
      g.fillStyle(0x3a3f66, 0.7);
      g.fillCircle(c.x, c.y, c.s);
      g.fillCircle(c.x + c.s, c.y + 4, c.s * 0.8);
      g.fillCircle(c.x - c.s, c.y + 4, c.s * 0.7);
    });
    // ground line
    g.fillStyle(0x2a2a3d, 1);
    g.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    g.lineStyle(3, 0x6cf0c2, 1);
    g.beginPath();
    g.moveTo(0, GROUND_Y);
    g.lineTo(W, GROUND_Y);
    g.strokePath();
    // ground detail dashes (parallax)
    g.fillStyle(0x44476b, 1);
    for (let x = -40 + (40 - this.groundScroll); x < W; x += 40) {
      g.fillRect(x, GROUND_Y + 16, 18, 4);
    }
    // obstacles (cacti)
    this.obstacles.forEach((o) => {
      g.fillStyle(0x4fd67e, 1);
      g.fillRoundedRect(o.x - o.w / 2, GROUND_Y - o.h, o.w, o.h, 4);
      g.fillStyle(0x2fae5e, 1);
      g.fillRect(o.x - o.w / 2 - 6, GROUND_Y - o.h * 0.6, 6, o.h * 0.25);
      g.fillRect(o.x + o.w / 2, GROUND_Y - o.h * 0.75, 6, o.h * 0.25);
    });
    // dino
    const dx = 70;
    const dh = 40;
    const dw = 34;
    g.fillStyle(0xffd15c, 1);
    g.fillRoundedRect(dx - dw / 2, this.dinoY - dh, dw, dh, 6);
    g.fillStyle(0x101026, 1);
    g.fillCircle(dx + 6, this.dinoY - dh + 10, 3);
    // legs anim
    const run = this.onGround ? Math.floor(this.groundScroll / 20) % 2 : 0;
    g.fillStyle(0xffb347, 1);
    g.fillRect(dx - 10, this.dinoY - 6, 8, 6 + run * 2);
    g.fillRect(dx + 2, this.dinoY - 6, 8, 6 + (1 - run) * 2);
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, DinoScene));
