import { useEffect, useState } from "react";
import Phaser from "phaser";
import { characters, type Character } from "./data/characters";
import {
  caseObjective,
  caseTitle,
  evidenceByNpcId,
  type Evidence,
} from "./data/case";
import { MainScene } from "./game/MainScene";
import "./index.css";

type ChatLine = {
  speaker: string;
  text: string;
};

type Conversation = {
  npc: Character;
  lines: ChatLine[];
};

export default function App() {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [showEvidenceBoard, setShowEvidenceBoard] = useState(false);

  useEffect(() => {
    const openChat = (event: Event) => {
      const npcEvent = event as CustomEvent<{ name: string }>;
      const npc = characters.find(
        (character) => character.name === npcEvent.detail.name,
      );

      if (!npc) return;

      setConversation({
        npc,
        lines: [{ speaker: npc.name, text: npc.greeting }],
      });
    };

    const closeChat = () => setConversation(null);

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

  const askQuestion = (question: string, reply: string) => {
    setConversation((current) => {
      if (!current) return null;

      return {
        ...current,
        lines: [
          ...current.lines,
          { speaker: "You", text: question },
          { speaker: current.npc.name, text: reply },
        ],
      };
    });
  };

  const collectEvidence = () => {
    if (!conversation) return;

    const newEvidence = evidenceByNpcId[conversation.npc.id];

    if (!newEvidence) return;

    const isAlreadyCollected = evidence.some(
      (item) => item.id === newEvidence.id,
    );

    if (!isAlreadyCollected) {
      setEvidence((current) => [...current, newEvidence]);

      setConversation((current) => {
        if (!current) return null;

        return {
          ...current,
          lines: [
            ...current.lines,
            {
              speaker: "System",
              text: `Evidence collected: ${newEvidence.title}`,
            },
          ],
        };
      });
    }
  };

  const openTrial = () => {
    const judge = characters.find((character) => character.id === "orion");

    if (!judge) return;

    setConversation({
      npc: judge,
      lines: [
        {
          speaker: judge.name,
          text: "Three clues have been submitted. The preliminary trial may begin.",
        },
        {
          speaker: judge.name,
          text: "Review your evidence carefully. A verdict without proof is not justice.",
        },
      ],
    });
  };

  return (
    <main>
      <header>
        <h1>Verdict Block</h1>
        <p>Explore the facility. Speak with residents. Find the truth.</p>
        <section className="case-file">
          <strong>Case: {caseTitle}</strong>
          <span>{caseObjective}</span>
          <span>Evidence: {evidence.length}/3</span>

          <div className="case-actions">
            <button onClick={() => setShowEvidenceBoard((current) => !current)}>
              {showEvidenceBoard ? "Hide evidence board" : "Open evidence board"}
            </button>

            {evidence.length >= 3 ? (
              <button onClick={openTrial}>Present evidence to Judge Orion</button>
            ) : (
              <span className="locked-trial">
                Trial locked: collect {3 - evidence.length} more clue(s)
              </span>
            )}
          </div>
        </section>
      </header>

      <div id="game-root" />

      {showEvidenceBoard && (
        <section className="evidence-board">
          <h2>Evidence Board</h2>

          {evidence.length === 0 ? (
            <p>No evidence collected yet.</p>
          ) : (
            <ul>
              {evidence.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {conversation && (
        <section className="dialogue-panel">
          <div className="npc-summary">
            <div>
              <h2>{conversation.npc.name}</h2>
              <p>
                {conversation.npc.role} · {conversation.npc.mood}
              </p>
            </div>
            <span>Trust: {conversation.npc.trust}/100</span>
          </div>

          <div className="chat-lines">
            {conversation.lines.map((line, index) => (
              <p key={`${line.speaker}-${index}`}>
                <strong>{line.speaker}:</strong> {line.text}
              </p>
            ))}
          </div>

          <div className="dialogue-actions">
            <button onClick={collectEvidence}>
              Ask about suspicious activity
            </button>
            <button
              onClick={() =>
                askQuestion(
                  "What do you know about this facility?",
                  conversation.npc.facilityReply,
                )
              }
            >
              Ask about the facility
            </button>

            <button
              onClick={() =>
                askQuestion(
                  "Where were you earlier?",
                  conversation.npc.alibiReply,
                )
              }
            >
              Ask for their alibi
            </button>

            <button onClick={() => setConversation(null)}>End conversation</button>
          </div>
        </section>
      )}
    </main>
  );
}
