import { useState } from "react";
import type { SocialGraph } from "../data/social";

type Participant = { id: string; name: string; role: string };

type TrialPanelProps = {
  defendantId: string;
  survivors: string[];
  socialGraph: SocialGraph;
  onElimination: (participantId: string) => void;
  onClose: () => void;
};

const participants: Participant[] = [
  { id: "player", name: "You", role: "Participant" },
  { id: "asha", name: "Asha", role: "Medical student" },
  { id: "kabir", name: "Kabir", role: "Athlete" },
  { id: "meera", name: "Meera", role: "Programmer" },
  { id: "nikhil", name: "Nikhil", role: "Artist" },
];

const npcDefenses: Record<string, string> = {
  asha: "I keep people stable when panic takes over. Removing me weakens every survivor.",
  kabir: "I can protect the group when the facility turns dangerous. I am useful alive.",
  meera: "I understand the systems that control this place. My knowledge keeps options open.",
  nikhil: "I notice what others miss. My information is worth more than a quick elimination.",
};

export function TrialPanel({
  defendantId,
  survivors,
  socialGraph,
  onElimination,
  onClose,
}: TrialPanelProps) {
  const [defense, setDefense] = useState("");
  const [playerVote, setPlayerVote] = useState<"spare" | "eliminate">("spare");
  const [verdict, setVerdict] = useState<string | null>(null);
  const defendant = participants.find((participant) => participant.id === defendantId);
  const playerIsDefendant = defendantId === "player";
  const npcVoters = participants.filter(
    (participant) => participant.id !== "player" && participant.id !== defendantId && survivors.includes(participant.id),
  );

  if (!defendant) return null;

  const resolveTrial = () => {
    const defenseText = playerIsDefendant
      ? defense.trim()
      : npcDefenses[defendantId] ?? "I can still contribute to the group.";

    if (playerIsDefendant && defenseText.length < 20) {
      setVerdict("Judge Orion: A defense must explain why your continued existence has value.");
      return;
    }

    const spareVotes = npcVoters.filter((voter) => {
      const relationship = socialGraph[voter.id]?.[defendantId];
      if (!relationship) return false;

      const support = relationship.trust + relationship.reliance + relationship.fear * 0.5 + (relationship.allied ? 25 : 0);
      return support >= 60;
    }).length;
    const totalVotes = npcVoters.length + (playerIsDefendant ? 0 : 1);
    const supportVotes = spareVotes + (!playerIsDefendant && playerVote === "spare" ? 1 : 0);
    const defenseValue = Math.min(25, Math.floor(defenseText.length / 8));
    const spared = supportVotes * 20 + defenseValue >= Math.ceil(totalVotes * 12);

    if (spared) {
      setVerdict(`Judge Orion: ${defendant.name} may remain. Support was sufficient. The protocol makes no claim that this outcome is fair.`);
      return;
    }

    onElimination(defendantId);
    setVerdict(`Judge Orion: ${defendant.name} has not justified continued existence. Elimination is authorized.`);
  };

  return (
    <section className="trial-overlay" aria-label="Survival trial">
      <div className="trial-panel">
        <p className="trial-kicker">Judge Orion's Morning Trial</p>
        <h2>{defendant.name} has been selected</h2>
        <p className="judge-question">“Why should I let you exist?”</p>
        <p>The Judge knows the full record. A direct lie carries no value; framing, usefulness, and social support may still preserve a participant.</p>

        {playerIsDefendant ? (
          <label className="defense-input">
            Your defense
            <textarea value={defense} onChange={(event) => setDefense(event.target.value)} placeholder="Explain why the group or facility needs you alive..." rows={5} />
          </label>
        ) : (
          <section className="npc-defense">
            <strong>{defendant.name}'s defense</strong>
            <p>{npcDefenses[defendantId]}</p>
          </section>
        )}

        {!playerIsDefendant && !verdict && (
          <section className="player-vote">
            <h3>Your vote</h3>
            <button className={playerVote === "spare" ? "selected" : ""} onClick={() => setPlayerVote("spare")}>Let them remain</button>
            <button className={playerVote === "eliminate" ? "selected" : ""} onClick={() => setPlayerVote("eliminate")}>Eliminate them</button>
          </section>
        )}

        {verdict ? (
          <div className="verdict">
            <strong>Judge Orion:</strong> {verdict}
            <button onClick={onClose}>Continue survival game</button>
          </div>
        ) : (
          <div className="trial-actions">
            <button className="accuse-button" onClick={resolveTrial}>Submit to Judge Orion</button>
          </div>
        )}
      </div>
    </section>
  );
}
