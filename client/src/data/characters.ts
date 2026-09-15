export type Point = {
  x: number;
  y: number;
};

export type Character = {
  id: string;
  name: string;
  role: string;
  mood: string;
  trust: number;
  color: number;
  x: number;
  y: number;
  route: Point[];
  greeting: string;
  facilityReply: string;
  alibiReply: string;
};

export const characters: Character[] = [
  {
    id: "asha",
    name: "Asha",
    role: "Medical student",
    mood: "Composed",
    trust: 50,
    color: 0xf4a261,
    x: 150,
    y: 140,
    greeting: "You look unsettled. Try to stay calm and observe carefully.",
    facilityReply: "This place has rules, but rules are only useful when people obey them.",
    alibiReply: "I was in the dining area earlier. I saw Meera pass through the hall.",
    route: [
      { x: 150, y: 140 },
      { x: 400, y: 330 },
      { x: 220, y: 510 },
      { x: 400, y: 330 },
    ],
  },
  {
    id: "kabir",
    name: "Kabir",
    role: "Athlete",
    mood: "Irritated",
    trust: 35,
    color: 0xe76f51,
    x: 380,
    y: 140,
    greeting: "What do you want? I am busy trying to get out of here.",
    facilityReply: "The doors are locked, cameras are everywhere, and that judge is watching.",
    alibiReply: "I was in my room. No, I do not have anyone who can prove it.",
    route: [
      { x: 380, y: 140 },
      { x: 480, y: 330 },
      { x: 700, y: 510 },
      { x: 480, y: 330 },
    ],
  },
  {
    id: "meera",
    name: "Meera",
    role: "Programmer",
    mood: "Nervous",
    trust: 45,
    color: 0x9b5de5,
    x: 610,
    y: 140,
    greeting: "Oh—hello. I was just looking at the security system.",
    facilityReply: "The surveillance system is old, but someone has clearly maintained it.",
    alibiReply: "I was in the library. I think Nikhil may have seen me there.",
    route: [
      { x: 610, y: 140 },
      { x: 560, y: 330 },
      { x: 220, y: 510 },
      { x: 560, y: 330 },
    ],
  },
  {
    id: "nikhil",
    name: "Nikhil",
    role: "Artist",
    mood: "Withdrawn",
    trust: 40,
    color: 0x2a9d8f,
    x: 840,
    y: 140,
    greeting: "I prefer listening. People reveal more than they intend to.",
    facilityReply: "Every room here feels like a stage. We are all being watched.",
    alibiReply: "I was sketching in the library. I did not pay attention to the time.",
    route: [
      { x: 840, y: 140 },
      { x: 620, y: 330 },
      { x: 700, y: 510 },
      { x: 620, y: 330 },
    ],
  },
  {
    id: "orion",
    name: "Judge Orion",
    role: "Facility judge",
    mood: "Impartial",
    trust: 0,
    color: 0x457b9d,
    x: 480,
    y: 560,
    greeting: "Welcome, participant. Your continued existence will be evaluated.",
    facilityReply: "The facility exists to reduce its population. Fairness is not a condition of the protocol.",
    alibiReply: "I do not evaluate alibis. I evaluate whether a participant should remain.",
    route: [
      { x: 480, y: 560 },
      { x: 480, y: 510 },
      { x: 480, y: 560 },
    ],
  },
];
