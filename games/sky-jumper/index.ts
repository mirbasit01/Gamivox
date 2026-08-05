import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 420;
const H = 640;
const GRAVITY = 1400;
const BOUNCE_VEL = -720;
const PLAT_W = 74;
const PLAT_H = 16;
const PLAYER_R = 18;
const MID_LINE = H * 0.42;

interface Platform {
  x: number;
  y: number;
}

class SkyJumpScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private px = W / 2;
  private py = H - 120;
  private vy = 0;
  private vx = 0;
  private platforms: Platform[] = [];
  private highest = 0; // world height climbed (positive up)
  private worldY = 0; // total scrolled amount
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private overText?: Phaser.GameObjects.Text;
  private state: "play" | "dead" = "play";
  private keys!: {
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
  };
  private dragging = false;

  constructor() {
    super("skyjump");
  }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 14, 12, "0", 24, "#ffffff");

    const kb = this.input.keyboard!;
    this.keys = {
      left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      a: kb.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      d: kb.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.state === "dead") {
        this.reset();
        return;
      }
      this.dragging = true;
      this.px = p.x;
    });
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (this.dragging && this.state === "play") this.px = p.x;
    });
    this.input.on("pointerup", () => (this.dragging = false));

    this.reset();
  }

  reset() {
    this.px = W / 2;
    this.py = H - 120;
    this.vy = BOUNCE_VEL;
    this.vx = 0;
    this.worldY = 0;
    this.highest = 0;
    this.score = 0;
    this.state = "play";
    this.dragging = false;
    this.scoreText.setText("0");
    this.overText?.destroy();
    this.overText = undefined;

    // starting platforms
    this.platforms = [{ x: W / 2, y: H - 60 }];
    let y = H - 60;
    while (y > -40) {
      y -= Phaser.Math.Between(70, 110);
      this.platforms.push({ x: Phaser.Math.Between(PLAT_W / 2, W - PLAT_W / 2), y });
    }
  }

  update(_t: number, dt: number) {
    const d = dt / 1000;
    if (this.state === "play") {
      // horizontal input
      const left = this.keys.left.isDown || this.keys.a.isDown;
      const right = this.keys.right.isDown || this.keys.d.isDown;
      if (!this.dragging) {
        if (left) this.px -= 320 * d;
        else if (right) this.px += 320 * d;
      }
      // horizontal wrap
      if (this.px < -PLAYER_R) this.px = W + PLAYER_R;
      else if (this.px > W + PLAYER_R) this.px = -PLAYER_R;

      // gravity
      this.vy += GRAVITY * d;
      this.py += this.vy * d;

      // landing on platforms (only when falling)
      if (this.vy > 0) {
        for (const p of this.platforms) {
          const withinX = Math.abs(this.px - p.x) < PLAT_W / 2 + PLAYER_R * 0.5;
          const feet = this.py + PLAYER_R;
          if (withinX && feet >= p.y && feet <= p.y + PLAT_H + this.vy * d) {
            this.vy = BOUNCE_VEL;
            this.py = p.y - PLAYER_R;
          }
        }
      }

      // scroll world down when rising above mid-line
      if (this.py < MID_LINE) {
        const dy = MID_LINE - this.py;
        this.py = MID_LINE;
        this.worldY += dy;
        this.platforms.forEach((p) => (p.y += dy));
        this.highest = Math.max(this.highest, this.worldY);
        this.score = Math.floor(this.worldY / 10);
        this.scoreText.setText("" + this.score);
      }

      // remove platforms that fell off bottom, spawn new above
      this.platforms = this.platforms.filter((p) => p.y < H + 40);
      let topY = Math.min(...this.platforms.map((p) => p.y));
      while (topY > -40) {
        const gap = Phaser.Math.Between(70, 120);
        topY -= gap;
        this.platforms.push({ x: Phaser.Math.Between(PLAT_W / 2, W - PLAT_W / 2), y: topY });
      }

      // fall death
      if (this.py - PLAYER_R > H) this.die();
    }
    this.draw();
  }

  die() {
    if (this.state === "dead") return;
    this.state = "dead";
    this.overText = this.add
      .text(W / 2, H / 2, `GAME OVER\nHeight ${this.score}\nTap to retry`, {
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
    g.fillGradientStyle(0x0d1030, 0x0d1030, 0x241653, 0x3a1f66, 1);
    g.fillRect(0, 0, W, H);

    // platforms
    this.platforms.forEach((p) => {
      g.fillStyle(0x6cf0c2, 1);
      g.fillRoundedRect(p.x - PLAT_W / 2, p.y, PLAT_W, PLAT_H, 6);
      g.fillStyle(0x33c99a, 1);
      g.fillRoundedRect(p.x - PLAT_W / 2, p.y + PLAT_H - 5, PLAT_W, 5, 3);
    });

    // player
    g.fillStyle(0xff5c9d, 0.3).fillCircle(this.px, this.py, PLAYER_R + 6);
    g.fillStyle(0xffd15c, 1).fillCircle(this.px, this.py, PLAYER_R);
    g.fillStyle(0x101026, 1).fillCircle(this.px + 5, this.py - 4, 3);
    g.fillStyle(0x101026, 1).fillCircle(this.px - 5, this.py - 4, 3);
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, SkyJumpScene));
