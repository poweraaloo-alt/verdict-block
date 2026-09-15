export type Point = {
  x: number;
  y: number;
};

export type Character = {
  id: string;
  name: string;
  color: number;
  x: number;
  y: number;
  route: Point[];
};

export const characters: Character[] = [
  {
    id: "asha",
    name: "Asha",
    color: 0xf4a261,
    x: 150,
    y: 140,
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
    color: 0xe76f51,
    x: 380,
    y: 140,
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
    color: 0x9b5de5,
    x: 610,
    y: 140,
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
    color: 0x2a9d8f,
    x: 840,
    y: 140,
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
    color: 0x457b9d,
    x: 480,
    y: 560,
    route: [
      { x: 480, y: 560 },
      { x: 480, y: 510 },
      { x: 480, y: 560 },
    ],
  },
];