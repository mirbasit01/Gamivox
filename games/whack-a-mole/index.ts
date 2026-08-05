import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480;
const H = 520;
const COLS = 3;
const ROWS = 3;
const GAME_TIME = 30; // seconds

interface Hole {
  x: number;
  y: number;
  active: boolean;
  timeLeft: number;
}

class WhackScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private holes: Hole[] = [];
  private score = 0;
  private timeLeft = GAME_TIME;
  private spawnAcc = 0;
  private nextSpawn = 900;
  private scoreText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private overText?: Phaser.GameObjects.Text;
  private state: "play" | "over" = "play";
  private readonly holeR = 56;

  constructor() {
    super("whack");
  }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 14, 12, "Score 0", 22, "#ffffff");
    this.timeText = hudText(this, W - 14, 12, "Time 30", 22, "#ffd15c").setOrigin(1, 0);

    // build grid layout
    const marginX = 60;
    const marginTop = 90;
    const gapX = (W - marginX * 2) / (COLS - 1);
    const gapY = (H - marginTop - 40) / (ROWS - 1);
    this.holes = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        this.holes.push({
          x: marginX + c * gapX,
          y: marginTop + r * gapY,
          active: false,
          timeLeft: 0,
        });
      }
    }

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => this.onTap(p));
    this.reset();
  }

  reset() {
    this.score = 0;
    this.timeLeft = GAME_TIME;
    this.spawnAcc = 0;
    this.nextSpawn = 900;
    this.state = "play";
    this.holes.forEach((h) => {
      h.active = false;
      h.timeLeft = 0;
    });
    this.scoreText.setText("Score 0");
    this.timeText.setText("Time 30");
    this.overText?.destroy();
    this.overText = undefined;
  }

  onTap(p: Phaser.Input.Pointer) {
    if (this.state === "over") {
      this.reset();
      return;
    }
    for (const h of this.holes) {
      if (!h.active) continue;
      const dx = p.x - h.x;
      const dy = p.y - (h.y - 10);
      if (dx * dx + dy * dy <= this.holeR * this.holeR) {
        h.active = false;
        h.timeLeft = 0;
        this.score++;
        this.scoreText.setText("Score " + this.score);
        break;
      }
    }
  }

  spawnMole() {
    const empty = this.holes.filter((h) => !h.active);
    if (empty.length === 0) return;
    const h = Phaser.Utils.Array.GetRandom(empty) as Hole;
    h.active = true;
    // moles stay shorter as time passes (harder)
    const elapsed = GAME_TIME - this.timeLeft;
    h.timeLeft = Math.max(600, 1200 - elapsed * 25);
  }

  update(_t: number, dt: number) {
    if (this.state === "play") {
      // countdown
      this.timeLeft -= dt / 1000;
      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.endGame();
      } else {
        this.timeText.setText("Time " + Math.ceil(this.timeLeft));
      }

      // mole lifetimes
      this.holes.forEach((h) => {
        if (h.active) {
          h.timeLeft -= dt;
          if (h.timeLeft <= 0) h.active = false;
        }
      });

      // spawn
      this.spawnAcc += dt;
      if (this.spawnAcc >= this.nextSpawn) {
        this.spawnAcc = 0;
        const elapsed = GAME_TIME - this.timeLeft;
        this.nextSpawn = Math.max(350, 900 - elapsed * 18);
        this.spawnMole();
      }
    }
    this.draw();
  }

  endGame() {
    this.state = "over";
    this.timeText.setText("Time 0");
    this.holes.forEach((h) => (h.active = false));
    this.overText = this.add
      .text(W / 2, H / 2, `Time's up!\nScore ${this.score}\nTap to play again`, {
        fontFamily: "system-ui, sans-serif",
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
    g.fillGradientStyle(0x0d1030, 0x0d1030, 0x18324a, 0x1c4a3a, 1);
    g.fillRect(0, 0, W, H);

    this.holes.forEach((h) => {
      // hole (ellipse-ish via arc scaled) - use filled circle for dirt
      g.fillStyle(0x0a1a12, 1);
      g.fillEllipse(h.x, h.y + 14, this.holeR * 2, this.holeR * 0.9);
      g.fillStyle(0x14261a, 1);
      g.fillEllipse(h.x, h.y + 14, this.holeR * 1.7, this.holeR * 0.7);

      if (h.active) {
        // mole body
        g.fillStyle(0x9c6b3f, 1);
        g.fillCircle(h.x, h.y - 8, this.holeR * 0.7);
        g.fillStyle(0xbf8a5a, 1);
        g.fillEllipse(h.x, h.y + 2, this.holeR * 0.9, this.holeR * 0.7);
        // eyes
        g.fillStyle(0x101010, 1);
        g.fillCircle(h.x - 14, h.y - 12, 5);
        g.fillCircle(h.x + 14, h.y - 12, 5);
        // nose
        g.fillStyle(0xff5c9d, 1);
        g.fillCircle(h.x, h.y + 2, 6);
      }
    });
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, WhackScene));
