import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 560, HUD = 60;
const COLORS = [0xff3b4e, 0x00d4ff, 0xffd15c, 0x00ffa3, 0xc94bff, 0xff8a5c];

interface EnemyBullet { x: number; y: number; vx: number; vy: number; color: number; }
interface Spawner { x: number; y: number; acc: number; interval: number; }

class BulletHellScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private px = W / 2;
  private py = H - 80;
  private bullets: EnemyBullet[] = [];
  private spawners: Spawner[] = [];
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private pointer!: Phaser.Input.Pointer;
  private wave = 0;
  private waveAcc = 0;

  constructor() { super("bullethell"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Score 0", 22, "#ff3b4e");
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("W,A,S,D") as Record<string, Phaser.Input.Keyboard.Key>;
    this.pointer = this.input.activePointer;
    this.input.on("pointerdown", () => { if (this.over) this.reset(); });
    this.reset();
  }

  reset() {
    this.px = W / 2; this.py = H - 80;
    this.bullets = []; this.score = 0; this.wave = 0; this.waveAcc = 0;
    this.over = false;
    this.scoreText.setText("Score 0");
    this.overText?.destroy(); this.overText = undefined;
    this.spawners = [
      { x: W / 2, y: HUD + 40, acc: 0, interval: 800 },
      { x: 80, y: HUD + 80, acc: 400, interval: 1200 },
      { x: W - 80, y: HUD + 80, acc: 200, interval: 1200 },
    ];
  }

  fireBurst(s: Spawner, count: number) {
    const baseAngle = Math.atan2(this.py - s.y, this.px - s.x);
    for (let i = 0; i < count; i++) {
      const a = baseAngle + (i - (count - 1) / 2) * 0.3;
      const spd = 120 + this.wave * 10;
      this.bullets.push({ x: s.x, y: s.y, vx: Math.cos(a) * spd, vy: Math.sin(a) * spd, color: Phaser.Utils.Array.GetRandom(COLORS) });
    }
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    const d = dt / 1000;
    this.score += dt;
    this.waveAcc += dt;
    if (this.waveAcc > 8000) { this.waveAcc = 0; this.wave++; this.spawners.forEach(s => s.interval = Math.max(300, s.interval - 100)); }
    this.scoreText.setText("Score " + Math.floor(this.score / 100));

    const spd = 200;
    if (this.cursors.left.isDown || this.keys.A.isDown) this.px -= spd * d;
    if (this.cursors.right.isDown || this.keys.D.isDown) this.px += spd * d;
    if (this.cursors.up.isDown || this.keys.W.isDown) this.py -= spd * d;
    if (this.cursors.down.isDown || this.keys.S.isDown) this.py += spd * d;
    if (this.pointer.isDown) { this.px = Phaser.Math.Linear(this.px, this.pointer.x, 0.2); this.py = Phaser.Math.Linear(this.py, this.pointer.y, 0.2); }
    this.px = Phaser.Math.Clamp(this.px, 10, W - 10);
    this.py = Phaser.Math.Clamp(this.py, HUD + 10, H - 10);

    this.spawners.forEach(s => { s.acc += dt; if (s.acc > s.interval) { s.acc = 0; this.fireBurst(s, 3 + this.wave); } });
    this.bullets.forEach(b => { b.x += b.vx * d; b.y += b.vy * d; });
    this.bullets = this.bullets.filter(b => b.x > -10 && b.x < W + 10 && b.y > HUD - 10 && b.y < H + 10);

    for (const b of this.bullets) {
      if ((b.x - this.px) ** 2 + (b.y - this.py) ** 2 < 10 ** 2) { this.endGame(); return; }
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
    this.spawners.forEach(s => { g.fillStyle(0xff3b4e, 0.2).fillCircle(s.x, s.y, 20); g.fillStyle(0xff3b4e).fillCircle(s.x, s.y, 14); g.fillStyle(0xffffff, 0.5).fillCircle(s.x - 4, s.y - 4, 4); });
    this.bullets.forEach(b => { g.fillStyle(b.color, 0.3).fillCircle(b.x, b.y, 8); g.fillStyle(b.color).fillCircle(b.x, b.y, 5); });
    g.fillStyle(0x00ffa3, 0.3).fillCircle(this.px, this.py, 14);
    g.fillStyle(0x00ffa3).fillCircle(this.px, this.py, 8);
    g.fillStyle(0xffffff).fillCircle(this.px - 2, this.py - 2, 2);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, BulletHellScene));
