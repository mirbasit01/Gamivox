import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 560, HUD = 60;
const PLAYER_R = 16;

interface Zombie { x: number; y: number; hp: number; maxHp: number; speed: number; }
interface Bullet { x: number; y: number; vx: number; vy: number; }

class ZombieWaveScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private px = W / 2;
  private py = H / 2;
  private zombies: Zombie[] = [];
  private bullets: Bullet[] = [];
  private score = 0;
  private wave = 1;
  private lives = 3;
  private scoreText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private fireAcc = 0;
  private waveAcc = 0;

  constructor() { super("zombiewave"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Score 0", 20, "#00ffa3");
    this.waveText = hudText(this, W / 2, 16, "Wave 1", 20, "#ffd15c").setOrigin(0.5, 0);
    this.livesText = hudText(this, W - 16, 16, "❤❤❤", 20, "#ff3b4e").setOrigin(1, 0);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("W,A,S,D") as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.over) { this.reset(); return; }
      this.shoot(p.x, p.y);
    });
    this.reset();
  }

  reset() {
    this.px = W / 2; this.py = H / 2;
    this.zombies = []; this.bullets = [];
    this.score = 0; this.wave = 1; this.lives = 3;
    this.over = false; this.fireAcc = 0; this.waveAcc = 0;
    this.scoreText.setText("Score 0");
    this.waveText.setText("Wave 1");
    this.livesText.setText("❤❤❤");
    this.overText?.destroy(); this.overText = undefined;
    this.spawnWave();
  }

  spawnWave() {
    const count = 5 + this.wave * 2;
    for (let i = 0; i < count; i++) {
      const side = Phaser.Math.Between(0, 3);
      let x = 0, y = 0;
      if (side === 0) { x = Phaser.Math.Between(0, W); y = HUD; }
      else if (side === 1) { x = W; y = Phaser.Math.Between(HUD, H); }
      else if (side === 2) { x = Phaser.Math.Between(0, W); y = H; }
      else { x = 0; y = Phaser.Math.Between(HUD, H); }
      const hp = 1 + Math.floor(this.wave / 3);
      this.zombies.push({ x, y, hp, maxHp: hp, speed: 50 + this.wave * 5 });
    }
  }

  shoot(tx: number, ty: number) {
    const a = Math.atan2(ty - this.py, tx - this.px);
    this.bullets.push({ x: this.px, y: this.py, vx: Math.cos(a) * 350, vy: Math.sin(a) * 350 });
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    const d = dt / 1000, spd = 180;
    if (this.cursors.left.isDown || this.keys.A.isDown) this.px -= spd * d;
    if (this.cursors.right.isDown || this.keys.D.isDown) this.px += spd * d;
    if (this.cursors.up.isDown || this.keys.W.isDown) this.py -= spd * d;
    if (this.cursors.down.isDown || this.keys.S.isDown) this.py += spd * d;
    this.px = Phaser.Math.Clamp(this.px, PLAYER_R, W - PLAYER_R);
    this.py = Phaser.Math.Clamp(this.py, HUD + PLAYER_R, H - PLAYER_R);

    // auto-fire toward nearest zombie
    this.fireAcc += dt;
    if (this.fireAcc > 400 && this.zombies.length > 0) {
      this.fireAcc = 0;
      let nearest = this.zombies[0];
      let minD = Infinity;
      for (const z of this.zombies) { const d2 = (z.x - this.px) ** 2 + (z.y - this.py) ** 2; if (d2 < minD) { minD = d2; nearest = z; } }
      this.shoot(nearest.x, nearest.y);
    }

    this.zombies.forEach(z => { const a = Math.atan2(this.py - z.y, this.px - z.x); z.x += Math.cos(a) * z.speed * d; z.y += Math.sin(a) * z.speed * d; });
    this.bullets.forEach(b => { b.x += b.vx * d; b.y += b.vy * d; });
    this.bullets = this.bullets.filter(b => b.x > 0 && b.x < W && b.y > HUD && b.y < H);

    this.bullets = this.bullets.filter(b => {
      for (const z of this.zombies) {
        if ((b.x - z.x) ** 2 + (b.y - z.y) ** 2 < 20 ** 2) { z.hp--; if (z.hp <= 0) { this.zombies.splice(this.zombies.indexOf(z), 1); this.score += 10; this.scoreText.setText("Score " + this.score); } return false; }
      }
      return true;
    });

    for (const z of this.zombies) {
      if ((z.x - this.px) ** 2 + (z.y - this.py) ** 2 < (PLAYER_R + 16) ** 2) {
        this.zombies.splice(this.zombies.indexOf(z), 1);
        this.lives--; this.livesText.setText("❤".repeat(Math.max(0, this.lives)));
        if (this.lives <= 0) { this.endGame(); return; }
        break;
      }
    }

    if (this.zombies.length === 0) { this.wave++; this.waveText.setText("Wave " + this.wave); this.spawnWave(); }
    this.draw();
  }

  endGame() {
    this.over = true;
    this.overText = this.add.text(W / 2, H / 2, `Game Over\nWave ${this.wave}\nScore ${this.score}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "28px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0a1a0a).fillRect(0, 0, W, H);
    g.lineStyle(1, 0x112211);
    for (let x = 0; x < W; x += 40) g.beginPath().moveTo(x, HUD).lineTo(x, H).strokePath();
    for (let y = HUD; y < H; y += 40) g.beginPath().moveTo(0, y).lineTo(W, y).strokePath();
    this.zombies.forEach(z => {
      g.fillStyle(0x44aa44, 0.2).fillCircle(z.x, z.y, 20);
      g.fillStyle(0x44aa44).fillCircle(z.x, z.y, 16);
      g.fillStyle(0x226622).fillCircle(z.x, z.y - 6, 10);
      // hp bar
      const bw = 30, bh = 4;
      g.fillStyle(0x333333).fillRect(z.x - bw / 2, z.y - 26, bw, bh);
      g.fillStyle(0xff3b4e).fillRect(z.x - bw / 2, z.y - 26, bw * (z.hp / z.maxHp), bh);
    });
    this.bullets.forEach(b => g.fillStyle(0xffd15c).fillCircle(b.x, b.y, 4));
    g.fillStyle(0x00ffa3, 0.3).fillCircle(this.px, this.py, PLAYER_R + 4);
    g.fillStyle(0x00ffa3).fillCircle(this.px, this.py, PLAYER_R);
    g.fillStyle(0xffffff).fillCircle(this.px - 4, this.py - 4, 4);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, ZombieWaveScene));
