import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 480, HUD = 60;
const PLAYER_R = 18, COIN_R = 10, ENEMY_R = 16;

class CoinDashScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private px = W / 2;
  private py = H / 2;
  private coins: { x: number; y: number }[] = [];
  private enemies: { x: number; y: number; vx: number; vy: number }[] = [];
  private score = 0;
  private timeLeft = 30;
  private scoreText!: Phaser.GameObjects.Text;
  private timeText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private spawnAcc = 0;

  constructor() { super("coindash"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Coins 0", 22, "#ffd15c");
    this.timeText = hudText(this, W - 16, 16, "30s", 22, "#ff5c6e").setOrigin(1, 0);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("W,A,S,D") as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.on("pointerdown", () => { if (this.over) this.reset(); });
    this.reset();
  }

  reset() {
    this.px = W / 2; this.py = H / 2;
    this.coins = []; this.enemies = [];
    this.score = 0; this.timeLeft = 30;
    this.over = false; this.spawnAcc = 0;
    this.scoreText.setText("Coins 0");
    this.timeText.setText("30s");
    this.overText?.destroy(); this.overText = undefined;
    for (let i = 0; i < 8; i++) this.spawnCoin();
  }

  spawnCoin() {
    this.coins.push({ x: Phaser.Math.Between(20, W - 20), y: Phaser.Math.Between(HUD + 20, H - 20) });
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    const d = dt / 1000;
    this.timeLeft -= d;
    if (this.timeLeft <= 0) { this.timeLeft = 0; this.endGame(); return; }
    this.timeText.setText(Math.ceil(this.timeLeft) + "s");

    const spd = 200;
    if (this.cursors.left.isDown || this.keys.A.isDown) this.px -= spd * d;
    if (this.cursors.right.isDown || this.keys.D.isDown) this.px += spd * d;
    if (this.cursors.up.isDown || this.keys.W.isDown) this.py -= spd * d;
    if (this.cursors.down.isDown || this.keys.S.isDown) this.py += spd * d;
    this.px = Phaser.Math.Clamp(this.px, PLAYER_R, W - PLAYER_R);
    this.py = Phaser.Math.Clamp(this.py, HUD + PLAYER_R, H - PLAYER_R);

    this.coins = this.coins.filter(c => {
      const dx = c.x - this.px, dy = c.y - this.py;
      if (dx * dx + dy * dy < (PLAYER_R + COIN_R) ** 2) { this.score++; this.scoreText.setText("Coins " + this.score); return false; }
      return true;
    });
    if (this.coins.length < 5) this.spawnCoin();

    this.spawnAcc += dt;
    if (this.spawnAcc > 2000) {
      this.spawnAcc = 0;
      const side = Phaser.Math.Between(0, 3);
      let ex = 0, ey = 0;
      if (side === 0) { ex = Phaser.Math.Between(0, W); ey = HUD; }
      else if (side === 1) { ex = W; ey = Phaser.Math.Between(HUD, H); }
      else if (side === 2) { ex = Phaser.Math.Between(0, W); ey = H; }
      else { ex = 0; ey = Phaser.Math.Between(HUD, H); }
      const a = Math.atan2(this.py - ey, this.px - ex);
      const spd2 = 80 + this.score * 2;
      this.enemies.push({ x: ex, y: ey, vx: Math.cos(a) * spd2, vy: Math.sin(a) * spd2 });
    }

    this.enemies.forEach(e => { e.x += e.vx * d; e.y += e.vy * d; });
    this.enemies = this.enemies.filter(e => e.x > -50 && e.x < W + 50 && e.y > HUD - 50 && e.y < H + 50);

    for (const e of this.enemies) {
      const dx = e.x - this.px, dy = e.y - this.py;
      if (dx * dx + dy * dy < (PLAYER_R + ENEMY_R) ** 2) { this.endGame(); return; }
    }
    this.draw();
  }

  endGame() {
    this.over = true;
    this.overText = this.add.text(W / 2, H / 2, `Time's Up!\nCoins ${this.score}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "32px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    this.coins.forEach(c => { g.fillStyle(0xffd15c, 0.3).fillCircle(c.x, c.y, COIN_R + 4); g.fillStyle(0xffd15c).fillCircle(c.x, c.y, COIN_R); });
    this.enemies.forEach(e => { g.fillStyle(0xff3b4e, 0.3).fillCircle(e.x, e.y, ENEMY_R + 4); g.fillStyle(0xff3b4e).fillTriangle(e.x, e.y - ENEMY_R, e.x - ENEMY_R, e.y + ENEMY_R, e.x + ENEMY_R, e.y + ENEMY_R); });
    g.fillStyle(0x00ffa3, 0.3).fillCircle(this.px, this.py, PLAYER_R + 4);
    g.fillStyle(0x00ffa3).fillCircle(this.px, this.py, PLAYER_R);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, CoinDashScene));
