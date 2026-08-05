import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480;
const H = 560;
const HUD = 60;
const N = 4;
const PAD = 10;
const BOARD = W;
const CELL = (BOARD - PAD * (N + 1)) / N;

class Slide15Scene extends Phaser.Scene {
  // tiles: array of length 16, value 0 = empty gap
  private tiles: number[] = [];
  private gfx!: Phaser.GameObjects.Graphics;
  private labels: Phaser.GameObjects.Text[] = [];
  private moves = 0;
  private solved = false;
  private movesText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private overText?: Phaser.GameObjects.Text;

  constructor() {
    super("slide15");
  }

  create() {
    this.gfx = this.add.graphics();
    this.movesText = hudText(this, 16, 18, "Moves 0", 24, "#ff9f5c");
    this.statusText = hudText(this, W - 150, 20, "Slide to solve", 18, "#8bd5ff");

    this.shuffle();

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.solved) {
        this.shuffle();
        return;
      }
      if (p.y < HUD) return;
      const c = Math.floor((p.x - PAD) / (CELL + PAD));
      const r = Math.floor((p.y - HUD - PAD) / (CELL + PAD));
      if (r < 0 || r >= N || c < 0 || c >= N) return;
      this.tryMove(r * N + c);
    });

    this.input.keyboard!.on("keydown", (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "r") {
        this.shuffle();
        return;
      }
      if (this.solved) return;
      const gap = this.tiles.indexOf(0);
      const gr = Math.floor(gap / N);
      const gc = gap % N;
      // arrow moves the tile from that direction into the gap
      if ((k === "arrowup" || k === "w") && gr < N - 1) this.tryMove((gr + 1) * N + gc);
      else if ((k === "arrowdown" || k === "s") && gr > 0) this.tryMove((gr - 1) * N + gc);
      else if ((k === "arrowleft" || k === "a") && gc < N - 1) this.tryMove(gr * N + gc + 1);
      else if ((k === "arrowright" || k === "d") && gc > 0) this.tryMove(gr * N + gc - 1);
    });
  }

  private shuffle() {
    this.tiles = Array.from({ length: N * N }, (_, i) => (i + 1) % (N * N));
    // this.tiles now = [1,2,...,15,0] solved. Do many random valid moves.
    let gap = N * N - 1;
    let prev = -1;
    for (let i = 0; i < 400; i++) {
      const gr = Math.floor(gap / N);
      const gc = gap % N;
      const neigh: number[] = [];
      if (gr > 0) neigh.push(gap - N);
      if (gr < N - 1) neigh.push(gap + N);
      if (gc > 0) neigh.push(gap - 1);
      if (gc < N - 1) neigh.push(gap + 1);
      const choices = neigh.filter((n) => n !== prev);
      const pick = Phaser.Utils.Array.GetRandom(choices.length ? choices : neigh);
      this.tiles[gap] = this.tiles[pick];
      this.tiles[pick] = 0;
      prev = gap;
      gap = pick;
    }
    this.moves = 0;
    this.solved = false;
    this.overText?.destroy();
    this.overText = undefined;
    this.movesText.setText("Moves 0");
    this.statusText.setText("Slide to solve");
    this.render();
  }

  private tryMove(idx: number) {
    const gap = this.tiles.indexOf(0);
    const gr = Math.floor(gap / N);
    const gc = gap % N;
    const r = Math.floor(idx / N);
    const c = idx % N;
    const adjacent = Math.abs(gr - r) + Math.abs(gc - c) === 1;
    if (!adjacent) return;
    this.tiles[gap] = this.tiles[idx];
    this.tiles[idx] = 0;
    this.moves++;
    this.movesText.setText("Moves " + this.moves);
    this.render();
    if (this.isSolved()) this.win();
  }

  private isSolved(): boolean {
    for (let i = 0; i < N * N - 1; i++) if (this.tiles[i] !== i + 1) return false;
    return this.tiles[N * N - 1] === 0;
  }

  private win() {
    this.solved = true;
    this.statusText.setText("Solved!");
    this.overText = this.add
      .text(W / 2, HUD + BOARD / 2, `Solved in ${this.moves} moves!\nTap to shuffle`, {
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
    g.fillStyle(0x171722, 1).fillRoundedRect(0, HUD, BOARD, BOARD, 14);

    for (let i = 0; i < N * N; i++) {
      const v = this.tiles[i];
      const r = Math.floor(i / N);
      const c = i % N;
      const x = PAD + c * (CELL + PAD);
      const y = HUD + PAD + r * (CELL + PAD);
      if (v === 0) {
        g.fillStyle(0x22222f, 1).fillRoundedRect(x, y, CELL, CELL, 10);
      } else {
        g.fillStyle(0x5c8bff, 1).fillRoundedRect(x, y, CELL, CELL, 10);
        this.labels.push(
          this.add
            .text(x + CELL / 2, y + CELL / 2, "" + v, {
              fontFamily: "system-ui",
              fontStyle: "bold",
              fontSize: "38px",
              color: "#ffffff",
            })
            .setOrigin(0.5)
            .setDepth(500)
        );
      }
    }
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, Slide15Scene));
