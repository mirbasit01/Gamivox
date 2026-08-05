import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 520;
const H = 560;

// Each cell stores which of its 4 walls are present.
type Cell = { n: boolean; e: boolean; s: boolean; w: boolean; visited: boolean };

class MazeScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private cols = 11;
  private rows = 11;
  private grid: Cell[][] = [];
  private originX = 0;
  private originY = 0;
  private cell = 40;
  private px = 0;
  private py = 0;
  private startX = 0;
  private startY = 0;
  private downX = 0;
  private downY = 0;
  private elapsed = 0;
  private state: "play" | "won" = "play";
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private timeText!: Phaser.GameObjects.Text;
  private hint!: Phaser.GameObjects.Text;
  private pulse = 0;

  constructor() {
    super("maze");
  }

  create() {
    this.gfx = this.add.graphics();
    this.timeText = hudText(this, 16, 14, "Time 0.0s", 22, "#3cff8a");
    this.hint = this.add
      .text(W / 2, 30, "Reach the glowing exit", {
        fontFamily: "system-ui, sans-serif",
        fontStyle: "bold",
        fontSize: "16px",
        color: "#9aa4b2",
        align: "center",
      })
      .setOrigin(0.5, 0)
      .setDepth(2000);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys("W,A,S,D,R") as Record<string, Phaser.Input.Keyboard.Key>;

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      this.downX = p.x;
      this.downY = p.y;
    });
    this.input.on("pointerup", (p: Phaser.Input.Pointer) => {
      if (this.state === "won") {
        this.nextMaze();
        return;
      }
      const dx = p.x - this.downX;
      const dy = p.y - this.downY;
      if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return; // treat as tap, not swipe
      if (Math.abs(dx) > Math.abs(dy)) this.tryMove(dx > 0 ? 1 : -1, 0);
      else this.tryMove(0, dy > 0 ? 1 : -1);
    });

    this.buildMaze();
  }

  nextMaze() {
    // Grow slightly each escape, capped, keeping it odd/square-ish.
    if (this.cols < 19) {
      this.cols += 2;
      this.rows += 2;
    }
    this.buildMaze();
  }

  buildMaze() {
    this.state = "play";
    this.elapsed = 0;
    this.hint.setText("Reach the glowing exit");

    // init full-wall grid
    this.grid = [];
    for (let y = 0; y < this.rows; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < this.cols; x++) row.push({ n: true, e: true, s: true, w: true, visited: false });
      this.grid.push(row);
    }

    // recursive backtracker (iterative stack)
    const stack: { x: number; y: number }[] = [];
    let cx = 0;
    let cy = 0;
    this.grid[cy][cx].visited = true;
    stack.push({ x: cx, y: cy });

    while (stack.length) {
      const top = stack[stack.length - 1];
      cx = top.x;
      cy = top.y;
      const neighbors: { x: number; y: number; dir: "n" | "e" | "s" | "w" }[] = [];
      if (cy > 0 && !this.grid[cy - 1][cx].visited) neighbors.push({ x: cx, y: cy - 1, dir: "n" });
      if (cx < this.cols - 1 && !this.grid[cy][cx + 1].visited) neighbors.push({ x: cx + 1, y: cy, dir: "e" });
      if (cy < this.rows - 1 && !this.grid[cy + 1][cx].visited) neighbors.push({ x: cx, y: cy + 1, dir: "s" });
      if (cx > 0 && !this.grid[cy][cx - 1].visited) neighbors.push({ x: cx - 1, y: cy, dir: "w" });

      if (neighbors.length === 0) {
        stack.pop();
        continue;
      }
      const nb = Phaser.Utils.Array.GetRandom(neighbors);
      // knock down wall between current and neighbor
      if (nb.dir === "n") {
        this.grid[cy][cx].n = false;
        this.grid[nb.y][nb.x].s = false;
      } else if (nb.dir === "e") {
        this.grid[cy][cx].e = false;
        this.grid[nb.y][nb.x].w = false;
      } else if (nb.dir === "s") {
        this.grid[cy][cx].s = false;
        this.grid[nb.y][nb.x].n = false;
      } else {
        this.grid[cy][cx].w = false;
        this.grid[nb.y][nb.x].e = false;
      }
      this.grid[nb.y][nb.x].visited = true;
      stack.push({ x: nb.x, y: nb.y });
    }

    // layout: fit maze inside area below HUD
    const top = 64;
    const maxW = W - 24;
    const maxH = H - top - 24;
    this.cell = Math.floor(Math.min(maxW / this.cols, maxH / this.rows));
    const gridW = this.cell * this.cols;
    const gridH = this.cell * this.rows;
    this.originX = Math.floor((W - gridW) / 2);
    this.originY = top + Math.floor((maxH - gridH) / 2);

    this.px = 0;
    this.py = 0;
    this.startX = 0;
    this.startY = 0;

    this.timeText.setText("Time 0.0s");
  }

  tryMove(dx: number, dy: number) {
    if (this.state !== "play") return;
    const c = this.grid[this.py][this.px];
    if (dx === 1 && !c.e) this.px += 1;
    else if (dx === -1 && !c.w) this.px -= 1;
    else if (dy === 1 && !c.s) this.py += 1;
    else if (dy === -1 && !c.n) this.py -= 1;
    else return;

    if (this.px === this.cols - 1 && this.py === this.rows - 1) this.win();
  }

  win() {
    this.state = "won";
    this.hint.setText(`Escaped! Time ${this.elapsed.toFixed(1)}s — tap / R for a new maze`);
  }

  update(_t: number, dt: number) {
    const d = dt / 1000;
    this.pulse += d * 4;

    if (this.state === "won") {
      if (Phaser.Input.Keyboard.JustDown(this.keys.R)) this.nextMaze();
      this.draw();
      return;
    }

    this.elapsed += d;
    this.timeText.setText("Time " + this.elapsed.toFixed(1) + "s");

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left) || Phaser.Input.Keyboard.JustDown(this.keys.A))
      this.tryMove(-1, 0);
    if (Phaser.Input.Keyboard.JustDown(this.cursors.right) || Phaser.Input.Keyboard.JustDown(this.keys.D))
      this.tryMove(1, 0);
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.keys.W))
      this.tryMove(0, -1);
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down) || Phaser.Input.Keyboard.JustDown(this.keys.S))
      this.tryMove(0, 1);

    this.draw();
  }

  private cellCenter(cx: number, cy: number): { x: number; y: number } {
    return {
      x: this.originX + cx * this.cell + this.cell / 2,
      y: this.originY + cy * this.cell + this.cell / 2,
    };
  }

  draw() {
    const g = this.gfx;
    const cs = this.cell;
    g.clear();
    g.fillGradientStyle(0x0a0c18, 0x0a0c18, 0x0f1428, 0x0a1020, 1).fillRect(0, 0, W, H);

    // maze backdrop
    g.fillStyle(0x11172e, 1).fillRect(this.originX, this.originY, cs * this.cols, cs * this.rows);

    // exit cell glow (bottom-right)
    const ex = this.cellCenter(this.cols - 1, this.rows - 1);
    const glow = 0.4 + 0.35 * Math.sin(this.pulse);
    g.fillStyle(0x3cff8a, glow).fillRect(
      this.originX + (this.cols - 1) * cs + 2,
      this.originY + (this.rows - 1) * cs + 2,
      cs - 4,
      cs - 4
    );
    g.fillStyle(0x3cff8a, Math.min(1, glow + 0.4)).fillCircle(ex.x, ex.y, cs * 0.22);

    // start cell marker
    g.fillStyle(0x5c1cff, 0.35).fillRect(this.originX + 2, this.originY + 2, cs - 4, cs - 4);

    // walls
    g.lineStyle(3, 0x6ad0ff, 1);
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const c = this.grid[y][x];
        const x0 = this.originX + x * cs;
        const y0 = this.originY + y * cs;
        if (c.n) g.lineBetween(x0, y0, x0 + cs, y0);
        if (c.w) g.lineBetween(x0, y0, x0, y0 + cs);
        if (c.e) g.lineBetween(x0 + cs, y0, x0 + cs, y0 + cs);
        if (c.s) g.lineBetween(x0, y0 + cs, x0 + cs, y0 + cs);
      }
    }

    // player
    const pc = this.cellCenter(this.px, this.py);
    g.fillStyle(0xffd15c, 0.3).fillCircle(pc.x, pc.y, cs * 0.34);
    g.fillStyle(0xffd15c, 1).fillCircle(pc.x, pc.y, cs * 0.24);
    g.fillStyle(0xffffff, 1).fillCircle(pc.x - cs * 0.06, pc.y - cs * 0.06, cs * 0.08);
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, MazeScene));
