import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 600, HUD = 60;

interface Laser { x1: number; y1: number; x2: number; y2: number; speed: number; angle: number; }

class LaserDodgeScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private px = W / 2;
  private py = H - 80;
  private lasers: Laser[] = [];
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private spawnAcc = 0;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private pointer!: Phaser.Input.Pointer;
  private stars: { x: number; y: number; s: number }[] = [];

  constructor() { super("laserdodge"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Score 0", 22, "#ff3b4e");
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("A,D,W,S") as Record<string, Phaser.Input.Keyboard.Key>;
    this.pointer = this.input.activePointer;
    this.input.on("pointerdown", () => { if (this.over) this.reset(); });
    for (let i = 0; i < 50; i++) this.stars.push({ x: Phaser.Math.Between(0, W), y: Phaser.Math.Between(0, H), s: Phaser.Math.FloatBetween(0.5, 2) });
    this.reset();
  }

  reset() {
    this.px = W / 2; this.py = H - 80;
    this.lasers = []; this.score = 0; this.over = false; this.spawnAcc = 0;
    this.scoreText.setText("Score 0");
    this.overText?.destroy(); this.overText = undefined;
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    const d = dt / 1000;
    this.score += dt;
    this.scoreText.setText("Score " + Math.floor(this.score / 100));

    const spd = 220;
    if (this.cursors.left.isDown || this.keys.A.isDown) this.px -= spd * d;
    if (this.cursors.right.isDown || this.keys.D.isDown) this.px += spd * d;
    if (this.cursors.up.isDown || this.keys.W.isDown) this.py -= spd * d;
    if (this.cursors.down.isDown || this.keys.S.isDown) this.py += spd * d;
    if (this.pointer.isDown) { this.px = Phaser.Math.Linear(this.px, this.pointer.x, 0.15); this.py = Phaser.Math.Linear(this.py, this.pointer.y, 0.15); }
    this.px = Phaser.Math.Clamp(this.px, 10, W - 10);
    this.py = Phaser.Math.Clamp(this.py, HUD + 10, H - 10);

    this.spawnAcc += dt;
    const rate = Math.max(300, 1200 - Math.floor(this.score / 1000) * 80);
    if (this.spawnAcc > rate) {
      this.spawnAcc = 0;
      const side = Phaser.Math.Between(0, 3);
      let x1 = 0, y1 = 0;
      if (side === 0) { x1 = Phaser.Math.Between(0, W); y1 = HUD; }
      else if (side === 1) { x1 = W; y1 = Phaser.Math.Between(HUD, H); }
      else if (side === 2) { x1 = Phaser.Math.Between(0, W); y1 = H; }
      else { x1 = 0; y1 = Phaser.Math.Between(HUD, H); }
      const a = Math.atan2(this.py - y1, this.px - x1) + Phaser.Math.FloatBetween(-0.3, 0.3);
      const spd2 = 200 + Math.floor(this.score / 2000) * 20;
      this.lasers.push({ x1, y1, x2: x1, y2: y1, speed: spd2, angle: a });
    }

    this.lasers.forEach(l => { l.x2 += Math.cos(l.angle) * l.speed * d; l.y2 += Math.sin(l.angle) * l.speed * d; });
    this.lasers = this.lasers.filter(l => l.x2 > -50 && l.x2 < W + 50 && l.y2 > HUD - 50 && l.y2 < H + 50);

    for (const l of this.lasers) {
      // point-to-segment distance
      const dx = l.x2 - l.x1, dy = l.y2 - l.y1;
      const len2 = dx * dx + dy * dy;
      if (len2 === 0) continue;
      const t = Phaser.Math.Clamp(((this.px - l.x1) * dx + (this.py - l.y1) * dy) / len2, 0, 1);
      const cx = l.x1 + t * dx, cy = l.y1 + t * dy;
      if ((this.px - cx) ** 2 + (this.py - cy) ** 2 < 12 ** 2) { this.endGame(); return; }
    }
    this.draw();
  }

  endGame() {
    this.over = true;
    this.overText = this.add.text(W / 2, H / 2, `Game Over\nScore ${Math.floor(this.score / 100)}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "32px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x050510).fillRect(0, 0, W, H);
    this.stars.forEach(s => g.fillStyle(0xffffff, 0.4 * s.s).fillCircle(s.x, s.y, s.s));
    this.lasers.forEach(l => {
      g.lineStyle(4, 0xff3b4e, 0.3).beginPath().moveTo(l.x1, l.y1).lineTo(l.x2, l.y2).strokePath();
      g.lineStyle(2, 0xff3b4e).beginPath().moveTo(l.x1, l.y1).lineTo(l.x2, l.y2).strokePath();
      g.fillStyle(0xff3b4e, 0.8).fillCircle(l.x2, l.y2, 4);
    });
    g.fillStyle(0x00d4ff, 0.3).fillCircle(this.px, this.py, 16);
    g.fillStyle(0x00d4ff).fillCircle(this.px, this.py, 10);
    g.fillStyle(0xffffff, 0.8).fillCircle(this.px - 3, this.py - 3, 3);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, LaserDodgeScene));
