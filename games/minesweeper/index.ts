import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480;
const H = 560;
const HUD = 50;
const GRID = 9;
const MINES = 10;
const BOARD = W;
const CELL = BOARD / GRID;

const NUM_COLORS: Record<number, string> = {
  1: "#5c8bff",
  2: "#00ffa3",
  3: "#ff5c6e",
  4: "#7c5cff",
  5: "#ff9f5c",
  6: "#00d4ff",
  7: "#ffd15c",
  8: "#cccccc",
};

interface Cell {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adj: number;
}

class MinesweeperScene extends Phaser.Scene {
  private cells: Cell[][] = [];
  private gfx!: Phaser.GameObjects.Graphics;
  private labels: Phaser.GameObjects.Text[] = [];
  private statusText!: Phaser.GameObjects.Text;
  private flagBtn!: Phaser.GameObjects.Rectangle;
  private flagBtnLabel!: Phaser.GameObjects.Text;
  private flagMode = false;
  private over = false;
  private won = false;
  private revealedCount = 0;
  private overText?: Phaser.GameObjects.Text;

  constructor() {
    super("minesweeper");
  }

  create() {
    this.gfx = this.add.graphics();
    this.statusText = hudText(this, 12, 14, "", 22, "#8bd5ff");

    // flag mode toggle button top-right
    const bw = 120;
    const bh = 36;
    this.flagBtn = this.add
      .rectangle(W - bw / 2 - 8, HUD / 2, bw, bh, 0x2b2b40)
      .setStrokeStyle(2, 0xff9f5c)
      .setDepth(1000);
    this.flagBtnLabel = hudText(this, W - bw - 2, 16, "🚩 Flag: OFF", 16, "#ffffff");

    this.reset();

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      // flag button
      if (
        Math.abs(p.x - this.flagBtn.x) <= this.flagBtn.width / 2 &&
        Math.abs(p.y - this.flagBtn.y) <= this.flagBtn.height / 2
      ) {
        this.flagMode = !this.flagMode;
        this.flagBtn.setFillStyle(this.flagMode ? 0x7c5cff : 0x2b2b40);
        this.flagBtnLabel.setText(this.flagMode ? "🚩 Flag: ON" : "🚩 Flag: OFF");
        return;
      }

      if (this.over || this.won) {
        this.reset();
        return;
      }

      if (p.y < HUD) return;
      const c = Math.floor(p.x / CELL);
      const r = Math.floor((p.y - HUD) / CELL);
      if (r < 0 || r >= GRID || c < 0 || c >= GRID) return;

      if (this.flagMode) this.toggleFlag(r, c);
      else this.reveal(r, c);
      this.render();
    });
  }

  private reset() {
    this.over = false;
    this.won = false;
    this.revealedCount = 0;
    this.overText?.destroy();
    this.overText = undefined;

    this.cells = Array.from({ length: GRID }, () =>
      Array.from({ length: GRID }, () => ({
        mine: false,
        revealed: false,
        flagged: false,
        adj: 0,
      }))
    );

    // place mines
    let placed = 0;
    while (placed < MINES) {
      const r = Phaser.Math.Between(0, GRID - 1);
      const c = Phaser.Math.Between(0, GRID - 1);
      if (!this.cells[r][c].mine) {
        this.cells[r][c].mine = true;
        placed++;
      }
    }

    // compute adjacency
    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        if (this.cells[r][c].mine) continue;
        this.cells[r][c].adj = this.neighbours(r, c).filter(
          ([nr, nc]) => this.cells[nr][nc].mine
        ).length;
      }
    }

    this.render();
  }

  private neighbours(r: number, c: number): [number, number][] {
    const out: [number, number][] = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < GRID && nc >= 0 && nc < GRID) out.push([nr, nc]);
      }
    }
    return out;
  }

  private toggleFlag(r: number, c: number) {
    const cell = this.cells[r][c];
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
  }

  private reveal(r: number, c: number) {
    const cell = this.cells[r][c];
    if (cell.revealed || cell.flagged) return;

    if (cell.mine) {
      this.loseGame();
      return;
    }

    // flood fill
    const stack: [number, number][] = [[r, c]];
    while (stack.length) {
      const [cr, cc] = stack.pop()!;
      const cur = this.cells[cr][cc];
      if (cur.revealed || cur.flagged || cur.mine) continue;
      cur.revealed = true;
      this.revealedCount++;
      if (cur.adj === 0) {
        this.neighbours(cr, cc).forEach(([nr, nc]) => {
          if (!this.cells[nr][nc].revealed) stack.push([nr, nc]);
        });
      }
    }

    if (this.revealedCount === GRID * GRID - MINES) this.winGame();
  }

  private loseGame() {
    this.over = true;
    for (let r = 0; r < GRID; r++)
      for (let c = 0; c < GRID; c++) if (this.cells[r][c].mine) this.cells[r][c].revealed = true;
    this.render();
    this.showOver("💥 BOOM! You lost\nTap to restart");
  }

  private winGame() {
    this.won = true;
    this.render();
    this.showOver("🎉 You cleared it!\nTap to restart");
  }

  private showOver(msg: string) {
    this.overText = this.add
      .text(W / 2, HUD + BOARD / 2, msg, {
        fontFamily: "system-ui",
        fontStyle: "bold",
        fontSize: "30px",
        color: "#ffffff",
        align: "center",
        backgroundColor: "#000000cc",
        padding: { x: 20, y: 16 },
      })
      .setOrigin(0.5)
      .setDepth(2000);
  }

  private render() {
    const g = this.gfx;
    g.clear();
    this.labels.forEach((l) => l.destroy());
    this.labels = [];

    let flags = 0;
    for (let r = 0; r < GRID; r++)
      for (let c = 0; c < GRID; c++) if (this.cells[r][c].flagged) flags++;
    const minesLeft = MINES - flags;
    const status = this.over
      ? "LOST"
      : this.won
      ? "WON"
      : `Mines: ${minesLeft}`;
    this.statusText.setText(status);

    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const cell = this.cells[r][c];
        const x = c * CELL;
        const y = HUD + r * CELL;
        if (cell.revealed) {
          if (cell.mine) {
            g.fillStyle(0xff5c6e, 1).fillRect(x, y, CELL, CELL);
            this.addLabel(x + CELL / 2, y + CELL / 2, "💣", CELL * 0.5, "#000000");
          } else {
            g.fillStyle(0x1c1c2a, 1).fillRect(x, y, CELL, CELL);
            if (cell.adj > 0)
              this.addLabel(
                x + CELL / 2,
                y + CELL / 2,
                "" + cell.adj,
                CELL * 0.55,
                NUM_COLORS[cell.adj] ?? "#ffffff"
              );
          }
        } else {
          g.fillStyle(0x39395a, 1).fillRect(x, y, CELL, CELL);
          if (cell.flagged) this.addLabel(x + CELL / 2, y + CELL / 2, "🚩", CELL * 0.5, "#ffffff");
        }
        g.lineStyle(1, 0x0b0b14, 1).strokeRect(x, y, CELL, CELL);
      }
    }
  }

  private addLabel(x: number, y: number, text: string, size: number, color: string) {
    this.labels.push(
      this.add
        .text(x, y, text, {
          fontFamily: "system-ui",
          fontStyle: "bold",
          fontSize: `${size}px`,
          color,
        })
        .setOrigin(0.5)
        .setDepth(500)
    );
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, MinesweeperScene));
