import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 520;
const H = 640;
const PADDLE_W = 100;
const PADDLE_H = 16;
const BALL_R = 8;
const COLS = 8;
const ROWS = 5;
const BRICK_COLORS = [0x7c5cff, 0x5c8bff, 0x00d4ff, 0x00ffa3, 0xffd15c];

type Brick = { x: number; y: number; w: number; h: number; alive: boolean; color: number };

class BrickScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private paddleX = W / 2;
  private ball = { x: W / 2, y: H - 80, vx: 220, vy: -320 };
  private bricks: Brick[] = [];
  private score = 0;
  private lives = 3;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private state: "ready" | "play" | "over" | "win" = "ready";
  private hint!: Phaser.GameObjects.Text;

  constructor() {
    super("brick");
  }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 12, "Score 0", 20, "#00d4ff");
    this.livesText = hudText(this, W - 110, 12, "Lives 3", 20, "#ff5c9d");
    this.hint = this.add
      .text(W / 2, H / 2, "Move mouse · Click to launch", {
        fontFamily: "system-ui",
        fontStyle: "bold",
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setDepth(2000);

    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      this.paddleX = Phaser.Math.Clamp(p.x, PADDLE_W / 2, W - PADDLE_W / 2);
    });
    this.input.keyboard!.on("keydown-LEFT", () => (this.paddleX = Math.max(PADDLE_W / 2, this.paddleX - 40)));
    this.input.keyboard!.on("keydown-RIGHT", () => (this.paddleX = Math.min(W - PADDLE_W / 2, this.paddleX + 40)));
    this.input.on("pointerdown", () => {
      if (this.state === "ready") this.state = "play";
      else if (this.state === "over" || this.state === "win") this.resetAll();
    });

    this.buildBricks();
    this.resetBall();
  }

  buildBricks() {
    this.bricks = [];
    const pad = 8;
    const bw = (W - pad * (COLS + 1)) / COLS;
    const bh = 22;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        this.bricks.push({
          x: pad + c * (bw + pad),
          y: 50 + r * (bh + pad),
          w: bw,
          h: bh,
          alive: true,
          color: BRICK_COLORS[r % BRICK_COLORS.length],
        });
      }
    }
  }

  resetBall() {
    this.ball = { x: this.paddleX, y: H - 80, vx: Phaser.Math.Between(-180, 180), vy: -340 };
  }

  resetAll() {
    this.score = 0;
    this.lives = 3;
    this.state = "ready";
    this.buildBricks();
    this.resetBall();
    this.scoreText.setText("Score 0");
    this.livesText.setText("Lives 3");
    this.hint.setText("Move mouse · Click to launch").setVisible(true);
  }

  update(_t: number, dt: number) {
    const d = dt / 1000;
    if (this.state === "ready") {
      this.ball.x = this.paddleX;
    } else if (this.state === "play") {
      this.hint.setVisible(false);
      this.ball.x += this.ball.vx * d;
      this.ball.y += this.ball.vy * d;

      if (this.ball.x < BALL_R) { this.ball.x = BALL_R; this.ball.vx *= -1; }
      if (this.ball.x > W - BALL_R) { this.ball.x = W - BALL_R; this.ball.vx *= -1; }
      if (this.ball.y < BALL_R + 40) { this.ball.y = BALL_R + 40; this.ball.vy *= -1; }

      // paddle
      const py = H - 40;
      if (
        this.ball.y + BALL_R > py &&
        this.ball.y < py + PADDLE_H &&
        this.ball.x > this.paddleX - PADDLE_W / 2 &&
        this.ball.x < this.paddleX + PADDLE_W / 2 &&
        this.ball.vy > 0
      ) {
        this.ball.vy = -Math.abs(this.ball.vy);
        this.ball.vx = ((this.ball.x - this.paddleX) / (PADDLE_W / 2)) * 300;
      }

      // bricks
      for (const b of this.bricks) {
        if (!b.alive) continue;
        if (
          this.ball.x > b.x - BALL_R && this.ball.x < b.x + b.w + BALL_R &&
          this.ball.y > b.y - BALL_R && this.ball.y < b.y + b.h + BALL_R
        ) {
          b.alive = false;
          this.ball.vy *= -1;
          this.score += 10;
          this.scoreText.setText("Score " + this.score);
          break;
        }
      }

      if (this.bricks.every((b) => !b.alive)) {
        this.state = "win";
        this.showEnd("YOU WIN!\nScore " + this.score + "\nClick to play again");
      }

      if (this.ball.y > H) {
        this.lives--;
        this.livesText.setText("Lives " + this.lives);
        if (this.lives <= 0) {
          this.state = "over";
          this.showEnd("GAME OVER\nScore " + this.score + "\nClick to retry");
        } else {
          this.state = "ready";
          this.resetBall();
        }
      }
    }
    this.draw();
  }

  showEnd(msg: string) {
    this.hint.setText(msg).setVisible(true);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0d0d18, 1).fillRect(0, 0, W, H);
    // bricks
    for (const b of this.bricks) {
      if (!b.alive) continue;
      g.fillStyle(b.color, 0.25).fillRoundedRect(b.x - 1, b.y - 1, b.w + 2, b.h + 2, 5);
      g.fillStyle(b.color, 1).fillRoundedRect(b.x, b.y, b.w, b.h, 4);
    }
    // paddle
    g.fillStyle(0xffffff, 1).fillRoundedRect(this.paddleX - PADDLE_W / 2, H - 40, PADDLE_W, PADDLE_H, 8);
    // ball
    g.fillStyle(0x00d4ff, 0.3).fillCircle(this.ball.x, this.ball.y, BALL_R + 5);
    g.fillStyle(0xffffff, 1).fillCircle(this.ball.x, this.ball.y, BALL_R);
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, BrickScene));
