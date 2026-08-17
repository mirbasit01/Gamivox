import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 560, HUD = 60;
const LANES = 4, LANE_W = W / LANES;
const COLORS = [0xff3b4e, 0x00d4ff, 0xffd15c, 0x00ffa3];
const KEYS_LABEL = ["A", "S", "D", "F"];

interface Note { lane: number; y: number; hit: boolean; missed: boolean; }

class TapBeatScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private notes: Note[] = [];
  private score = 0;
  private combo = 0;
  private maxCombo = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;
  private lives = 5;
  private spawnAcc = 0;
  private bpm = 120;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private laneFlash: number[] = [0, 0, 0, 0];
  private hitZoneY = H - 80;

  constructor() { super("tapbeat"); }

  create() {
    this.gfx = this.add.graphics();
    this.scoreText = hudText(this, 16, 16, "Score 0", 22, "#ffd15c");
    this.comboText = hudText(this, W - 16, 16, "♥♥♥♥♥", 20, "#ff3b4e").setOrigin(1, 0);
    this.keys = this.input.keyboard!.addKeys("A,S,D,F") as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.over) { this.reset(); return; }
      const lane = Math.floor(p.x / LANE_W);
      this.tapLane(lane);
    });
    this.reset();
  }

  reset() {
    this.notes = []; this.score = 0; this.combo = 0; this.maxCombo = 0;
    this.lives = 5; this.over = false; this.spawnAcc = 0; this.bpm = 120;
    this.laneFlash = [0, 0, 0, 0];
    this.scoreText.setText("Score 0");
    this.comboText.setText("♥♥♥♥♥");
    this.overText?.destroy(); this.overText = undefined;
  }

  tapLane(lane: number) {
    if (lane < 0 || lane >= LANES) return;
    this.laneFlash[lane] = 150;
    const note = this.notes.find(n => !n.hit && !n.missed && n.lane === lane && Math.abs(n.y - this.hitZoneY) < 50);
    if (note) {
      note.hit = true;
      const acc = Math.abs(note.y - this.hitZoneY);
      const pts = acc < 20 ? 100 : acc < 35 ? 60 : 30;
      this.score += pts * (1 + Math.floor(this.combo / 5));
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      this.scoreText.setText("Score " + this.score);
    }
  }

  update(_t: number, dt: number) {
    if (this.over) { this.draw(); return; }
    const d = dt / 1000;
    this.bpm = Math.min(200, 120 + Math.floor(this.score / 500) * 10);
    const noteSpd = 200 + (this.bpm - 120) * 1.5;

    this.spawnAcc += dt;
    const interval = 60000 / this.bpm;
    if (this.spawnAcc > interval) {
      this.spawnAcc -= interval;
      const lane = Phaser.Math.Between(0, LANES - 1);
      this.notes.push({ lane, y: HUD, hit: false, missed: false });
    }

    this.notes.forEach(n => { if (!n.hit) n.y += noteSpd * d; });
    this.notes.forEach(n => {
      if (!n.hit && !n.missed && n.y > this.hitZoneY + 50) {
        n.missed = true;
        this.combo = 0;
        this.lives--;
        this.comboText.setText("♥".repeat(Math.max(0, this.lives)));
        if (this.lives <= 0) this.endGame();
      }
    });
    this.notes = this.notes.filter(n => n.y < H + 20);
    this.laneFlash = this.laneFlash.map(f => Math.max(0, f - dt));

    if (Phaser.Input.Keyboard.JustDown(this.keys.A)) this.tapLane(0);
    if (Phaser.Input.Keyboard.JustDown(this.keys.S)) this.tapLane(1);
    if (Phaser.Input.Keyboard.JustDown(this.keys.D)) this.tapLane(2);
    if (Phaser.Input.Keyboard.JustDown(this.keys.F)) this.tapLane(3);

    this.draw();
  }

  endGame() {
    this.over = true;
    this.overText = this.add.text(W / 2, H / 2, `Game Over\nScore ${this.score}\nMax Combo ${this.maxCombo}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "28px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    for (let i = 0; i < LANES; i++) {
      const x = i * LANE_W;
      g.lineStyle(1, 0x222233).beginPath().moveTo(x, HUD).lineTo(x, H).strokePath();
      if (this.laneFlash[i] > 0) g.fillStyle(COLORS[i], this.laneFlash[i] / 150 * 0.3).fillRect(x, HUD, LANE_W, H - HUD);
      // hit zone
      g.fillStyle(COLORS[i], 0.2).fillRoundedRect(x + 4, this.hitZoneY - 20, LANE_W - 8, 40, 8);
      g.lineStyle(2, COLORS[i], 0.6).strokeRoundedRect(x + 4, this.hitZoneY - 20, LANE_W - 8, 40, 8);
      // key label
      this.add.text(x + LANE_W / 2, this.hitZoneY, KEYS_LABEL[i], { fontFamily: "system-ui", fontStyle: "bold", fontSize: "18px", color: "#ffffff88" }).setOrigin(0.5).setDepth(10);
    }
    this.notes.forEach(n => {
      if (n.hit) return;
      const x = n.lane * LANE_W + LANE_W / 2;
      const c = COLORS[n.lane];
      g.fillStyle(c, n.missed ? 0.2 : 0.9).fillRoundedRect(n.lane * LANE_W + 6, n.y - 16, LANE_W - 12, 32, 8);
      g.fillStyle(0xffffff, 0.3).fillRoundedRect(n.lane * LANE_W + 10, n.y - 12, LANE_W - 20, 10, 4);
    });
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, TapBeatScene));
