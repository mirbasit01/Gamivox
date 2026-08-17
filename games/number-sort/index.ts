import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 480, HUD = 60;
const COLS = 5, CELL = Math.floor((W - 40) / COLS), OX = 20, OY = HUD + 20;

class NumberSortScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private numbers: number[] = [];
  private selected = -1;
  private moves = 0;
  private movesText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private solved = false;

  constructor() { super("numbersort"); }

  create() {
    this.gfx = this.add.graphics();
    hudText(this, W / 2, 16, "Number Sort", 22, "#ffd15c").setOrigin(0.5, 0);
    this.movesText = hudText(this, W - 16, 16, "Moves 0", 20, "#00ffa3").setOrigin(1, 0);
    this.statusText = hudText(this, W / 2, H - 30, "Tap two numbers to swap them", 15, "#888899").setOrigin(0.5);
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.solved) { this.reset(); return; }
      const c = Math.floor((p.x - OX) / CELL);
      const r = Math.floor((p.y - OY) / CELL);
      const idx = r * COLS + c;
      if (idx < 0 || idx >= this.numbers.length) return;
      if (this.selected < 0) { this.selected = idx; }
      else {
        if (this.selected !== idx) {
          const tmp = this.numbers[idx]; this.numbers[idx] = this.numbers[this.selected]; this.numbers[this.selected] = tmp;
          this.moves++; this.movesText.setText("Moves " + this.moves);
          if (this.checkSolved()) { this.solved = true; this.statusText.setText(`🎉 Sorted in ${this.moves} moves! Tap to play again`); }
        }
        this.selected = -1;
      }
    });
    this.reset();
  }

  reset() {
    const count = COLS * 3;
    this.numbers = Array.from({ length: count }, (_, i) => i + 1);
    do { Phaser.Utils.Array.Shuffle(this.numbers); } while (this.checkSorted());
    this.selected = -1; this.moves = 0; this.solved = false;
    this.movesText.setText("Moves 0");
    this.statusText?.setText("Tap two numbers to swap them");
  }

  checkSorted() { return this.numbers.every((v, i) => v === i + 1); }
  checkSolved() { return this.checkSorted(); }

  update() { this.draw(); }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    const rows = Math.ceil(this.numbers.length / COLS);
    for (let i = 0; i < this.numbers.length; i++) {
      const r = Math.floor(i / COLS), c = i % COLS;
      const x = OX + c * CELL, y = OY + r * CELL;
      const v = this.numbers[i];
      const inOrder = v === i + 1;
      const sel = this.selected === i;
      const color = inOrder ? 0x00ffa3 : 0x00d4ff;
      g.fillStyle(sel ? 0xffd15c : color, sel ? 0.4 : 0.15).fillRoundedRect(x + 3, y + 3, CELL - 6, CELL - 6, 10);
      g.lineStyle(2, sel ? 0xffd15c : color, sel ? 1 : 0.5).strokeRoundedRect(x + 3, y + 3, CELL - 6, CELL - 6, 10);
      this.add.text(x + CELL / 2, y + CELL / 2, "" + v, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "24px", color: sel ? "#ffd15c" : (inOrder ? "#00ffa3" : "#ffffff") }).setOrigin(0.5).setDepth(100);
    }
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, NumberSortScene));
