import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 480, HUD = 60, GRID = 6, CELL = 64, OX = 48, OY = 72;
type Mirror = { r: number; c: number; slash: boolean };

class LightReflectorScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private mirrors: Mirror[] = [];
  private hits = 0;
  private status!: Phaser.GameObjects.Text;
  private won = false;

  constructor() { super("lightreflector"); }

  create() {
    this.gfx = this.add.graphics();
    hudText(this, W / 2, 16, "Light Reflector", 22, "#ffd15c").setOrigin(0.5, 0);
    this.status = hudText(this, W / 2, H - 18, "Rotate mirrors to light every target", 15, "#aab0cc").setOrigin(0.5);
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.won) { this.reset(); return; }
      const c = Math.floor((p.x - OX) / CELL), r = Math.floor((p.y - OY) / CELL);
      const mirror = this.mirrors.find((m) => m.r === r && m.c === c);
      if (mirror) { mirror.slash = !mirror.slash; this.trace(); }
    });
    this.reset();
  }

  reset() {
    this.mirrors = [
      { r: 0, c: 2, slash: false }, { r: 1, c: 4, slash: true },
      { r: 2, c: 1, slash: true }, { r: 3, c: 3, slash: false },
      { r: 4, c: 5, slash: true }, { r: 5, c: 2, slash: false },
    ];
    Phaser.Utils.Array.Shuffle(this.mirrors);
    this.mirrors.forEach((m) => { m.slash = Phaser.Math.Between(0, 1) === 1; });
    this.won = false;
    this.trace();
  }

  trace() {
    // A mirror is lit when its orientation matches the alternating light path.
    this.hits = this.mirrors.filter((m, i) => m.slash === (i % 2 === 0)).length;
    this.won = this.hits === this.mirrors.length;
    this.status.setText(this.won ? "✨ All targets lit! Tap to play again" : `${this.hits}/${this.mirrors.length} targets lit — click mirrors to rotate`)
      .setColor(this.won ? "#00ffa3" : "#aab0cc");
  }

  update() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    g.lineStyle(1, 0x222244);
    for (let i = 0; i <= GRID; i++) { g.lineBetween(OX + i * CELL, OY, OX + i * CELL, OY + GRID * CELL); g.lineBetween(OX, OY + i * CELL, OX + GRID * CELL, OY + i * CELL); }
    g.lineStyle(3, this.won ? 0x00ffa3 : 0xffd15c, 0.6);
    g.lineBetween(OX, OY + CELL / 2, OX + GRID * CELL, OY + CELL / 2);
    this.mirrors.forEach((m) => {
      const x = OX + m.c * CELL, y = OY + m.r * CELL;
      g.fillStyle(0x1a1d34).fillRect(x + 5, y + 5, CELL - 10, CELL - 10);
      g.lineStyle(6, m.slash ? 0x00d4ff : 0xff5cf0, 1);
      if (m.slash) g.lineBetween(x + 14, y + CELL - 14, x + CELL - 14, y + 14);
      else g.lineBetween(x + 14, y + 14, x + CELL - 14, y + CELL - 14);
    });
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, LightReflectorScene));
