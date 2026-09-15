import { useEffect, useState } from "react";
import Phaser from "phaser";
import { characters, type Character } from "./data/characters";
import { createInitialSocialGraph, type SocialGraph } from "./data/social";
import { TrialPanel } from "./components/TrialPanel";
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

const DAY_DURATION_SECONDS = 90;

export default function App() {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isTrialOpen, setIsTrialOpen] = useState(false);
  const [trialDefendantId, setTrialDefendantId] = useState<string | null>(null);
  const [socialGraph, setSocialGraph] = useState<SocialGraph>(createInitialSocialGraph);
  const [survivors, setSurvivors] = useState([
    "player",
    "asha",
    "kabir",
    "meera",
    "nikhil",
  ]);
  const [lastEliminated, setLastEliminated] = useState<string | null>(null);
  const [day, setDay] = useState(1);
  const [secondsUntilTrial, setSecondsUntilTrial] = useState(
    DAY_DURATION_SECONDS,
  );

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

  const isPlayerEliminated = !survivors.includes("player");
  const gameEnded = isPlayerEliminated || survivors.length <= 1;

  useEffect(() => {
    if (isTrialOpen || gameEnded) return;

    const timer = window.setInterval(() => {
      setSecondsUntilTrial((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gameEnded, isTrialOpen]);

  useEffect(() => {
    if (secondsUntilTrial !== 0 || isTrialOpen || gameEnded) return;

    const defendant = survivors[Math.floor(Math.random() * survivors.length)];
    setTrialDefendantId(defendant);
    setConversation(null);
    setIsTrialOpen(true);
  }, [gameEnded, isTrialOpen, secondsUntilTrial, survivors]);

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

  const continueAfterTrial = () => {
    setIsTrialOpen(false);
    setTrialDefendantId(null);

    if (gameEnded) return;

    setDay((current) => current + 1);
    setSecondsUntilTrial(DAY_DURATION_SECONDS);
  };

  const handleElimination = (participantId: string) => {
    setSurvivors((current) =>
      current.filter((survivorId) => survivorId !== participantId),
    );

    const participant =
      participantId === "player"
        ? { name: "You" }
        : characters.find((character) => character.id === participantId);

    setLastEliminated(participant?.name ?? "Unknown participant");

    if (participantId !== "player") {
      window.dispatchEvent(
        new CustomEvent("npc-eliminated", { detail: { id: participantId } }),
      );
    }
  };

  const cooperateWith = (npcId: string) => {
    setSocialGraph((current) => {
      const playerRelationship = current.player[npcId];
      const npcRelationship = current[npcId]?.player;

      if (!playerRelationship || !npcRelationship) return current;

      return {
        ...current,
        player: {
          ...current.player,
          [npcId]: {
            ...playerRelationship,
            trust: Math.min(100, playerRelationship.trust + 8),
            reliance: Math.min(100, playerRelationship.reliance + 4),
          },
        },
        [npcId]: {
          ...current[npcId],
          player: {
            ...npcRelationship,
            trust: Math.min(100, npcRelationship.trust + 6),
            reliance: Math.min(100, npcRelationship.reliance + 3),
          },
        },
      };
    });
  };

  const finalSurvivorId = survivors[0];
  const finalSurvivorName =
    finalSurvivorId === "player"
      ? "You"
      : characters.find((character) => character.id === finalSurvivorId)?.name;
  const currentRelationship = conversation
    ? socialGraph.player[conversation.npc.id]
    : null;

  return (
    <main>
      <header>
        <h1>Verdict Block</h1>
        <p>Survive the facility. Trust carefully. Morning trials are inevitable.</p>
        <section className="case-file">
          <strong>Survival Protocol</strong>
          <span>Build relationships before the morning trial begins.</span>
          <span>Survivors: {survivors.length}/5</span>
          <span>
            Day {day}, morning trial in {Math.floor(secondsUntilTrial / 60)}:
            {String(secondsUntilTrial % 60).padStart(2, "0")}
          </span>

          <div className="case-actions">
            {gameEnded ? (
              <span className="game-status">
                {isPlayerEliminated
                  ? "Survival run ended: you were eliminated."
                  : `${finalSurvivorName} is the final survivor.`}
              </span>
            ) : (
              <span className="locked-trial">
                Trial opens automatically when the morning timer ends.
              </span>
            )}
          </div>
        </section>
      </header>

      <div id="game-root" />

      {lastEliminated && (
        <p className="elimination-notice">
          Elimination recorded: {lastEliminated}
        </p>
      )}

      {gameEnded && (
        <section className="end-game-overlay">
          <div>
            <p className="trial-kicker">Survival protocol complete</p>
            <h2>
              {isPlayerEliminated
                ? "You have been eliminated."
                : "You are the last survivor."}
            </h2>
            <p>
              {isPlayerEliminated
                ? `${survivors.length} participant(s) remain in the facility.`
                : "You outlasted every other participant."}
            </p>
            <button onClick={() => window.location.reload()}>Restart scenario</button>
          </div>
        </section>
      )}

      {isTrialOpen && trialDefendantId && (
        <TrialPanel
          defendantId={trialDefendantId}
          survivors={survivors}
          socialGraph={socialGraph}
          onElimination={handleElimination}
          onClose={continueAfterTrial}
        />
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
            <span>
              Trust: {currentRelationship?.trust ?? 0}/100 · Reliance: {" "}
              {currentRelationship?.reliance ?? 0}/100
            </span>
          </div>

          <div className="chat-lines">
            {conversation.lines.map((line, index) => (
              <p key={`${line.speaker}-${index}`}>
                <strong>{line.speaker}:</strong> {line.text}
              </p>
            ))}
          </div>

          <div className="dialogue-actions">
            <button onClick={() => cooperateWith(conversation.npc.id)}>
              Offer cooperation
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
