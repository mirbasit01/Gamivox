import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 480, HUD = 60;
const COLORS = [0xff3b4e, 0x00d4ff, 0xffd15c, 0x00ffa3];
const PADS = 4;

class SimonSaysScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private sequence: number[] = [];
  private playerIdx = 0;
  private phase: "show" | "input" | "over" = "show";
  private showIdx = 0;
  private showAcc = 0;
  private lit = -1;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private padFlash: number[] = [0, 0, 0, 0];

  constructor() { super("simonsays"); }

  create() {
    this.gfx = this.add.graphics();
    hudText(this, W / 2, 16, "Simon Says", 22, "#c94bff").setOrigin(0.5, 0);
    this.scoreText = hudText(this, W / 2, HUD + 10, "Round 0", 20, "#ffffff").setOrigin(0.5, 0);
    this.statusText = hudText(this, W / 2, H - 30, "Watch the pattern...", 16, "#888899").setOrigin(0.5);
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.phase === "over") { this.reset(); return; }
      if (this.phase !== "input") return;
      const pad = this.getPadAt(p.x, p.y);
      if (pad < 0) return;
      this.padFlash[pad] = 200;
      if (pad === this.sequence[this.playerIdx]) {
        this.playerIdx++;
        if (this.playerIdx >= this.sequence.length) { this.score++; this.scoreText.setText("Round " + this.score); this.time.delayedCall(600, () => this.nextRound()); }
      } else { this.phase = "over"; this.statusText.setText(`Wrong! Score: ${this.score}. Tap to restart`); }
    });
    this.reset();
  }

  reset() {
    this.sequence = []; this.playerIdx = 0; this.score = 0;
    this.phase = "show"; this.showIdx = 0; this.showAcc = 0; this.lit = -1;
    this.padFlash = [0, 0, 0, 0];
    this.scoreText.setText("Round 0");
    this.statusText.setText("Watch the pattern...");
    this.nextRound();
  }

  nextRound() {
    this.sequence.push(Phaser.Math.Between(0, PADS - 1));
    this.playerIdx = 0; this.showIdx = 0; this.showAcc = 0; this.phase = "show";
    this.statusText.setText("Watch the pattern...");
  }

  getPadAt(x: number, y: number): number {
    const cx = W / 2, cy = H / 2 - 20, r = 90;
    const angles = [Math.PI * 1.5, 0, Math.PI * 0.5, Math.PI];
    for (let i = 0; i < PADS; i++) {
      const px = cx + Math.cos(angles[i]) * r, py = cy + Math.sin(angles[i]) * r;
      if ((x - px) ** 2 + (y - py) ** 2 < 55 ** 2) return i;
    }
    return -1;
  }

  update(_t: number, dt: number) {
    if (this.phase === "show") {
      this.showAcc += dt;
      const interval = 700;
      const step = Math.floor(this.showAcc / interval);
      if (step < this.sequence.length * 2) {
        this.lit = step % 2 === 0 ? this.sequence[Math.floor(step / 2)] : -1;
      } else {
        this.lit = -1; this.phase = "input";
        this.statusText.setText("Your turn! Repeat the pattern");
      }
    }
    this.padFlash = this.padFlash.map(f => Math.max(0, f - dt));
    this.draw();
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2 - 20, r = 90;
    const angles = [Math.PI * 1.5, 0, Math.PI * 0.5, Math.PI];
    const labels = ["↑", "→", "↓", "←"];
    for (let i = 0; i < PADS; i++) {
      const px = cx + Math.cos(angles[i]) * r, py = cy + Math.sin(angles[i]) * r;
      const active = this.lit === i || this.padFlash[i] > 0;
      g.fillStyle(COLORS[i], active ? 1 : 0.25).fillCircle(px, py, 50);
      g.fillStyle(0xffffff, active ? 0.4 : 0.1).fillCircle(px - 12, py - 12, 16);
      this.add.text(px, py, labels[i], { fontFamily: "system-ui", fontStyle: "bold", fontSize: "24px", color: active ? "#ffffff" : "#555577" }).setOrigin(0.5).setDepth(100);
    }
    // center
    g.fillStyle(0x111122).fillCircle(cx, cy, 30);
    g.lineStyle(2, 0x333355).strokeCircle(cx, cy, 30);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, SimonSaysScene));
