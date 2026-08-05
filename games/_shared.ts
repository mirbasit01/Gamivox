import * as Phaser from "phaser";

export type CreateGame = (parent: HTMLElement) => Phaser.Game;

/** Standard config shared by every game. Games are pure-graphics (no assets). */
export function baseConfig(
  parent: HTMLElement,
  width: number,
  height: number,
  scene: Phaser.Types.Scenes.SceneType | Phaser.Types.Scenes.SceneType[],
  extra: Partial<Phaser.Types.Core.GameConfig> = {}
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width,
    height,
    backgroundColor: "#0b0b14",
    // None of the games use sound — disabling audio avoids creating an
    // AudioContext (and the "Cannot suspend a closed AudioContext" error
    // when a game is destroyed/reloaded).
    audio: { noAudio: true },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene,
    ...extra,
  };
}

/** Rounded HUD-style text helper. */
export function hudText(
  scene: Phaser.Scene,
  x: number,
  y: number,
  text: string,
  size = 20,
  color = "#ffffff"
): Phaser.GameObjects.Text {
  return scene.add
    .text(x, y, text, {
      fontFamily: "system-ui, sans-serif",
      fontStyle: "bold",
      fontSize: `${size}px`,
      color,
    })
    .setDepth(1000);
}
