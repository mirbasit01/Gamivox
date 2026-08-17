import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 560, HUD = 60;
const COLS = 10, ROWS = 8, CW = W / COLS, CH = (H - HUD - 80) / ROWS;
const BASE_Y = H - 40;

interface Tower { col: number; row: number; fireAcc: number; range: number; damage: number; color: number; }
interface Enemy { x: number; y: number; hp: number; maxHp: number; speed: number; pathIdx: number; }
interface Projectile { x: number; y: number; tx: number; ty: number; t: number; color: number; }

const PATH_COLS = [0, 2, 2, 5, 5, 8, 8, 9];
const PATH_ROWS = [0, 0, 4, 4, 2, 2, 6, 6];

class TowerDefenseScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private towers: Tower[] = [];
  private enemies: Enemy[] = [];
  private projectiles: Projectile[] = [];
  private gold = 100;
  private lives = 20;
  private wave = 0;
  private goldText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private waveText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private spawnAcc = 0;
  private spawnCount = 0;
  private spawnTotal = 0;
  private waveActive = false;
  private hintText!: Phaser.GameObjects.Text;

  constructor() { super("towerdefense"); }

  create() {
    this.gfx = this.add.graphics();
    this.goldText = hudText(this, 16, 16, "💰 100", 20, "#ffd15c");
    this.livesText = hudText(this, W / 2, 16, "❤ 20", 20, "#ff3b4e").setOrigin(0.5, 0);
    this.waveText = hudText(this, W - 16, 16, "Wave 0", 20, "#00d4ff").setOrigin(1, 0);
    this.hintText = this.add.text(W / 2, H - 20, "Tap grid to place tower (50g) | Tap Start", { fontFamily: "system-ui", fontSize: "13px", color: "#888899" }).setOrigin(0.5, 1).setDepth(100);
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.over) { this.reset(); return; }
      const col = Math.floor(p.x / CW);
      const row = Math.floor((p.y - HUD) / CH);
      if (p.y > H - 60) { this.startWave(); return; }
      if (row >= 0 && row < ROWS && col >= 0 && col < COLS && this.gold >= 50 && !this.isPath(col, row) && !this.towers.find(t => t.col === col && t.row === row)) {
        this.towers.push({ col, row, fireAcc: 0, range: CW * 2.5, damage: 1, color: Phaser.Utils.Array.GetRandom([0x00ffa3, 0x00d4ff, 0xffd15c, 0xc94bff]) });
        this.gold -= 50; this.goldText.setText("💰 " + this.gold);
      }
    });
    this.reset();
  }

  isPath(col: number, row: number) {
    for (let i = 0; i < PATH_COLS.length - 1; i++) {
      const c1 = PATH_COLS[i], r1 = PATH_ROWS[i], c2 = PATH_COLS[i + 1], r2 = PATH_ROWS[i + 1];
      if (c1 === c2) { if (col === c1 && row >= Math.min(r1, r2) && row <= Math.max(r1, r2)) return true; }
      else { if (row === r1 && col >= Math.min(c1, c2) && col <= Math.max(c1, c2)) return true; }
    }
    return false;
  }

  pathPos(idx: number, t: number) {
    const c1 = PATH_COLS[idx], r1 = PATH_ROWS[idx], c2 = PATH_COLS[idx + 1], r2 = PATH_ROWS[idx + 1];
    return { x: (c1 + (c2 - c1) * t) * CW + CW / 2, y: HUD + (r1 + (r2 - r1) * t) * CH + CH / 2 };
  }

  startWave() {
    if (this.waveActive) return;
    this.wave++; this.waveText.setText("Wave " + this.wave);
    this.waveActive = true; this.spawnAcc = 0; this.spawnCount = 0;
    this.spawnTotal = 5 + this.wave * 3;
  }

  reset() {
    this.towers = []; this.enemies = []; this.projectiles = [];
    this.gold = 100; this.lives = 20; this.wave = 0;
    this.over = false; this.waveActive = false; this.spawnCount = 0;
    this.goldText.setText("💰 100");
    this.livesText.setText("❤ 20");
    this.waveText.setText("Wave 0");
    this.overText?.destroy(); this.overText = undefined;
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    const d = dt / 1000;

    if (this.waveActive) {
      this.spawnAcc += dt;
      if (this.spawnAcc > 800 && this.spawnCount < this.spawnTotal) {
        this.spawnAcc = 0; this.spawnCount++;
        const hp = 2 + this.wave;
        this.enemies.push({ x: PATH_COLS[0] * CW + CW / 2, y: HUD + PATH_ROWS[0] * CH + CH / 2, hp, maxHp: hp, speed: 40 + this.wave * 5, pathIdx: 0 });
      }
      if (this.spawnCount >= this.spawnTotal && this.enemies.length === 0) { this.waveActive = false; this.gold += 30; this.goldText.setText("💰 " + this.gold); }
    }

    this.enemies.forEach(e => {
      if (e.pathIdx >= PATH_COLS.length - 1) return;
      const target = this.pathPos(e.pathIdx, 1);
      const dx = target.x - e.x, dy = target.y - e.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 4) { e.pathIdx++; } else { e.x += (dx / dist) * e.speed * d; e.y += (dy / dist) * e.speed * d; }
    });

    this.enemies = this.enemies.filter(e => {
      if (e.pathIdx >= PATH_COLS.length - 1) { this.lives--; this.livesText.setText("❤ " + this.lives); if (this.lives <= 0) this.endGame(); return false; }
      return true;
    });

    this.towers.forEach(t => {
      t.fireAcc += dt;
      if (t.fireAcc < 1000) return;
      const tx = t.col * CW + CW / 2, ty = HUD + t.row * CH + CH / 2;
      const target = this.enemies.find(e => (e.x - tx) ** 2 + (e.y - ty) ** 2 < t.range ** 2);
      if (target) { t.fireAcc = 0; this.projectiles.push({ x: tx, y: ty, tx: target.x, ty: target.y, t: 0, color: t.color }); target.hp -= t.damage; if (target.hp <= 0) { this.enemies.splice(this.enemies.indexOf(target), 1); this.gold += 10; this.goldText.setText("💰 " + this.gold); } }
    });

    this.projectiles = this.projectiles.filter(p => { p.t += dt; return p.t < 300; });
    this.draw();
  }

  endGame() {
    this.over = true;
    this.overText = this.add.text(W / 2, H / 2, `Base Destroyed!\nWave ${this.wave}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "28px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0a1a0a).fillRect(0, 0, W, H);
    // grid
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const x = c * CW, y = HUD + r * CH;
      g.lineStyle(1, 0x1a2a1a).strokeRect(x, y, CW, CH);
      if (this.isPath(c, r)) g.fillStyle(0x2a3a1a, 0.8).fillRect(x + 1, y + 1, CW - 2, CH - 2);
    }
    // start wave button
    g.fillStyle(this.waveActive ? 0x333344 : 0x00ffa3, 0.3).fillRoundedRect(W / 2 - 70, H - 55, 140, 30, 8);
    g.lineStyle(1, this.waveActive ? 0x555566 : 0x00ffa3).strokeRoundedRect(W / 2 - 70, H - 55, 140, 30, 8);
    this.towers.forEach(t => {
      const x = t.col * CW + CW / 2, y = HUD + t.row * CH + CH / 2;
      g.fillStyle(t.color, 0.2).fillCircle(x, y, t.range);
      g.fillStyle(t.color, 0.8).fillRect(x - 10, y - 10, 20, 20);
      g.fillStyle(0xffffff, 0.4).fillRect(x - 6, y - 6, 12, 6);
    });
    this.enemies.forEach(e => {
      g.fillStyle(0xff3b4e, 0.2).fillCircle(e.x, e.y, 14);
      g.fillStyle(0xff3b4e).fillCircle(e.x, e.y, 10);
      const bw = 20;
      g.fillStyle(0x333333).fillRect(e.x - bw / 2, e.y - 18, bw, 4);
      g.fillStyle(0x00ffa3).fillRect(e.x - bw / 2, e.y - 18, bw * (e.hp / e.maxHp), 4);
    });
    this.projectiles.forEach(p => { const a = p.t / 300; g.fillStyle(p.color, 1 - a).fillCircle(Phaser.Math.Linear(p.x, p.tx, a), Phaser.Math.Linear(p.y, p.ty, a), 4); });
    // start wave label
    this.add.text(W / 2, H - 40, this.waveActive ? "Wave in progress..." : "▶ Start Wave", { fontFamily: "system-ui", fontStyle: "bold", fontSize: "14px", color: this.waveActive ? "#555566" : "#00ffa3" }).setOrigin(0.5).setDepth(200);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, TowerDefenseScene));
