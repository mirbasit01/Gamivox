import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 560, HUD = 60;

interface Asteroid { x: number; y: number; r: number; color: number; }
interface Ore { x: number; y: number; r: number; value: number; }
interface Bullet { x: number; y: number; vx: number; vy: number; }

class SpaceMinerScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private px = W / 2;
  private py = H / 2;
  private pAngle = 0;
  private pvx = 0;
  private pvy = 0;
  private asteroids: Asteroid[] = [];
  private ores: Ore[] = [];
  private bullets: Bullet[] = [];
  private score = 0;
  private fuel = 100;
  private scoreText!: Phaser.GameObjects.Text;
  private fuelText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private fireAcc = 0;
  private stars: { x: number; y: number; s: number }[] = [];

  constructor() { super("spaceminer"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Ore 0", 22, "#ffd15c");
    this.fuelText = hudText(this, W - 16, 16, "Fuel 100%", 20, "#00d4ff").setOrigin(1, 0);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("W,A,S,D,SPACE") as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.on("pointerdown", () => { if (this.over) this.reset(); });
    for (let i = 0; i < 60; i++) this.stars.push({ x: Phaser.Math.Between(0, W), y: Phaser.Math.Between(0, H), s: Phaser.Math.FloatBetween(0.5, 2) });
    this.reset();
  }

  reset() {
    this.px = W / 2; this.py = H / 2; this.pAngle = 0; this.pvx = 0; this.pvy = 0;
    this.asteroids = []; this.ores = []; this.bullets = [];
    this.score = 0; this.fuel = 100; this.over = false; this.fireAcc = 0;
    this.scoreText.setText("Ore 0");
    this.fuelText.setText("Fuel 100%");
    this.overText?.destroy(); this.overText = undefined;
    for (let i = 0; i < 8; i++) this.spawnAsteroid();
    for (let i = 0; i < 5; i++) this.spawnOre();
  }

  spawnAsteroid() {
    let x = 0, y = 0;
    do { x = Phaser.Math.Between(30, W - 30); y = Phaser.Math.Between(HUD + 30, H - 30); } while ((x - this.px) ** 2 + (y - this.py) ** 2 < 100 ** 2);
    this.asteroids.push({ x, y, r: Phaser.Math.Between(20, 40), color: Phaser.Utils.Array.GetRandom([0x888899, 0x776655, 0x998877]) });
  }

  spawnOre() {
    let x = 0, y = 0;
    do { x = Phaser.Math.Between(20, W - 20); y = Phaser.Math.Between(HUD + 20, H - 20); } while ((x - this.px) ** 2 + (y - this.py) ** 2 < 60 ** 2);
    this.ores.push({ x, y, r: 8, value: Phaser.Math.Between(1, 3) });
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    const d = dt / 1000;

    if (this.cursors.left.isDown || this.keys.A.isDown) this.pAngle -= 3 * d;
    if (this.cursors.right.isDown || this.keys.D.isDown) this.pAngle += 3 * d;
    if ((this.cursors.up.isDown || this.keys.W.isDown) && this.fuel > 0) {
      this.pvx += Math.cos(this.pAngle) * 200 * d;
      this.pvy += Math.sin(this.pAngle) * 200 * d;
      this.fuel = Math.max(0, this.fuel - 8 * d);
      this.fuelText.setText("Fuel " + Math.floor(this.fuel) + "%");
    }
    this.pvx *= 0.99; this.pvy *= 0.99;
    this.px += this.pvx * d; this.py += this.pvy * d;
    if (this.px < 0) this.px = W; if (this.px > W) this.px = 0;
    if (this.py < HUD) this.py = H; if (this.py > H) this.py = HUD;

    this.fireAcc += dt;
    if ((this.cursors.space?.isDown || this.keys.SPACE.isDown) && this.fireAcc > 300) {
      this.fireAcc = 0;
      this.bullets.push({ x: this.px + Math.cos(this.pAngle) * 16, y: this.py + Math.sin(this.pAngle) * 16, vx: Math.cos(this.pAngle) * 400 + this.pvx, vy: Math.sin(this.pAngle) * 400 + this.pvy });
    }

    this.bullets.forEach(b => { b.x += b.vx * d; b.y += b.vy * d; });
    this.bullets = this.bullets.filter(b => b.x > 0 && b.x < W && b.y > HUD && b.y < H);

    // bullets hit asteroids
    this.bullets = this.bullets.filter(b => {
      for (const a of this.asteroids) {
        if ((b.x - a.x) ** 2 + (b.y - a.y) ** 2 < a.r ** 2) {
          a.r -= 6;
          if (a.r < 10) { this.asteroids.splice(this.asteroids.indexOf(a), 1); this.ores.push({ x: a.x, y: a.y, r: 8, value: 2 }); this.spawnAsteroid(); }
          return false;
        }
      }
      return true;
    });

    // collect ores
    this.ores = this.ores.filter(o => {
      if ((o.x - this.px) ** 2 + (o.y - this.py) ** 2 < (o.r + 14) ** 2) {
        this.score += o.value; this.scoreText.setText("Ore " + this.score);
        this.fuel = Math.min(100, this.fuel + 5); this.fuelText.setText("Fuel " + Math.floor(this.fuel) + "%");
        return false;
      }
      return true;
    });
    if (this.ores.length < 3) this.spawnOre();

    // player hits asteroid
    for (const a of this.asteroids) {
      if ((a.x - this.px) ** 2 + (a.y - this.py) ** 2 < (a.r + 12) ** 2) { this.endGame(); return; }
    }
    if (this.fuel <= 0 && Math.abs(this.pvx) < 1 && Math.abs(this.pvy) < 1) { this.endGame(); return; }
    this.draw();
  }

  endGame() {
    this.over = true;
    this.overText = this.add.text(W / 2, H / 2, `Destroyed!\nOre ${this.score}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "32px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x020208).fillRect(0, 0, W, H);
    this.stars.forEach(s => g.fillStyle(0xffffff, 0.4 * s.s).fillCircle(s.x, s.y, s.s));
    this.asteroids.forEach(a => { g.fillStyle(a.color, 0.2).fillCircle(a.x, a.y, a.r + 4); g.fillStyle(a.color).fillCircle(a.x, a.y, a.r); g.fillStyle(0x000000, 0.3).fillCircle(a.x + a.r * 0.2, a.y - a.r * 0.2, a.r * 0.3); });
    this.ores.forEach(o => { g.fillStyle(0xffd15c, 0.4).fillCircle(o.x, o.y, o.r + 4); g.fillStyle(0xffd15c).fillCircle(o.x, o.y, o.r); });
    this.bullets.forEach(b => g.fillStyle(0x00d4ff).fillCircle(b.x, b.y, 3));
    // ship
    const cos = Math.cos(this.pAngle), sin = Math.sin(this.pAngle);
    const nx = cos * 14, ny = sin * 14;
    const lx = -sin * 8, ly = cos * 8;
    g.fillStyle(0x00d4ff, 0.2).fillCircle(this.px, this.py, 16);
    g.fillStyle(0x00d4ff).fillTriangle(this.px + nx, this.py + ny, this.px - nx + lx, this.py - ny + ly, this.px - nx - lx, this.py - ny - ly);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, SpaceMinerScene));
