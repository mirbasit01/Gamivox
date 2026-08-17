import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 400, HUD = 60;
const CHOICES = ["Rock", "Paper", "Scissors"];
const EMOJIS = ["🪨", "📄", "✂️"];

class RPSScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private wins = 0;
  private losses = 0;
  private draws = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private resultText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private playerChoice = -1;
  private aiChoice = -1;
  private animAcc = 0;

  constructor() { super("rps"); }

  create() {
    this.gfx = this.add.graphics();
    hudText(this, W / 2, 16, "Rock Paper Scissors", 20, "#c94bff").setOrigin(0.5, 0);
    this.scoreText = hudText(this, W / 2, HUD + 10, "W:0 D:0 L:0", 18, "#ffffff").setOrigin(0.5, 0);
    this.resultText = this.add.text(W / 2, H / 2 - 10, "Choose your move!", { fontFamily: "system-ui", fontStyle: "bold", fontSize: "22px", color: "#ffd15c" }).setOrigin(0.5).setDepth(100);
    this.roundText = this.add.text(W / 2, H / 2 + 30, "", { fontFamily: "system-ui", fontSize: "18px", color: "#888899" }).setOrigin(0.5).setDepth(100);
    // buttons
    CHOICES.forEach((c, i) => {
      const x = 80 + i * 160, y = H - 60;
      this.add.text(x, y, EMOJIS[i], { fontSize: "40px" }).setOrigin(0.5).setDepth(100).setInteractive().on("pointerdown", () => this.play(i));
      this.add.text(x, y + 36, c, { fontFamily: "system-ui", fontSize: "14px", color: "#888899" }).setOrigin(0.5).setDepth(100);
    });
    this.reset();
  }

  reset() {
    this.wins = 0; this.losses = 0; this.draws = 0;
    this.playerChoice = -1; this.aiChoice = -1;
    this.scoreText.setText("W:0 D:0 L:0");
    this.resultText.setText("Choose your move!");
    this.roundText.setText("");
  }

  play(choice: number) {
    this.playerChoice = choice;
    this.aiChoice = Phaser.Math.Between(0, 2);
    const result = (choice - this.aiChoice + 3) % 3;
    let msg = "", color = "#ffffff";
    if (result === 0) { this.draws++; msg = "Draw!"; color = "#ffd15c"; }
    else if (result === 1) { this.wins++; msg = "You Win! 🎉"; color = "#00ffa3"; }
    else { this.losses++; msg = "AI Wins!"; color = "#ff3b4e"; }
    this.scoreText.setText(`W:${this.wins} D:${this.draws} L:${this.losses}`);
    this.resultText.setText(msg).setColor(color);
    this.roundText.setText(`${EMOJIS[choice]} vs ${EMOJIS[this.aiChoice]}`);
    this.animAcc = 1000;
  }

  update(_t: number, dt: number) {
    if (this.animAcc > 0) this.animAcc -= dt;
    this.draw();
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    // choice display
    if (this.playerChoice >= 0) {
      const t = Math.min(1, (1000 - this.animAcc) / 500);
      g.fillStyle(0x111122).fillRoundedRect(40, HUD + 50, 160, 80, 12);
      g.fillStyle(0x111122).fillRoundedRect(W - 200, HUD + 50, 160, 80, 12);
      g.lineStyle(2, 0x00ffa3, 0.5).strokeRoundedRect(40, HUD + 50, 160, 80, 12);
      g.lineStyle(2, 0xff3b4e, 0.5).strokeRoundedRect(W - 200, HUD + 50, 160, 80, 12);
      this.add.text(120, HUD + 90, EMOJIS[this.playerChoice], { fontSize: "36px" }).setOrigin(0.5).setDepth(200);
      this.add.text(W - 120, HUD + 90, EMOJIS[this.aiChoice], { fontSize: "36px" }).setOrigin(0.5).setDepth(200);
      this.add.text(120, HUD + 52, "You", { fontFamily: "system-ui", fontSize: "12px", color: "#00ffa3" }).setOrigin(0.5, 0).setDepth(200);
      this.add.text(W - 120, HUD + 52, "AI", { fontFamily: "system-ui", fontSize: "12px", color: "#ff3b4e" }).setOrigin(0.5, 0).setDepth(200);
    }
    // button backgrounds
    CHOICES.forEach((_, i) => {
      const x = 80 + i * 160 - 40, y = H - 90;
      g.fillStyle(0x111122).fillRoundedRect(x, y, 80, 70, 10);
      g.lineStyle(1, 0x222233).strokeRoundedRect(x, y, 80, 70, 10);
    });
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, RPSScene));
