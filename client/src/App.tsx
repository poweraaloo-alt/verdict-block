import { useEffect, useState } from "react";
import Phaser from "phaser";
import { MainScene } from "./game/MainScene";
import "./index.css";

export default function App() {
  const [talkingTo, setTalkingTo] = useState<string | null>(null);

  useEffect(() => {
    const openChat = (event: Event) => {
      const npcEvent = event as CustomEvent<{ name: string }>;
      setTalkingTo(npcEvent.detail.name);
    };

    const closeChat = () => setTalkingTo(null);

    window.addEventListener("npc-chat-open", openChat);
    window.addEventListener("npc-chat-close", closeChat);

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: 960,
      height: 640,
      parent: "game-root",
      backgroundColor: "#11111c",
      scene: [MainScene],
    });

    return () => {
      window.removeEventListener("npc-chat-open", openChat);
      window.removeEventListener("npc-chat-close", closeChat);
      game.destroy(true);
    };
  }, []);

  return (
    <main>
      <header>
        <h1>Verdict Block</h1>
        <p>Explore the facility. Speak with residents. Find the truth.</p>
      </header>

      <div id="game-root" />

      {talkingTo && (
        <section className="dialogue-panel">
          <h2>{talkingTo}</h2>
          <p>This is a temporary dialogue window. AI conversations come next.</p>
          <button onClick={() => setTalkingTo(null)}>Close</button>
        </section>
      )}
    </main>
  );
}