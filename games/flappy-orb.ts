import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "./_shared";

const W = 480;
const H = 640;
const GAP = 170;
const PIPE_W = 70;
const SPEED = 150;

class FlappyScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private orbY = H / 2;
  private vel = 0;
  private pipes: { x: number; gapY: number; scored: boolean }[] = [];
  private spawnAcc = 0;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private overText?: Phaser.GameObjects.Text;
  private state: "ready" | "play" | "dead" = "ready";
  private hint!: Phaser.GameObjects.Text;

  constructor() {
    super("flappy");
  }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, W / 2, 24, "0", 40, "#ffffff").setOrigin(0.5, 0);
    this.hint = this.add
      .text(W / 2, H / 2 + 60, "Click / Space to flap", {
        fontFamily: "system-ui",
        fontStyle: "bold",
        fontSize: "20px",
        color: "#ffd15c",
      })
      .setOrigin(0.5)
      .setDepth(2000);

    const flap = () => this.flap();
    this.input.on("pointerdown", flap);
    this.input.keyboard!.on("keydown-SPACE", flap);
    this.input.keyboard!.on("keydown-UP", flap);
    this.reset();
  }

  reset() {
    this.orbY = H / 2;
    this.vel = 0;
    this.pipes = [];
    this.spawnAcc = 0;
    this.score = 0;
    this.state = "ready";
    this.scoreText.setText("0");
    this.overText?.destroy();
    this.overText = undefined;
    this.hint.setText("Click / Space to flap").setVisible(true);
  }

  flap() {
    if (this.state === "ready") {
      this.state = "play";
      this.hint.setVisible(false);
    }
    if (this.state === "play") this.vel = -300;
    else if (this.state === "dead") this.reset();
  }

  spawnPipe() {
    this.pipes.push({
      x: W + PIPE_W,
      gapY: Phaser.Math.Between(120, H - 120),
      scored: false,
    });
  }

  update(_t: number, dt: number) {
    const d = dt / 1000;
    if (this.state === "play") {
      this.vel += 900 * d;
      this.orbY += this.vel * d;

      this.spawnAcc += dt;
      if (this.spawnAcc > 1500) {
        this.spawnAcc = 0;
        this.spawnPipe();
      }
      this.pipes.forEach((p) => (p.x -= SPEED * d));
      this.pipes = this.pipes.filter((p) => p.x > -PIPE_W);

      for (const p of this.pipes) {
        if (!p.scored && p.x + PIPE_W < W / 2 - 16) {
          p.scored = true;
          this.score++;
          this.scoreText.setText("" + this.score);
        }
        const inX = W / 2 + 16 > p.x && W / 2 - 16 < p.x + PIPE_W;
        const hit = this.orbY - 16 < p.gapY - GAP / 2 || this.orbY + 16 > p.gapY + GAP / 2;
        if (inX && hit) this.die();
      }
      if (this.orbY > H - 16 || this.orbY < 16) this.die();
    }
    this.draw();
  }

  die() {
    if (this.state === "dead") return;
    this.state = "dead";
    this.overText = this.add
      .text(W / 2, H / 2 - 40, `GAME OVER\nScore ${this.score}\nClick to retry`, {
        fontFamily: "system-ui",
        fontStyle: "bold",
        fontSize: "30px",
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
    g.fillGradientStyle(0x1a1030, 0x1a1030, 0x3a1846, 0x5a1e5a, 1);
    g.fillRect(0, 0, W, H);
    // pipes
    this.pipes.forEach((p) => {
      g.fillStyle(0xff8a5c, 1);
      g.fillRoundedRect(p.x, 0, PIPE_W, p.gapY - GAP / 2, 8);
      g.fillRoundedRect(p.x, p.gapY + GAP / 2, PIPE_W, H - (p.gapY + GAP / 2), 8);
      g.fillStyle(0xffd15c, 0.9);
      g.fillRect(p.x - 4, p.gapY - GAP / 2 - 14, PIPE_W + 8, 14);
      g.fillRect(p.x - 4, p.gapY + GAP / 2, PIPE_W + 8, 14);
    });
    // orb
    const tilt = Phaser.Math.Clamp(this.vel / 600, -0.5, 0.6);
    g.fillStyle(0xff5c9d, 0.35).fillCircle(W / 2, this.orbY, 22);
    g.fillStyle(0xffd15c, 1).fillCircle(W / 2, this.orbY, 16);
    g.fillStyle(0xffffff, 0.9).fillCircle(W / 2 - 5, this.orbY - 5 + tilt * 6, 5);
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, FlappyScene));
