import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 460;
const H = 560;
const PADS = [
  { color: 0x00d4ff, x: 0, y: 0 },
  { color: 0xff5c9d, x: 1, y: 0 },
  { color: 0xffd15c, x: 0, y: 1 },
  { color: 0x00ffa3, x: 1, y: 1 },
];
const TOP = 80;
const SIZE = 200;
const GAP = 16;

class MemoryScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private sequence: number[] = [];
  private input_i = 0;
  private lit = -1;
  private state: "idle" | "showing" | "input" | "over" = "idle";
  private round = 0;
  private roundText!: Phaser.GameObjects.Text;
  private hint!: Phaser.GameObjects.Text;

  constructor() {
    super("memory");
  }

  create() {
    this.gfx = this.add.graphics();
    this.roundText = hudText(this, W / 2, 20, "Round 0", 26, "#00d4ff").setOrigin(0.5, 0);
    this.hint = this.add
      .text(W / 2, H - 40, "Click to start", {
        fontFamily: "system-ui",
        fontStyle: "bold",
        fontSize: "20px",
        color: "#9a9ab0",
      })
      .setOrigin(0.5)
      .setDepth(2000);

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => this.onClick(p));
    this.draw();
  }

  padRect(i: number) {
    const p = PADS[i];
    const totalW = SIZE * 2 + GAP;
    const startX = (W - totalW) / 2;
    return { x: startX + p.x * (SIZE + GAP), y: TOP + p.y * (SIZE + GAP), w: SIZE, h: SIZE };
  }

  onClick(p: Phaser.Input.Pointer) {
    if (this.state === "idle" || this.state === "over") {
      this.startGame();
      return;
    }
    if (this.state !== "input") return;
    for (let i = 0; i < 4; i++) {
      const r = this.padRect(i);
      if (p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) {
        this.flash(i);
        if (this.sequence[this.input_i] === i) {
          this.input_i++;
          if (this.input_i >= this.sequence.length) {
            this.state = "idle";
            this.time.delayedCall(600, () => this.nextRound());
          }
        } else {
          this.gameOver();
        }
        return;
      }
    }
  }

  startGame() {
    this.sequence = [];
    this.round = 0;
    this.hint.setText("Watch...");
    this.nextRound();
  }

  nextRound() {
    this.round++;
    this.roundText.setText("Round " + this.round);
    this.sequence.push(Phaser.Math.Between(0, 3));
    this.playSequence();
  }

  playSequence() {
    this.state = "showing";
    this.hint.setText("Watch the pattern");
    let i = 0;
    const showNext = () => {
      if (i >= this.sequence.length) {
        this.state = "input";
        this.input_i = 0;
        this.hint.setText("Your turn!");
        return;
      }
      this.flash(this.sequence[i]);
      i++;
      this.time.delayedCall(650, showNext);
    };
    this.time.delayedCall(500, showNext);
  }

  flash(i: number) {
    this.lit = i;
    this.draw();
    this.time.delayedCall(320, () => {
      this.lit = -1;
      this.draw();
    });
  }

  gameOver() {
    this.state = "over";
    this.hint.setText(`Wrong! Reached round ${this.round}. Click to retry`);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0d0d18, 1).fillRect(0, 0, W, H);
    for (let i = 0; i < 4; i++) {
      const r = this.padRect(i);
      const on = this.lit === i;
      g.fillStyle(PADS[i].color, on ? 1 : 0.28);
      g.fillRoundedRect(r.x, r.y, r.w, r.h, 18);
      if (on) {
        g.lineStyle(4, 0xffffff, 0.8);
        g.strokeRoundedRect(r.x, r.y, r.w, r.h, 18);
      }
    }
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, MemoryScene));
