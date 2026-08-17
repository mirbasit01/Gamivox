import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 520, HUD = 60;
const COLS = 8, ROWS = 8, CELL = Math.floor((W - 40) / COLS), OX = 20, OY = HUD + 10;

// 0=empty, 1=red, 2=red-king, 3=black, 4=black-king
class CheckersScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private board: number[][] = [];
  private selected = { r: -1, c: -1 };
  private turn = 1; // 1=red(bottom), 3=black(top)
  private statusText!: Phaser.GameObjects.Text;
  private over = false;
  private overText?: Phaser.GameObjects.Text;

  constructor() { super("checkers"); }

  create() {
    this.gfx = this.add.graphics();
    hudText(this, W / 2, 16, "Checkers", 22, "#ffd15c").setOrigin(0.5, 0);
    this.statusText = hudText(this, W / 2, H - 30, "Red's turn", 18, "#ff3b4e").setOrigin(0.5);
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.over) { this.reset(); return; }
      const c = Math.floor((p.x - OX) / CELL), r = Math.floor((p.y - OY) / CELL);
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return;
      this.onTap(r, c);
    });
    this.reset();
  }

  reset() {
    this.board = Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => {
      if ((r + c) % 2 === 1) { if (r < 3) return 3; if (r > 4) return 1; } return 0;
    }));
    this.selected = { r: -1, c: -1 }; this.turn = 1; this.over = false;
    this.statusText?.setText("Red's turn").setColor("#ff3b4e");
    this.overText?.destroy(); this.overText = undefined;
  }

  isRed(v: number) { return v === 1 || v === 2; }
  isBlack(v: number) { return v === 3 || v === 4; }
  isKing(v: number) { return v === 2 || v === 4; }
  isMine(v: number) { return this.turn === 1 ? this.isRed(v) : this.isBlack(v); }

  getMoves(r: number, c: number): [number, number, number, number][] {
    const v = this.board[r][c];
    if (!v || !this.isMine(v)) return [];
    const dirs: [number, number][] = [];
    if (this.isRed(v) || this.isKing(v)) dirs.push([-1, -1], [-1, 1]);
    if (this.isBlack(v) || this.isKing(v)) dirs.push([1, -1], [1, 1]);
    const moves: [number, number, number, number][] = [];
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && this.board[nr][nc] === 0) moves.push([nr, nc, -1, -1]);
      const jr = r + dr * 2, jc = c + dc * 2;
      if (jr >= 0 && jr < ROWS && jc >= 0 && jc < COLS && this.board[jr][jc] === 0) {
        const mid = this.board[nr]?.[nc];
        if (mid && (this.turn === 1 ? this.isBlack(mid) : this.isRed(mid))) moves.push([jr, jc, nr, nc]);
      }
    }
    return moves;
  }

  onTap(r: number, c: number) {
    const v = this.board[r][c];
    if (this.selected.r < 0) {
      if (this.isMine(v)) this.selected = { r, c };
      return;
    }
    const moves = this.getMoves(this.selected.r, this.selected.c);
    const move = moves.find(([mr, mc]) => mr === r && mc === c);
    if (move) {
      this.board[r][c] = this.board[this.selected.r][this.selected.c];
      this.board[this.selected.r][this.selected.c] = 0;
      if (move[2] >= 0) this.board[move[2]][move[3]] = 0;
      // king promotion
      if (r === 0 && this.isRed(this.board[r][c])) this.board[r][c] = 2;
      if (r === ROWS - 1 && this.isBlack(this.board[r][c])) this.board[r][c] = 4;
      this.selected = { r: -1, c: -1 };
      this.turn = this.turn === 1 ? 3 : 1;
      this.statusText.setText(this.turn === 1 ? "Red's turn" : "Black's turn").setColor(this.turn === 1 ? "#ff3b4e" : "#888899");
      // check win
      const reds = this.board.flat().filter(v => this.isRed(v)).length;
      const blacks = this.board.flat().filter(v => this.isBlack(v)).length;
      if (reds === 0 || blacks === 0) {
        this.over = true;
        const winner = reds === 0 ? "Black" : "Red";
        this.overText = this.add.text(W / 2, H / 2, `${winner} Wins!\nTap to restart`, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "36px", color: "#fff", align: "center", backgroundColor: "#000000cc", padding: { x: 20, y: 14 } }).setOrigin(0.5).setDepth(2000);
      }
    } else if (this.isMine(v)) { this.selected = { r, c }; }
    else { this.selected = { r: -1, c: -1 }; }
  }

  update() { this.draw(); }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0b0b14).fillRect(0, 0, W, H);
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      const x = OX + c * CELL, y = OY + r * CELL;
      g.fillStyle((r + c) % 2 === 0 ? 0x1a1a2e : 0x2a1a0a).fillRect(x, y, CELL, CELL);
      const v = this.board[r][c];
      if (v) {
        const color = this.isRed(v) ? 0xff3b4e : 0x888899;
        const sel = this.selected.r === r && this.selected.c === c;
        g.fillStyle(color, 0.3).fillCircle(x + CELL / 2, y + CELL / 2, CELL / 2 - 2);
        g.fillStyle(color).fillCircle(x + CELL / 2, y + CELL / 2, CELL / 2 - 5);
        if (this.isKing(v)) { g.fillStyle(0xffd15c).fillCircle(x + CELL / 2, y + CELL / 2, 6); }
        if (sel) g.lineStyle(2, 0xffd15c).strokeCircle(x + CELL / 2, y + CELL / 2, CELL / 2 - 3);
      }
    }
    // highlight valid moves
    if (this.selected.r >= 0) {
      const moves = this.getMoves(this.selected.r, this.selected.c);
      moves.forEach(([mr, mc]) => { g.fillStyle(0xffd15c, 0.3).fillCircle(OX + mc * CELL + CELL / 2, OY + mr * CELL + CELL / 2, CELL / 2 - 5); });
    }
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, CheckersScene));
