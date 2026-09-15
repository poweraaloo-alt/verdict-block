export type Evidence = {
  id: string;
  title: string;
  description: string;
  sourceNpcId: string;
};

export const caseTitle = "The Tampered Security Terminal";

export const caseObjective =
  "Collect three reliable clues before Judge Orion opens the trial.";

export const evidenceByNpcId: Record<string, Evidence> = {
  asha: {
    id: "broken-access-card",
    title: "Broken access card",
    description:
      "Asha found a damaged access card outside the security terminal.",
    sourceNpcId: "asha",
  },
  kabir: {
    id: "hallway-argument",
    title: "Heard argument",
    description:
      "Kabir heard a heated argument near the library shortly before the terminal was altered.",
    sourceNpcId: "kabir",
  },
  meera: {
    id: "timestamp-mismatch",
    title: "Timestamp mismatch",
    description:
      "Meera admits the security log is twelve minutes out of sync.",
    sourceNpcId: "meera",
  },
  nikhil: {
    id: "library-sketch",
    title: "Library sketch",
    description:
      "Nikhil's sketch places someone near the security terminal at an important time.",
    sourceNpcId: "nikhil",
  },
};