import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 560, HUD = 60;
const COLS = 10, ROWS = 10, CELL = Math.floor((W - 40) / COLS), OX = 20;
const SHIPS = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

type Cell = "empty" | "ship" | "hit" | "miss";

class BattleshipScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private playerGrid: Cell[][] = [];
  private aiGrid: Cell[][] = [];
  private aiShips: Cell[][] = [];
  private phase: "place" | "play" | "over" = "place";
  private placing = 0;
  private placeH = true;
  private statusText!: Phaser.GameObjects.Text;
  private hintText!: Phaser.GameObjects.Text;
  private playerOY = HUD + 10;
  private aiOY = HUD + ROWS * CELL + 30;

  constructor() { super("battleship"); }

  create() {
    this.gfx = this.add.graphics();
    hudText(this, W / 2, 16, "Battleship", 20, "#00d4ff").setOrigin(0.5, 0);
    this.statusText = hudText(this, W / 2, this.playerOY - 16, "Your fleet", 14, "#888899").setOrigin(0.5, 1);
    this.hintText = hudText(this, W / 2, H - 20, `Place ship (size ${SHIPS[0]}) — tap to rotate`, 13, "#ffd15c").setOrigin(0.5, 1);
    this.input.keyboard!.on("keydown-R", () => { this.placeH = !this.placeH; });
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => this.onTap(p));
    this.reset();
  }

  reset() {
    this.playerGrid = Array.from({ length: ROWS }, () => Array(COLS).fill("empty") as Cell[]);
    this.aiGrid = Array.from({ length: ROWS }, () => Array(COLS).fill("empty") as Cell[]);
    this.aiShips = Array.from({ length: ROWS }, () => Array(COLS).fill("empty") as Cell[]);
    this.phase = "place"; this.placing = 0; this.placeH = true;
    this.placeAIShips();
    this.statusText.setText("Your fleet");
    this.hintText.setText(`Place ship (size ${SHIPS[0]}) — R to rotate`);
  }

  placeAIShips() {
    for (const size of SHIPS) {
      let placed = false;
      while (!placed) {
        const h = Math.random() < 0.5;
        const r = Phaser.Math.Between(0, ROWS - (h ? 1 : size));
        const c = Phaser.Math.Between(0, COLS - (h ? size : 1));
        let ok = true;
        for (let i = 0; i < size; i++) { const rr = r + (h ? 0 : i), cc = c + (h ? i : 0); if (this.aiShips[rr][cc] !== "empty") { ok = false; break; } }
        if (ok) { for (let i = 0; i < size; i++) { const rr = r + (h ? 0 : i), cc = c + (h ? i : 0); this.aiShips[rr][cc] = "ship"; } placed = true; }
      }
    }
  }

  canPlace(grid: Cell[][], r: number, c: number, size: number, h: boolean) {
    for (let i = 0; i < size; i++) { const rr = r + (h ? 0 : i), cc = c + (h ? i : 0); if (rr >= ROWS || cc >= COLS || grid[rr][cc] !== "empty") return false; }
    return true;
  }

  onTap(p: Phaser.Input.Pointer) {
    if (this.phase === "over") { this.reset(); return; }
    // rotate button area (bottom)
    if (p.y > H - 40) { this.placeH = !this.placeH; return; }
    const c = Math.floor((p.x - OX) / CELL);
    if (this.phase === "place") {
      const r = Math.floor((p.y - this.playerOY) / CELL);
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
      const size = SHIPS[this.placing];
      if (this.canPlace(this.playerGrid, r, c, size, this.placeH)) {
        for (let i = 0; i < size; i++) { const rr = r + (this.placeH ? 0 : i), cc = c + (this.placeH ? i : 0); this.playerGrid[rr][cc] = "ship"; }
        this.placing++;
        if (this.placing >= SHIPS.length) { this.phase = "play"; this.hintText.setText("Tap enemy grid to fire!"); this.statusText.setText("Enemy fleet ↓"); }
        else this.hintText.setText(`Place ship (size ${SHIPS[this.placing]}) — R to rotate`);
      }
    } else if (this.phase === "play") {
      const r = Math.floor((p.y - this.aiOY) / CELL);
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
      if (this.aiGrid[r][c] !== "empty") return;
      this.aiGrid[r][c] = this.aiShips[r][c] === "ship" ? "hit" : "miss";
      if (this.aiGrid.flat().filter(v => v === "hit").length === this.aiShips.flat().filter(v => v === "ship").length) { this.endGame("You win!"); return; }
      this.aiMove();
    }
  }

  aiMove() {
    let r = 0, c = 0;
    do { r = Phaser.Math.Between(0, ROWS - 1); c = Phaser.Math.Between(0, COLS - 1); } while (this.playerGrid[r][c] === "hit" || this.playerGrid[r][c] === "miss");
    const wasShip = this.playerGrid[r][c] === "ship";
    this.playerGrid[r][c] = wasShip ? "hit" : "miss";
    if (this.playerGrid.flat().filter(v => v === "hit").length === this.playerGrid.flat().filter(v => v === "ship" || v === "hit").length && wasShip) { this.endGame("AI wins!"); }
  }

  endGame(msg: string) {
    this.phase = "over";
    this.add.text(W / 2, H / 2, `${msg}\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "36px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
  }

  update() { this.draw(); }

  drawGrid(grid: Cell[][], oy: number, showShips: boolean) {
    const g = this.gfx;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const x = OX + c * CELL, y = oy + r * CELL, v = grid[r][c];
      g.fillStyle(v === "hit" ? 0xff3b4e : v === "miss" ? 0x333355 : (showShips && v === "ship") ? 0x00ffa3 : 0x111122).fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
      g.lineStyle(1, 0x222233).strokeRect(x, y, CELL, CELL);
    }
  }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    this.drawGrid(this.playerGrid, this.playerOY, true);
    if (this.phase !== "place") this.drawGrid(this.aiGrid, this.aiOY, false);
    // divider
    g.lineStyle(1, 0x333355).beginPath().moveTo(0, this.aiOY - 15).lineTo(W, this.aiOY - 15).strokePath();
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, BattleshipScene));
