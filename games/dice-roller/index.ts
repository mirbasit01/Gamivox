import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 480, HUD = 60;
const DICE_COUNT = 5;

class DiceRollerScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private dice: number[] = [];
  private held: boolean[] = [];
  private rolls = 0;
  private maxRolls = 3;
  private score = 0;
  private totalScore = 0;
  private round = 1;
  private maxRounds = 5;
  private phase: "roll" | "score" | "over" = "roll";
  private statusText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private rollAcc = 0;
  private rolling = false;

  constructor() { super("diceroller"); }

  create() {
    this.gfx = this.add.graphics();
    hudText(this, W / 2, 16, "Dice Roller (Yahtzee-lite)", 18, "#ffd15c").setOrigin(0.5, 0);
    this.scoreText = hudText(this, 16, 16, "Total: 0", 18, "#00ffa3");
    this.roundText = hudText(this, W - 16, 16, "Round 1/5", 18, "#00d4ff").setOrigin(1, 0);
    this.statusText = hudText(this, W / 2, H - 30, "Press Roll to start", 16, "#888899").setOrigin(0.5);
    // roll button
    this.add.text(W / 2, H - 65, "🎲 Roll", { fontFamily: "system-ui", fontStyle: "bold", fontSize: "22px", color: "#ffd15c", backgroundColor: "#111122", padding: { x: 16, y: 8 } }).setOrigin(0.5).setDepth(100).setInteractive().on("pointerdown", () => this.onRoll());
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.phase === "over") { this.reset(); return; }
      if (this.phase !== "roll" || this.rolls === 0) return;
      const idx = this.getDieAt(p.x, p.y);
      if (idx >= 0) { this.held[idx] = !this.held[idx]; }
    });
    this.reset();
  }

  reset() {
    this.dice = Array(DICE_COUNT).fill(1); this.held = Array(DICE_COUNT).fill(false);
    this.rolls = 0; this.score = 0; this.totalScore = 0; this.round = 1;
    this.phase = "roll"; this.rolling = false;
    this.scoreText.setText("Total: 0");
    this.roundText.setText("Round 1/5");
    this.statusText.setText("Press Roll to start");
  }

  getDieAt(x: number, y: number): number {
    for (let i = 0; i < DICE_COUNT; i++) {
      const dx = 50 + i * 80, dy = H / 2 - 20;
      if ((x - dx) ** 2 + (y - dy) ** 2 < 35 ** 2) return i;
    }
    return -1;
  }

  onRoll() {
    if (this.phase === "over") return;
    if (this.rolls >= this.maxRolls) { this.scoreRound(); return; }
    this.rolling = true; this.rollAcc = 0;
    for (let i = 0; i < DICE_COUNT; i++) { if (!this.held[i]) this.dice[i] = Phaser.Math.Between(1, 6); }
    this.rolls++;
    this.time.delayedCall(400, () => { this.rolling = false; });
    if (this.rolls >= this.maxRolls) this.statusText.setText("Score this roll or tap Roll to bank");
    else this.statusText.setText(`Tap dice to hold · ${this.maxRolls - this.rolls} roll(s) left`);
  }

  scoreRound() {
    const sum = this.dice.reduce((a, b) => a + b, 0);
    // bonus for matching dice
    const counts: Record<number, number> = {};
    this.dice.forEach(d => { counts[d] = (counts[d] || 0) + 1; });
    const maxCount = Math.max(...Object.values(counts));
    let bonus = 0;
    if (maxCount === 5) bonus = 50;
    else if (maxCount === 4) bonus = 30;
    else if (maxCount === 3) bonus = 15;
    else if (maxCount === 2) bonus = 5;
    const roundScore = sum + bonus;
    this.totalScore += roundScore;
    this.scoreText.setText("Total: " + this.totalScore);
    if (this.round >= this.maxRounds) {
      this.phase = "over";
      this.statusText.setText(`Game over! Total: ${this.totalScore}. Tap to restart`);
    } else {
      this.round++; this.roundText.setText(`Round ${this.round}/5`);
      this.rolls = 0; this.held = Array(DICE_COUNT).fill(false);
      this.statusText.setText(`Round ${this.round} — Press Roll`);
    }
  }

  update(_t: number, dt: number) {
    if (this.rolling) { this.rollAcc += dt; if (this.rollAcc % 80 < 40) for (let i = 0; i < DICE_COUNT; i++) if (!this.held[i]) this.dice[i] = Phaser.Math.Between(1, 6); }
    this.draw();
  }

  drawDie(g: Phaser.GameObjects.Graphics, x: number, y: number, value: number, held: boolean) {
    const s = 30;
    g.fillStyle(held ? 0x00ffa3 : 0xffffff, held ? 0.2 : 0.1).fillRoundedRect(x - s, y - s, s * 2, s * 2, 8);
    g.lineStyle(2, held ? 0x00ffa3 : 0x555577).strokeRoundedRect(x - s, y - s, s * 2, s * 2, 8);
    const dots: [number, number][][] = [
      [[0, 0]],
      [[-12, -12], [12, 12]],
      [[-12, -12], [0, 0], [12, 12]],
      [[-12, -12], [12, -12], [-12, 12], [12, 12]],
      [[-12, -12], [12, -12], [0, 0], [-12, 12], [12, 12]],
      [[-12, -12], [12, -12], [-12, 0], [12, 0], [-12, 12], [12, 12]],
    ];
    g.fillStyle(held ? 0x00ffa3 : 0xffffff);
    (dots[value - 1] || []).forEach(([dx, dy]) => g.fillCircle(x + dx, y + dy, 4));
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    for (let i = 0; i < DICE_COUNT; i++) {
      this.drawDie(g, 50 + i * 80, H / 2 - 20, this.dice[i], this.held[i]);
    }
    // rolls indicator
    for (let i = 0; i < this.maxRolls; i++) {
      g.fillStyle(i < this.rolls ? 0xff3b4e : 0x333355).fillCircle(W / 2 - 20 + i * 20, HUD + 30, 6);
    }
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, DiceRollerScene));
