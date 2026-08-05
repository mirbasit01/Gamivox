import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "./_shared";

const W = 640;
const H = 420;
const PADDLE_W = 14;
const PADDLE_H = 84;
const BALL_R = 9;
const PADDLE_X = 24; // left paddle x (right edge region mirrored)
const WIN_SCORE = 5;
const BASE_SPEED = 300;

class PongScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private scoreText!: Phaser.GameObjects.Text;
  private overText?: Phaser.GameObjects.Text;

  private leftY = H / 2;
  private rightY = H / 2;
  private ballX = W / 2;
  private ballY = H / 2;
  private ballVX = BASE_SPEED;
  private ballVY = 60;
  private speed = BASE_SPEED;

  private playerScore = 0;
  private aiScore = 0;
  private over = false;

  private keys!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    w: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
  };
  private pointerActive = false;
  private pointerY = H / 2;

  constructor() {
    super("pong");
  }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, W / 2, 16, "You  0 : 0  AI", 24, "#ffffff");
    this.scoreText.setOrigin(0.5, 0);

    const kb = this.input.keyboard!;
    this.keys = {
      up: kb.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      down: kb.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
      w: kb.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      s: kb.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    };

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.over) {
        this.restart();
        return;
      }
      this.pointerActive = true;
      this.pointerY = p.y;
    });
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (p.isDown) {
        this.pointerActive = true;
        this.pointerY = p.y;
      }
    });
    this.input.on("pointerup", () => {
      this.pointerActive = false;
    });

    this.resetRound(1);
    this.render();
  }

  private restart() {
    this.playerScore = 0;
    this.aiScore = 0;
    this.over = false;
    this.overText?.destroy();
    this.overText = undefined;
    this.scoreText.setText("You  0 : 0  AI");
    this.resetRound(Math.random() < 0.5 ? 1 : -1);
  }

  private resetRound(dir: number) {
    this.ballX = W / 2;
    this.ballY = H / 2;
    this.speed = BASE_SPEED;
    const angle = Phaser.Math.FloatBetween(-0.35, 0.35);
    this.ballVX = Math.cos(angle) * this.speed * dir;
    this.ballVY = Math.sin(angle) * this.speed;
  }

  update(_t: number, dtMs: number) {
    if (this.over) return;
    const dt = dtMs / 1000;

    // ---- Player paddle ----
    const kSpeed = 460;
    let moved = false;
    if (this.keys.up.isDown || this.keys.w.isDown) {
      this.leftY -= kSpeed * dt;
      moved = true;
    }
    if (this.keys.down.isDown || this.keys.s.isDown) {
      this.leftY += kSpeed * dt;
      moved = true;
    }
    if (!moved && this.pointerActive) {
      this.leftY = Phaser.Math.Linear(this.leftY, this.pointerY, 0.3);
    }
    this.leftY = Phaser.Math.Clamp(this.leftY, PADDLE_H / 2, H - PADDLE_H / 2);

    // ---- AI paddle: ease toward ball ----
    const aiSpeed = 4.2 * dt;
    this.rightY = Phaser.Math.Linear(this.rightY, this.ballY, Phaser.Math.Clamp(aiSpeed, 0, 1));
    this.rightY = Phaser.Math.Clamp(this.rightY, PADDLE_H / 2, H - PADDLE_H / 2);

    // ---- Ball ----
    this.ballX += this.ballVX * dt;
    this.ballY += this.ballVY * dt;

    // top/bottom bounce
    if (this.ballY - BALL_R <= 0) {
      this.ballY = BALL_R;
      this.ballVY = Math.abs(this.ballVY);
    } else if (this.ballY + BALL_R >= H) {
      this.ballY = H - BALL_R;
      this.ballVY = -Math.abs(this.ballVY);
    }

    // left paddle collision
    const leftEdge = PADDLE_X + PADDLE_W;
    if (
      this.ballVX < 0 &&
      this.ballX - BALL_R <= leftEdge &&
      this.ballX - BALL_R >= PADDLE_X - 6 &&
      this.ballY >= this.leftY - PADDLE_H / 2 &&
      this.ballY <= this.leftY + PADDLE_H / 2
    ) {
      this.ballX = leftEdge + BALL_R;
      this.bounceOffPaddle(this.leftY, 1);
    }

    // right paddle collision
    const rightPaddleX = W - PADDLE_X - PADDLE_W;
    if (
      this.ballVX > 0 &&
      this.ballX + BALL_R >= rightPaddleX &&
      this.ballX + BALL_R <= rightPaddleX + PADDLE_W + 6 &&
      this.ballY >= this.rightY - PADDLE_H / 2 &&
      this.ballY <= this.rightY + PADDLE_H / 2
    ) {
      this.ballX = rightPaddleX - BALL_R;
      this.bounceOffPaddle(this.rightY, -1);
    }

    // scoring
    if (this.ballX + BALL_R < 0) {
      this.aiScore++;
      this.afterPoint(1);
    } else if (this.ballX - BALL_R > W) {
      this.playerScore++;
      this.afterPoint(-1);
    }

    this.render();
  }

  private bounceOffPaddle(paddleY: number, dir: number) {
    // angle depends on hit offset
    const offset = (this.ballY - paddleY) / (PADDLE_H / 2); // -1..1
    this.speed = Math.min(this.speed * 1.06, 720);
    const maxAngle = Phaser.Math.DegToRad(55);
    const angle = offset * maxAngle;
    this.ballVX = Math.cos(angle) * this.speed * dir;
    this.ballVY = Math.sin(angle) * this.speed;
  }

  private afterPoint(dir: number) {
    this.scoreText.setText(`You  ${this.playerScore} : ${this.aiScore}  AI`);
    if (this.playerScore >= WIN_SCORE || this.aiScore >= WIN_SCORE) {
      this.gameOver();
    } else {
      this.resetRound(dir);
    }
  }

  private gameOver() {
    this.over = true;
    const won = this.playerScore >= WIN_SCORE;
    this.overText = this.add
      .text(W / 2, H / 2, `${won ? "You win!" : "AI wins!"}\nTap to restart`, {
        fontFamily: "system-ui",
        fontStyle: "bold",
        fontSize: "40px",
        color: won ? "#00ffa3" : "#ff5c6e",
        align: "center",
        backgroundColor: "#000000cc",
        padding: { x: 24, y: 18 },
      })
      .setOrigin(0.5)
      .setDepth(2000);
  }

  private render() {
    const g = this.gfx;
    g.clear();

    // center dashed line
    g.fillStyle(0x2a2a3d, 1);
    for (let y = 8; y < H; y += 28) {
      g.fillRect(W / 2 - 2, y, 4, 16);
    }

    // paddles
    g.fillStyle(0x00d4ff, 1);
    g.fillRoundedRect(PADDLE_X, this.leftY - PADDLE_H / 2, PADDLE_W, PADDLE_H, 5);
    g.fillStyle(0xff5c6e, 1);
    g.fillRoundedRect(W - PADDLE_X - PADDLE_W, this.rightY - PADDLE_H / 2, PADDLE_W, PADDLE_H, 5);

    // ball
    g.fillStyle(0xffffff, 1);
    g.fillCircle(this.ballX, this.ballY, BALL_R);
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, PongScene));
