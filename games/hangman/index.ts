import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 480, HUD = 60;
const WORDS = ["PHASER","ARCADE","PUZZLE","NEON","PIXEL","BLAST","DODGE","SCORE","COMBO","SPEED","LASER","TURBO","FLASH","SWIFT","RAPID","POWER","BOOST","HYPER","ULTRA","GAMER","QUEST","LEVEL","BONUS","EXTRA","MAGIC","STORM","BLAZE","FROST","SPARK","GLOOM"];
const MAX_WRONG = 6;

class HangmanScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private word = "";
  private guessed = new Set<string>();
  private wrong = 0;
  private over = false;
  private won = false;
  private statusText!: Phaser.GameObjects.Text;
  private wordText!: Phaser.GameObjects.Text;
  private wrongText!: Phaser.GameObjects.Text;
  private letterButtons: Phaser.GameObjects.Text[] = [];

  constructor() { super("hangman"); }

  create() {
    this.gfx = this.add.graphics();
    hudText(this, W / 2, 16, "Hangman", 22, "#00ffa3").setOrigin(0.5, 0);
    this.statusText = hudText(this, W / 2, H - 50, "", 18, "#ffd15c").setOrigin(0.5);
    this.wordText = this.add.text(W / 2, HUD + 160, "", { fontFamily: "system-ui", fontStyle: "bold", fontSize: "32px", color: "#ffffff", letterSpacing: 10 }).setOrigin(0.5).setDepth(100);
    this.wrongText = this.add.text(W / 2, HUD + 200, "", { fontFamily: "system-ui", fontSize: "16px", color: "#ff3b4e" }).setOrigin(0.5).setDepth(100);
    this.createLetterButtons();
    this.input.on("pointerdown", () => { if (this.over) this.reset(); });
    this.reset();
  }

  createLetterButtons() {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const cols = 13;
    for (let i = 0; i < letters.length; i++) {
      const r = Math.floor(i / cols), c = i % cols;
      const x = 20 + c * 34 + 17, y = H - 100 + r * 34;
      const t = this.add.text(x, y, letters[i], { fontFamily: "system-ui", fontStyle: "bold", fontSize: "18px", color: "#00d4ff", backgroundColor: "#111122", padding: { x: 4, y: 2 } }).setOrigin(0.5).setDepth(100).setInteractive();
      t.on("pointerdown", () => this.guess(letters[i]));
      this.letterButtons.push(t);
    }
  }

  reset() {
    this.word = Phaser.Utils.Array.GetRandom(WORDS) as string;
    this.guessed = new Set(); this.wrong = 0; this.over = false; this.won = false;
    this.statusText.setText("");
    this.letterButtons.forEach(b => b.setColor("#00d4ff").setAlpha(1).setInteractive());
    this.updateWordDisplay();
    this.wrongText.setText("");
  }

  guess(letter: string) {
    if (this.over || this.guessed.has(letter)) return;
    this.guessed.add(letter);
    const btn = this.letterButtons.find(b => b.text === letter);
    if (btn) btn.setInteractive(false);
    if (!this.word.includes(letter)) {
      this.wrong++;
      btn?.setColor("#ff3b4e").setAlpha(0.5);
      this.wrongText.setText("Wrong: " + [...this.guessed].filter(l => !this.word.includes(l)).join(" "));
    } else {
      btn?.setColor("#00ffa3");
    }
    this.updateWordDisplay();
    if (this.word.split("").every(l => this.guessed.has(l))) { this.over = true; this.won = true; this.statusText.setText("🎉 You got it! Tap to play again"); }
    else if (this.wrong >= MAX_WRONG) { this.over = true; this.statusText.setText(`💀 It was "${this.word}". Tap to retry`); }
  }

  updateWordDisplay() {
    this.wordText.setText(this.word.split("").map(l => this.guessed.has(l) ? l : "_").join(" "));
  }

  update() { this.draw(); }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    // gallows
    const gx = W / 2 - 60, gy = HUD + 20;
    g.lineStyle(3, 0x555577);
    g.beginPath().moveTo(gx, gy + 120).lineTo(gx, gy).lineTo(gx + 60, gy).lineTo(gx + 60, gy + 20).strokePath();
    // body parts
    const bx = gx + 60, by = gy + 20;
    if (this.wrong > 0) g.fillStyle(0xff3b4e).fillCircle(bx, by + 14, 14); // head
    if (this.wrong > 1) g.lineStyle(3, 0xff3b4e).beginPath().moveTo(bx, by + 28).lineTo(bx, by + 70).strokePath(); // body
    if (this.wrong > 2) g.lineStyle(3, 0xff3b4e).beginPath().moveTo(bx, by + 38).lineTo(bx - 20, by + 58).strokePath(); // left arm
    if (this.wrong > 3) g.lineStyle(3, 0xff3b4e).beginPath().moveTo(bx, by + 38).lineTo(bx + 20, by + 58).strokePath(); // right arm
    if (this.wrong > 4) g.lineStyle(3, 0xff3b4e).beginPath().moveTo(bx, by + 70).lineTo(bx - 16, by + 96).strokePath(); // left leg
    if (this.wrong > 5) g.lineStyle(3, 0xff3b4e).beginPath().moveTo(bx, by + 70).lineTo(bx + 16, by + 96).strokePath(); // right leg
    // progress bar
    g.fillStyle(0x222233).fillRect(0, H - 8, W, 8);
    g.fillStyle(0xff3b4e).fillRect(0, H - 8, W * (this.wrong / MAX_WRONG), 8);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, HangmanScene));
