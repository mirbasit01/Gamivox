import PhaserGame from "./PhaserGame";

/** Framed stage around the Phaser canvas. Fullscreen is handled inside PhaserGame. */
export default function GameStage({ slug, accent }: { slug: string; accent: string }) {
  return (
    <div
      className="relative rounded-2xl bg-black/50 p-2 sm:p-4"
      style={{ boxShadow: `inset 0 0 60px -30px ${accent}` }}
    >
      <PhaserGame slug={slug} />
    </div>
  );
}
