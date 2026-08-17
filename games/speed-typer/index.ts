import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 400, HUD = 60;
const WORDS = ["PHASER","ARCADE","PUZZLE","NEON","PIXEL","BLAST","DODGE","SCORE","COMBO","SPEED","JUMP","LASER","TURBO","FLASH","SWIFT","RAPID","POWER","BOOST","HYPER","ULTRA"];

class SpeedTyperScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private currentWord = "";
  private typed = "";
  private score = 0;
  private timeLeft = 60;
  private scoreText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private wordText!: Phaser.GameObjects.Text;
  private typedText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private wpm = 0;
  private wordsTyped = 0;

  constructor() { super("speedtyper"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Score 0", 22, "#00ffa3");
    this.timeText = hudText(this, W - 16, 16, "60s", 22, "#ffd15c").setOrigin(1, 0);
    this.wordText = this.add.text(W / 2, H / 2 - 40, "", { fontFamily: "system-ui", fontStyle: "bold", fontSize: "42px", color: "#ffffff" }).setOrigin(0.5).setDepth(100);
    this.typedText = this.add.text(W / 2, H / 2 + 20, "", { fontFamily: "system-ui", fontSize: "32px", color: "#00ffa3" }).setOrigin(0.5).setDepth(100);
    this.add.text(W / 2, H - 30, "Type the word above!", { fontFamily: "system-ui", fontSize: "16px", color: "#555577" }).setOrigin(0.5).setDepth(100);
    this.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
      if (this.over) { if (e.key === "Enter") this.reset(); return; }
      if (e.key === "Backspace") { this.typed = this.typed.slice(0, -1); }
      else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) { this.typed += e.key.toUpperCase(); }
      if (this.typed === this.currentWord) { this.score += this.currentWord.length * 10; this.wordsTyped++; this.typed = ""; this.nextWord(); this.scoreText.setText("Score " + this.score); }
      this.typedText.setText(this.typed);
    });
    this.input.on("pointerdown", () => { if (this.over) this.reset(); });
    this.reset();
  }

  reset() {
    this.score = 0; this.timeLeft = 60; this.typed = ""; this.wordsTyped = 0;
    this.over = false;
    this.scoreText.setText("Score 0");
    this.timeText.setText("60s");
    this.typedText.setText("");
    this.overText?.destroy(); this.overText = undefined;
    this.nextWord();
  }

  nextWord() {
    this.currentWord = Phaser.Utils.Array.GetRandom(WORDS) as string;
    this.wordText.setText(this.currentWord);
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    this.timeLeft -= dt / 1000;
    if (this.timeLeft <= 0) { this.timeLeft = 0; this.endGame(); return; }
    this.timeText.setText(Math.ceil(this.timeLeft) + "s");
    // color typed text based on correctness
    const correct = this.currentWord.startsWith(this.typed);
    this.typedText.setColor(correct ? "#00ffa3" : "#ff3b4e");
    this.draw();
  }

  endGame() {
    this.over = true;
    this.wpm = Math.round(this.wordsTyped / 1);
    this.overText = this.add.text(W / 2, H / 2, `Time's Up!\nScore ${this.score}\nWords: ${this.wordsTyped}\nPress Enter / Tap`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "28px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    // progress bar
    const prog = this.timeLeft / 60;
    g.fillStyle(0x222233).fillRect(0, H - 8, W, 8);
    g.fillStyle(prog > 0.5 ? 0x00ffa3 : prog > 0.25 ? 0xffd15c : 0xff3b4e).fillRect(0, H - 8, W * prog, 8);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, SpeedTyperScene));
