import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "./_shared";

const W = 480;
const H = 560;
const HUD = 60;
const COLS = 4;
const ROWS = 4;
const PAD = 12;
const BOARD = W;
const CELL = (BOARD - PAD * (COLS + 1)) / COLS;

const SYMBOLS = ["🍎", "🍌", "🍇", "🍒", "🍑", "🍉", "🥝", "🍓"];

interface Card {
  index: number;
  symbol: string;
  matched: boolean;
  faceUp: boolean;
  rect: Phaser.GameObjects.Rectangle;
  label: Phaser.GameObjects.Text;
}

class MemoryMatchScene extends Phaser.Scene {
  private cards: Card[] = [];
  private first?: Card;
  private second?: Card;
  private busy = false;
  private moves = 0;
  private matches = 0;
  private won = false;
  private movesText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private overText?: Phaser.GameObjects.Text;

  constructor() {
    super("memorymatch");
  }

  create() {
    this.movesText = hudText(this, 16, 18, "Moves 0", 24, "#ff9f5c");
    this.statusText = hudText(this, W - 150, 20, "Find 8 pairs", 20, "#8bd5ff");
    this.buildBoard();

    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      if (this.won) {
        this.restart();
        return;
      }
      this.handleTap(p.x, p.y);
    });
  }

  private buildBoard() {
    // build deck of 8 pairs, shuffled
    const deck: string[] = [];
    SYMBOLS.forEach((s) => {
      deck.push(s, s);
    });
    Phaser.Utils.Array.Shuffle(deck);

    this.cards = [];
    for (let i = 0; i < deck.length; i++) {
      const r = Math.floor(i / COLS);
      const c = i % COLS;
      const x = PAD + c * (CELL + PAD) + CELL / 2;
      const y = HUD + PAD + r * (CELL + PAD) + CELL / 2;
      const rect = this.add
        .rectangle(x, y, CELL, CELL, 0x2b2b40)
        .setStrokeStyle(3, 0x5c8bff)
        .setDepth(1);
      const label = this.add
        .text(x, y, deck[i], { fontSize: `${CELL * 0.55}px` })
        .setOrigin(0.5)
        .setDepth(2)
        .setVisible(false);
      this.cards.push({
        index: i,
        symbol: deck[i],
        matched: false,
        faceUp: false,
        rect,
        label,
      });
    }
  }

  private handleTap(px: number, py: number) {
    if (this.busy) return;
    const card = this.cards.find(
      (cd) =>
        !cd.faceUp &&
        !cd.matched &&
        Math.abs(px - cd.rect.x) <= CELL / 2 &&
        Math.abs(py - cd.rect.y) <= CELL / 2
    );
    if (!card) return;
    this.flipUp(card);

    if (!this.first) {
      this.first = card;
    } else if (!this.second) {
      this.second = card;
      this.moves++;
      this.movesText.setText("Moves " + this.moves);
      this.checkPair();
    }
  }

  private flipUp(card: Card) {
    card.faceUp = true;
    card.rect.setFillStyle(0x3a3a5a);
    card.label.setVisible(true);
  }

  private flipDown(card: Card) {
    card.faceUp = false;
    card.rect.setFillStyle(0x2b2b40);
    card.label.setVisible(false);
  }

  private checkPair() {
    const a = this.first;
    const b = this.second;
    if (!a || !b) return;
    if (a.symbol === b.symbol) {
      a.matched = true;
      b.matched = true;
      a.rect.setFillStyle(0x00ffa3);
      b.rect.setFillStyle(0x00ffa3);
      this.matches++;
      this.first = undefined;
      this.second = undefined;
      if (this.matches === SYMBOLS.length) this.win();
    } else {
      this.busy = true;
      this.time.delayedCall(750, () => {
        this.flipDown(a);
        this.flipDown(b);
        this.first = undefined;
        this.second = undefined;
        this.busy = false;
      });
    }
  }

  private win() {
    this.won = true;
    this.statusText.setText("Solved!");
    this.overText = this.add
      .text(W / 2, HUD + BOARD / 2, `You win in ${this.moves} moves!\nTap to play again`, {
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

  private restart() {
    this.cards.forEach((c) => {
      c.rect.destroy();
      c.label.destroy();
    });
    this.cards = [];
    this.first = undefined;
    this.second = undefined;
    this.busy = false;
    this.moves = 0;
    this.matches = 0;
    this.won = false;
    this.overText?.destroy();
    this.overText = undefined;
    this.movesText.setText("Moves 0");
    this.statusText.setText("Find 8 pairs");
    this.buildBoard();
  }
}

export const createGame: CreateGame = (parent) =>
  new Phaser.Game(baseConfig(parent, W, H, MemoryMatchScene));
