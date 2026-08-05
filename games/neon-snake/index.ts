import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const CELL = 24;
const COLS = 20;
const ROWS = 20;
const HUD = 48;
const W = CELL * COLS;
const H = CELL * ROWS + HUD;

class SnakeScene extends Phaser.Scene {
  private snake: { x: number; y: number }[] = [];
  private dir = { x: 1, y: 0 };
  private nextDir = { x: 1, y: 0 };
  private food = { x: 10, y: 10 };
  private gfx!: Phaser.GameObjects.Graphics;
  private scoreText!: Phaser.GameObjects.Text;
  private overText?: Phaser.GameObjects.Text;
  private acc = 0;
  private step = 110;
  private score = 0;
  private alive = true;

  constructor() {
    super("snake");
  }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 14, "Score 0", 22, "#00ffa3");
    hudText(this, W - 130, 16, "NEON SNAKE", 16, "#3a3a55");
    this.reset();

    this.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((k === "arrowup" || k === "w") && this.dir.y === 0) this.nextDir = { x: 0, y: -1 };
      else if ((k === "arrowdown" || k === "s") && this.dir.y === 0) this.nextDir = { x: 0, y: 1 };
      else if ((k === "arrowleft" || k === "a") && this.dir.x === 0) this.nextDir = { x: -1, y: 0 };
      else if ((k === "arrowright" || k === "d") && this.dir.x === 0) this.nextDir = { x: 1, y: 0 };
      else if (k === " " && !this.alive) this.reset();
    });

    // Touch / swipe controls for mobile
    this.input.on("pointerup", (p: Phaser.Input.Pointer) => {
      const dx = p.x - p.downX;
      const dy = p.y - p.downY;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) {
        if (!this.alive) this.reset();
        return;
      }
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && this.dir.x === 0) this.nextDir = { x: 1, y: 0 };
        else if (dx < 0 && this.dir.x === 0) this.nextDir = { x: -1, y: 0 };
      } else {
        if (dy > 0 && this.dir.y === 0) this.nextDir = { x: 0, y: 1 };
        else if (dy < 0 && this.dir.y === 0) this.nextDir = { x: 0, y: -1 };
      }
    });
  }

  reset() {
    this.snake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 },
    ];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.score = 0;
    this.step = 110;
    this.alive = true;
    this.placeFood();
    this.overText?.destroy();
    this.overText = undefined;
    this.scoreText.setText("Score 0");
  }

  placeFood() {
    while (true) {
      const fx = Phaser.Math.Between(0, COLS - 1);
      const fy = Phaser.Math.Between(0, ROWS - 1);
      if (!this.snake.some((s) => s.x === fx && s.y === fy)) {
        this.food = { x: fx, y: fy };
        return;
      }
    }
  }

  update(_t: number, dt: number) {
    if (!this.alive) return;
    this.acc += dt;
    if (this.acc < this.step) {
      this.draw();
      return;
    }
    this.acc = 0;
    this.dir = this.nextDir;
    const head = {
      x: this.snake[0].x + this.dir.x,
      y: this.snake[0].y + this.dir.y,
    };
    if (
      head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
      this.snake.some((s) => s.x === head.x && s.y === head.y)
    ) {
      this.gameOver();
      return;
    }
    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.scoreText.setText("Score " + this.score);
      this.step = Math.max(55, this.step - 3);
      this.placeFood();
    } else {
      this.snake.pop();
    }
    this.draw();
  }

  draw() {
    const g = this.gfx;
    g.clear();
    // board
    g.fillStyle(0x11111c, 1).fillRect(0, HUD, W, ROWS * CELL);
    g.lineStyle(1, 0x1e1e30, 1);
    for (let c = 0; c <= COLS; c++) g.lineBetween(c * CELL, HUD, c * CELL, H);
    for (let r = 0; r <= ROWS; r++) g.lineBetween(0, HUD + r * CELL, W, HUD + r * CELL);
    // food
    g.fillStyle(0xff5c9d, 1).fillCircle(
      this.food.x * CELL + CELL / 2,
      HUD + this.food.y * CELL + CELL / 2,
      CELL / 2 - 3
    );
    // snake
    this.snake.forEach((s, i) => {
      const t = 1 - i / (this.snake.length + 4);
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        new Phaser.Display.Color(0, 179, 255),
        new Phaser.Display.Color(0, 255, 163),
        this.snake.length,
        i
      );
      g.fillStyle(
        Phaser.Display.Color.GetColor(color.r, color.g, color.b),
        0.4 + 0.6 * t
      );
      g.fillRoundedRect(s.x * CELL + 2, HUD + s.y * CELL + 2, CELL - 4, CELL - 4, 6);
    });
  }

  gameOver() {
    this.alive = false;
    this.overText = this.add
      .text(W / 2, H / 2, `GAME OVER\nScore ${this.score}\nPress Space`, {
        fontFamily: "system-ui",
        fontStyle: "bold",
        fontSize: "30px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(2000);
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, SnakeScene));
