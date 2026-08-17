import * as Phaser from "phaser";
import { baseConfig, hudText, type CreateGame } from "../_shared";

const W = 480, H = 480, HUD = 60;
const SUITS = ["♠","♥","♦","♣"];
const VALUES = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

function cardValue(v: string): number {
  if (v === "A") return 11;
  if (["J","Q","K"].includes(v)) return 10;
  return parseInt(v);
}

function handValue(hand: string[]): number {
  let total = hand.reduce((s, c) => s + cardValue(c.slice(0, -1)), 0);
  let aces = hand.filter(c => c.startsWith("A")).length;
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

class BlackjackScene extends Phaser.Scene {
  private gfx!: Phaser.GameObjects.Graphics;
  private deck: string[] = [];
  private playerHand: string[] = [];
  private dealerHand: string[] = [];
  private phase: "bet" | "play" | "over" = "bet";
  private chips = 100;
  private bet = 10;
  private statusText!: Phaser.GameObjects.Text;
  private chipsText!: Phaser.GameObjects.Text;
  private betText!: Phaser.GameObjects.Text;
  private cardTexts: Phaser.GameObjects.Text[] = [];

  constructor() { super("blackjack"); }

  create() {
    this.gfx = this.add.graphics();
    hudText(this, W / 2, 16, "Blackjack", 22, "#ffd15c").setOrigin(0.5, 0);
    this.chipsText = hudText(this, 16, 16, "Chips: 100", 20, "#00ffa3");
    this.betText = hudText(this, W - 16, 16, "Bet: 10", 20, "#ffd15c").setOrigin(1, 0);
    this.statusText = hudText(this, W / 2, H - 30, "", 18, "#ffffff").setOrigin(0.5);
    // buttons
    const btns = [["Deal", W/2-80, H-70, "#ffd15c"], ["Hit", W/2-80, H-70, "#00ffa3"], ["Stand", W/2+80, H-70, "#ff3b4e"], ["+10", 60, H-70, "#00d4ff"], ["-10", 160, H-70, "#ff8a5c"]];
    btns.forEach(([label, x, y, color]) => {
      this.add.text(+x, +y, label as string, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "20px", color: color as string, backgroundColor: "#111122", padding: { x: 12, y: 6 } }).setOrigin(0.5).setDepth(100).setInteractive().on("pointerdown", () => this.onBtn(label as string));
    });
    this.reset();
  }

  reset() {
    this.deck = [];
    for (const s of SUITS) for (const v of VALUES) this.deck.push(v + s);
    Phaser.Utils.Array.Shuffle(this.deck);
    this.playerHand = []; this.dealerHand = [];
    this.phase = "bet";
    this.statusText.setText("Set bet and press Deal");
    this.chipsText.setText("Chips: " + this.chips);
    this.betText.setText("Bet: " + this.bet);
    this.cardTexts.forEach(t => t.destroy()); this.cardTexts = [];
  }

  draw_card() { return this.deck.pop() || "A♠"; }

  onBtn(label: string) {
    if (label === "+10") { if (this.phase === "bet") { this.bet = Math.min(this.chips, this.bet + 10); this.betText.setText("Bet: " + this.bet); } return; }
    if (label === "-10") { if (this.phase === "bet") { this.bet = Math.max(10, this.bet - 10); this.betText.setText("Bet: " + this.bet); } return; }
    if (label === "Deal" && this.phase === "bet") {
      if (this.chips < this.bet) { this.statusText.setText("Not enough chips!"); return; }
      this.chips -= this.bet; this.chipsText.setText("Chips: " + this.chips);
      this.playerHand = [this.draw_card(), this.draw_card()];
      this.dealerHand = [this.draw_card(), this.draw_card()];
      this.phase = "play";
      this.statusText.setText("Hit or Stand?");
      this.renderCards();
      if (handValue(this.playerHand) === 21) this.stand();
      return;
    }
    if (label === "Hit" && this.phase === "play") {
      this.playerHand.push(this.draw_card());
      this.renderCards();
      if (handValue(this.playerHand) > 21) { this.endRound("Bust! You lose."); }
      else if (handValue(this.playerHand) === 21) this.stand();
      return;
    }
    if (label === "Stand" && this.phase === "play") { this.stand(); return; }
    if (this.phase === "over") { if (this.chips <= 0) { this.chips = 100; this.bet = 10; } this.reset(); }
  }

  stand() {
    while (handValue(this.dealerHand) < 17) this.dealerHand.push(this.draw_card());
    this.renderCards(true);
    const pv = handValue(this.playerHand), dv = handValue(this.dealerHand);
    if (dv > 21 || pv > dv) { this.chips += this.bet * 2; this.endRound(`You win! +${this.bet}`); }
    else if (pv === dv) { this.chips += this.bet; this.endRound("Push! Bet returned."); }
    else { this.endRound(`Dealer wins. -${this.bet}`); }
  }

  endRound(msg: string) {
    this.phase = "over";
    this.chipsText.setText("Chips: " + this.chips);
    this.statusText.setText(msg + " | Tap Deal to continue");
  }

  renderCards(showDealer = false) {
    this.cardTexts.forEach(t => t.destroy()); this.cardTexts = [];
    const isRed = (c: string) => c.endsWith("♥") || c.endsWith("♦");
    this.playerHand.forEach((c, i) => {
      const t = this.add.text(30 + i * 50, HUD + 180, c, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "18px", color: isRed(c) ? "#ff3b4e" : "#ffffff", backgroundColor: "#1a1a2e", padding: { x: 6, y: 4 } }).setDepth(100);
      this.cardTexts.push(t);
    });
    this.dealerHand.forEach((c, i) => {
      const hidden = !showDealer && this.phase === "play" && i === 1;
      const t = this.add.text(30 + i * 50, HUD + 80, hidden ? "??" : c, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "18px", color: hidden ? "#555577" : (isRed(c) ? "#ff3b4e" : "#ffffff"), backgroundColor: "#1a1a2e", padding: { x: 6, y: 4 } }).setDepth(100);
      this.cardTexts.push(t);
    });
    const pv = handValue(this.playerHand);
    const dv = showDealer ? handValue(this.dealerHand) : cardValue(this.dealerHand[0].slice(0, -1));
    const pt = this.add.text(W - 20, HUD + 190, "You: " + pv, { fontFamily: "system-ui", fontStyle: "bold", fontSize: "16px", color: pv > 21 ? "#ff3b4e" : "#00ffa3" }).setOrigin(1, 0).setDepth(100);
    const dt = this.add.text(W - 20, HUD + 90, "Dealer: " + (showDealer ? dv : "?"), { fontFamily: "system-ui", fontStyle: "bold", fontSize: "16px", color: "#888899" }).setOrigin(1, 0).setDepth(100);
    this.cardTexts.push(pt, dt);
  }

  update() { this.draw(); }

  draw() {
    const g = this.gfx;
    g.clear();
    g.fillStyle(0x0a1a0a).fillRect(0, 0, W, H);
    g.fillStyle(0x0d2a0d).fillRoundedRect(20, HUD + 60, W - 40, H - HUD - 120, 16);
    g.lineStyle(1, 0x1a4a1a).strokeRoundedRect(20, HUD + 60, W - 40, H - HUD - 120, 16);
    g.lineStyle(1, 0x1a4a1a).beginPath().moveTo(20, HUD + 160).lineTo(W - 20, HUD + 160).strokePath();
    this.add.text(30, HUD + 68, "Dealer", { fontFamily: "system-ui", fontSize: "13px", color: "#555577" }).setDepth(100);
    this.add.text(30, HUD + 168, "You", { fontFamily: "system-ui", fontSize: "13px", color: "#555577" }).setDepth(100);
  }
}

export const createGame: CreateGame = (parent) => new Phaser.Game(baseConfig(parent, W, H, BlackjackScene));
