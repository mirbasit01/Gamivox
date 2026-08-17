import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 400, HUD = 60;
const WORDS = ["PHASER","ARCADE","PUZZLE","NEON","PIXEL","BLAST","DODGE","SCORE","COMBO","SPEED","LASER","TURBO","FLASH","SWIFT","RAPID","POWER","BOOST","HYPER","ULTRA","GAMER","QUEST","LEVEL","BONUS","EXTRA","MAGIC","STORM","BLAZE","FROST","SPARK","GLOOM"];

class WordScrambleScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private answer = "";
  private scrambled = "";
  private typed = "";
  private score = 0;
  private streak = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private scrambleText!: Phaser.GameObjects.Text;
  private typedText!: Phaser.GameObjects.Text;
  private feedbackText!: Phaser.GameObjects.Text;
  private feedbackAcc = 0;
  private timeLeft = 60;
  private timeText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;

  constructor() { super("wordscramble"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Score 0", 22, "#00ffa3");
    this.timeText = hudText(this, W - 16, 16, "60s", 22, "#ffd15c").setOrigin(1, 0);
    this.scrambleText = this.add.text(W / 2, H / 2 - 50, "", { fontFamily: "system-ui", fontStyle: "bold", fontSize: "48px", color: "#ffffff", letterSpacing: 8 }).setOrigin(0.5).setDepth(100);
    this.typedText = this.add.text(W / 2, H / 2 + 20, "", { fontFamily: "system-ui", fontSize: "32px", color: "#00ffa3" }).setOrigin(0.5).setDepth(100);
    this.feedbackText = this.add.text(W / 2, H / 2 + 70, "", { fontFamily: "system-ui", fontStyle: "bold", fontSize: "24px", color: "#ffd15c" }).setOrigin(0.5).setDepth(100);
    this.add.text(W / 2, H - 30, "Unscramble the word!", { fontFamily: "system-ui", fontSize: "15px", color: "#555577" }).setOrigin(0.5).setDepth(100);
    this.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
      if (this.over) { if (e.key === "Enter") this.reset(); return; }
      if (e.key === "Backspace") { this.typed = this.typed.slice(0, -1); }
      else if (e.key === "Enter") { this.checkAnswer(); }
      else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) { this.typed += e.key.toUpperCase(); }
      this.typedText.setText(this.typed);
    });
    this.input.on("pointerdown", () => { if (this.over) this.reset(); });
    this.reset();
  }

  reset() {
    this.score = 0; this.streak = 0; this.timeLeft = 60; this.typed = ""; this.over = false;
    this.scoreText.setText("Score 0");
    this.timeText.setText("60s");
    this.typedText.setText("");
    this.feedbackText.setText("");
    this.overText?.destroy(); this.overText = undefined;
    this.nextWord();
  }

  nextWord() {
    this.answer = Phaser.Utils.Array.GetRandom(WORDS) as string;
    const arr = this.answer.split("");
    do { Phaser.Utils.Array.Shuffle(arr); } while (arr.join("") === this.answer);
    this.scrambled = arr.join("");
    this.scrambleText.setText(this.scrambled);
    this.typed = "";
    this.typedText.setText("");
  }

  checkAnswer() {
    if (this.typed === this.answer) {
      this.streak++;
      this.score += 100 + this.streak * 10;
      this.scoreText.setText("Score " + this.score);
      this.feedbackText.setText("✓ Correct! +" + (100 + this.streak * 10)).setColor("#00ffa3");
      this.feedbackAcc = 1200;
      this.nextWord();
    } else {
      this.streak = 0;
      this.feedbackText.setText("✗ Try again!").setColor("#ff3b4e");
      this.feedbackAcc = 800;
      this.typed = "";
      this.typedText.setText("");
    }
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    this.timeLeft -= dt / 1000;
    if (this.timeLeft <= 0) { this.timeLeft = 0; this.endGame(); return; }
    this.timeText.setText(Math.ceil(this.timeLeft) + "s");
    if (this.feedbackAcc > 0) { this.feedbackAcc -= dt; if (this.feedbackAcc <= 0) this.feedbackText.setText(""); }
    this.draw();
  }

  endGame() {
    this.over = true;
    this.overText = this.add.text(W / 2, H / 2, `Time's Up!\nScore ${this.score}\nPress Enter / Tap`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "28px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    const prog = this.timeLeft / 60;
    g.fillStyle(0x222233).fillRect(0, H - 6, W, 6);
    g.fillStyle(prog > 0.5 ? 0x00ffa3 : prog > 0.25 ? 0xffd15c : 0xff3b4e).fillRect(0, H - 6, W * prog, 6);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, WordScrambleScene));
