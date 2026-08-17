import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 480, HUD = 60;
const TANK_R = 18, BULLET_R = 5, ENEMY_R = 18;

interface Bullet { x: number; y: number; vx: number; vy: number; enemy: boolean; }
interface EnemyTank { x: number; y: number; angle: number; fireAcc: number; hp: number; }

class TankBattleScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private px = W / 2;
  private py = H - 80;
  private pAngle = -Math.PI / 2;
  private bullets: Bullet[] = [];
  private enemies: EnemyTank[] = [];
  private score = 0;
  private lives = 3;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private fireAcc = 0;
  private spawnAcc = 0;

  constructor() { super("tankbattle"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Score 0", 22, "#ffd15c");
    this.livesText = hudText(this, W - 16, 16, "❤❤❤", 22, "#ff3b4e").setOrigin(1, 0);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("W,A,S,D,SPACE") as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.over) { this.reset(); return; }
      this.pAngle = Math.atan2(p.y - this.py, p.x - this.px);
      this.fireBullet(false);
    });
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => { if (!this.over) this.pAngle = Math.atan2(p.y - this.py, p.x - this.px); });
    this.reset();
  }

  reset() {
    this.px = W / 2; this.py = H - 80; this.pAngle = -Math.PI / 2;
    this.bullets = []; this.enemies = []; this.score = 0; this.lives = 3;
    this.over = false; this.fireAcc = 0; this.spawnAcc = 0;
    this.scoreText.setText("Score 0");
    this.livesText.setText("❤❤❤");
    this.overText?.destroy(); this.overText = undefined;
    for (let i = 0; i < 3; i++) this.spawnEnemy();
  }

  spawnEnemy() {
    this.enemies.push({ x: Phaser.Math.Between(40, W - 40), y: Phaser.Math.Between(HUD + 20, H / 2), angle: Phaser.Math.FloatBetween(0, Math.PI * 2), fireAcc: Phaser.Math.Between(1000, 3000), hp: 2 });
  }

  fireBullet(enemy: boolean, ex = 0, ey = 0, ea = 0) {
    if (enemy) { this.bullets.push({ x: ex, y: ey, vx: Math.cos(ea) * 280, vy: Math.sin(ea) * 280, enemy: true }); return; }
    const spd = 400;
    this.bullets.push({ x: this.px + Math.cos(this.pAngle) * TANK_R, y: this.py + Math.sin(this.pAngle) * TANK_R, vx: Math.cos(this.pAngle) * spd, vy: Math.sin(this.pAngle) * spd, enemy: false });
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    const d = dt / 1000, spd = 180;
    if (this.cursors.left.isDown || this.keys.A.isDown) this.px -= spd * d;
    if (this.cursors.right.isDown || this.keys.D.isDown) this.px += spd * d;
    if (this.cursors.up.isDown || this.keys.W.isDown) this.py -= spd * d;
    if (this.cursors.down.isDown || this.keys.S.isDown) this.py += spd * d;
    this.px = Phaser.Math.Clamp(this.px, TANK_R, W - TANK_R);
    this.py = Phaser.Math.Clamp(this.py, HUD + TANK_R, H - TANK_R);

    this.fireAcc += dt;
    if ((this.cursors.space?.isDown || this.keys.SPACE.isDown) && this.fireAcc > 300) { this.fireAcc = 0; this.fireBullet(false); }

    this.spawnAcc += dt;
    if (this.spawnAcc > 5000 && this.enemies.length < 5) { this.spawnAcc = 0; this.spawnEnemy(); }

    this.enemies.forEach(e => {
      e.angle += d * 0.8;
      e.fireAcc -= dt;
      if (e.fireAcc <= 0) { e.fireAcc = Phaser.Math.Between(2000, 4000); const a = Math.atan2(this.py - e.y, this.px - e.x); this.fireBullet(true, e.x, e.y, a); }
    });

    this.bullets.forEach(b => { b.x += b.vx * d; b.y += b.vy * d; });
    this.bullets = this.bullets.filter(b => b.x > 0 && b.x < W && b.y > HUD && b.y < H);

    // player bullets hit enemies
    this.bullets = this.bullets.filter(b => {
      if (b.enemy) return true;
      for (const e of this.enemies) {
        if ((b.x - e.x) ** 2 + (b.y - e.y) ** 2 < (BULLET_R + ENEMY_R) ** 2) {
          e.hp--; if (e.hp <= 0) { this.enemies.splice(this.enemies.indexOf(e), 1); this.score += 50; this.scoreText.setText("Score " + this.score); }
          return false;
        }
      }
      return true;
    });

    // enemy bullets hit player
    this.bullets = this.bullets.filter(b => {
      if (!b.enemy) return true;
      if ((b.x - this.px) ** 2 + (b.y - this.py) ** 2 < (BULLET_R + TANK_R) ** 2) {
        this.lives--; this.livesText.setText("❤".repeat(Math.max(0, this.lives)));
        if (this.lives <= 0) this.endGame();
        return false;
      }
      return true;
    });

    if (this.enemies.length === 0) this.spawnEnemy();
    this.draw();
  }

  endGame() {
    this.over = true;
    this.overText = this.add.text(W / 2, H / 2, `Game Over\nScore ${this.score}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "32px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0d1a0d).fillRect(0, 0, W, H);
    // grid
    g.lineStyle(1, 0x1a2a1a);
    for (let x = 0; x < W; x += 40) { g.beginPath().moveTo(x, HUD).lineTo(x, H).strokePath(); }
    for (let y = HUD; y < H; y += 40) { g.beginPath().moveTo(0, y).lineTo(W, y).strokePath(); }
    this.enemies.forEach(e => {
      g.fillStyle(0xff3b4e, 0.2).fillCircle(e.x, e.y, ENEMY_R + 4);
      g.fillStyle(0xff3b4e).fillRect(e.x - ENEMY_R, e.y - ENEMY_R, ENEMY_R * 2, ENEMY_R * 2);
      g.fillStyle(0xcc2233).fillRect(e.x - ENEMY_R + 3, e.y - ENEMY_R + 3, ENEMY_R * 2 - 6, ENEMY_R * 2 - 6);
      g.lineStyle(3, 0xff6666).beginPath().moveTo(e.x, e.y).lineTo(e.x + Math.cos(e.angle) * ENEMY_R * 1.5, e.y + Math.sin(e.angle) * ENEMY_R * 1.5).strokePath();
    });
    this.bullets.forEach(b => { g.fillStyle(b.enemy ? 0xff3b4e : 0xffd15c).fillCircle(b.x, b.y, BULLET_R); });
    // player tank
    g.fillStyle(0x00ffa3, 0.2).fillCircle(this.px, this.py, TANK_R + 4);
    g.fillStyle(0x00ffa3).fillRect(this.px - TANK_R, this.py - TANK_R, TANK_R * 2, TANK_R * 2);
    g.fillStyle(0x00cc88).fillRect(this.px - TANK_R + 3, this.py - TANK_R + 3, TANK_R * 2 - 6, TANK_R * 2 - 6);
    g.lineStyle(4, 0x00ffcc).beginPath().moveTo(this.px, this.py).lineTo(this.px + Math.cos(this.pAngle) * TANK_R * 1.6, this.py + Math.sin(this.pAngle) * TANK_R * 1.6).strokePath();
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, TankBattleScene));
