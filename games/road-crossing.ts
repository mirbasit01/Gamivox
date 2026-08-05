import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "./_shared";

const W = 480;
const H = 560;
const CELL = 56; // step size / lane height
const ROWS = 10; // total rows (0 = bottom safe ... top safe)
const PLAYER_R = 18;

interface Car {
  x: number;
  w: number;
}

interface Lane {
  y: number;
  dir: number; // +1 right, -1 left
  speed: number;
  cars: Car[];
}

class RoadScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private col = Math.floor(W / CELL / 2);
  private row = 0; // 0 = bottom
  private lanes: Lane[] = [];
  private score = 0;
  private difficulty = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private overText?: Phaser.GameObjects.Text;
  private state: "play" | "dead" = "play";
  private downPos = { x: 0, y: 0 };
  private topSafeY = 0;

  constructor() {
    super("road");
  }

  private rowY(row: number): number {
    // row 0 bottom -> y near bottom; higher row -> higher up
    return H - CELL / 2 - row * CELL;
  }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 14, 12, "0", 24, "#ffffff");

    const kb = this.input.keyboard!;
    kb.on("keydown-UP", () => this.move(0, 1));
    kb.on("keydown-DOWN", () => this.move(0, -1));
    kb.on("keydown-LEFT", () => this.move(-1, 0));
    kb.on("keydown-RIGHT", () => this.move(1, 0));

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      this.downPos = { x: p.x, y: p.y };
    });
    this.input.on("pointerup", (p: Phaser.Input.Pointer) => this.onPointerUp(p));

    this.reset();
  }

  reset() {
    this.col = Math.floor(W / CELL / 2);
    this.row = 0;
    this.score = 0;
    this.difficulty = 0;
    this.state = "play";
    this.scoreText.setText("0");
    this.overText?.destroy();
    this.overText = undefined;
    this.buildLanes();
  }

  buildLanes() {
    this.lanes = [];
    // lanes occupy rows 1 .. ROWS-2 (row 0 bottom safe, top row safe)
    for (let r = 1; r <= ROWS - 2; r++) {
      const dir = r % 2 === 0 ? 1 : -1;
      const speed = (60 + Phaser.Math.Between(0, 50) + this.difficulty * 12) * dir;
      const cars: Car[] = [];
      const count = Phaser.Math.Between(2, 3);
      const gap = W / count;
      for (let i = 0; i < count; i++) {
        cars.push({ x: i * gap + Phaser.Math.Between(0, 30), w: Phaser.Math.Between(52, 74) });
      }
      this.lanes.push({ y: this.rowY(r), dir, speed, cars });
    }
    this.topSafeY = this.rowY(ROWS - 1);
  }

  move(dx: number, dy: number) {
    if (this.state === "dead") return;
    const newCol = Phaser.Math.Clamp(this.col + dx, 0, Math.floor(W / CELL) - 1);
    const newRow = Phaser.Math.Clamp(this.row + dy, 0, ROWS - 1);
    this.col = newCol;
    this.row = newRow;
    if (this.row >= ROWS - 1) this.reachTop();
  }

  onPointerUp(p: Phaser.Input.Pointer) {
    if (this.state === "dead") {
      this.reset();
      return;
    }
    const dx = p.x - this.downPos.x;
    const dy = p.y - this.downPos.y;
    const adx = Math.abs(dx);
    const ady = Math.abs(dy);
    if (adx < 20 && ady < 20) {
      // tap: hop up if in upper area, else move toward tap horizontally
      if (p.y < H * 0.6) this.move(0, 1);
      else this.move(p.x < this.playerX() ? -1 : 1, 0);
      return;
    }
    if (adx > ady) this.move(dx > 0 ? 1 : -1, 0);
    else this.move(0, dy < 0 ? 1 : -1); // swipe up = up
  }

  reachTop() {
    this.score++;
    this.difficulty++;
    this.scoreText.setText("" + this.score);
    this.col = Math.floor(W / CELL / 2);
    this.row = 0;
    this.buildLanes();
  }

  private playerX(): number {
    return this.col * CELL + CELL / 2;
  }

  update(_t: number, dt: number) {
    const d = dt / 1000;
    if (this.state === "play") {
      // move cars
      this.lanes.forEach((lane) => {
        lane.cars.forEach((car) => {
          car.x += lane.speed * d;
          if (lane.speed > 0 && car.x - car.w / 2 > W) car.x = -car.w / 2;
          else if (lane.speed < 0 && car.x + car.w / 2 < 0) car.x = W + car.w / 2;
        });
      });

      // collision
      const py = this.rowY(this.row);
      const pxc = this.playerX();
      for (const lane of this.lanes) {
        if (Math.abs(lane.y - py) > 4) continue;
        for (const car of lane.cars) {
          const overlapX = Math.abs(car.x - pxc) < car.w / 2 + PLAYER_R * 0.7;
          if (overlapX) {
            this.die();
            break;
          }
        }
      }
    }
    this.draw();
  }

  die() {
    if (this.state === "dead") return;
    this.state = "dead";
    this.overText = this.add
      .text(W / 2, H / 2, `GAME OVER\nScore ${this.score}\nTap to retry`, {
        fontFamily: "system-ui, sans-serif",
        fontStyle: "bold",
        fontSize: "28px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5)
      .setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillRect(0, 0, W, H);

    // rows
    for (let r = 0; r < ROWS; r++) {
      const cy = this.rowY(r);
      const top = cy - CELL / 2;
      if (r === 0) g.fillStyle(0x1c4a3a, 1); // bottom safe grass
      else if (r === ROWS - 1) g.fillStyle(0x1c4a3a, 1); // top safe
      else g.fillStyle(r % 2 === 0 ? 0x1a1a26 : 0x22222f, 1); // road
      g.fillRect(0, top, W, CELL);
      // lane dashes
      if (r >= 1 && r <= ROWS - 2) {
        g.fillStyle(0x44476b, 0.7);
        for (let x = 10; x < W; x += 44) g.fillRect(x, cy - 2, 22, 4);
      }
    }

    // cars
    this.lanes.forEach((lane) => {
      lane.cars.forEach((car) => {
        const color = lane.dir > 0 ? 0xff8a5c : 0x5cc8ff;
        g.fillStyle(color, 1);
        g.fillRoundedRect(car.x - car.w / 2, lane.y - 18, car.w, 36, 8);
        g.fillStyle(0xffffff, 0.8);
        g.fillRoundedRect(car.x - car.w / 2 + 8, lane.y - 10, car.w - 16, 8, 3);
        // wheels
        g.fillStyle(0x101010, 1);
        g.fillCircle(car.x - car.w / 2 + 12, lane.y + 18, 5);
        g.fillCircle(car.x + car.w / 2 - 12, lane.y + 18, 5);
      });
    });

    // player frog
    const px = this.playerX();
    const py = this.rowY(this.row);
    g.fillStyle(0x6cf0c2, 0.3).fillCircle(px, py, PLAYER_R + 5);
    g.fillStyle(0x4fd67e, 1).fillCircle(px, py, PLAYER_R);
    g.fillStyle(0xffffff, 1).fillCircle(px - 7, py - 7, 5);
    g.fillStyle(0xffffff, 1).fillCircle(px + 7, py - 7, 5);
    g.fillStyle(0x101010, 1).fillCircle(px - 7, py - 7, 2);
    g.fillStyle(0x101010, 1).fillCircle(px + 7, py - 7, 2);
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, RoadScene));
