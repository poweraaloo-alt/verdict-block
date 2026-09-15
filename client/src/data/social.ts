export type Relationship = {
  trust: number;
  fear: number;
  reliance: number;
  allied: boolean;
};

export type SocialGraph = Record<string, Record<string, Relationship>>;

const participantIds = ["player", "asha", "kabir", "meera", "nikhil"];

export function createInitialSocialGraph(): SocialGraph {
  const graph: SocialGraph = {};

  for (const sourceId of participantIds) {
    graph[sourceId] = {};

    for (const targetId of participantIds) {
      if (sourceId === targetId) continue;

      graph[sourceId][targetId] = {
        trust: 35,
        fear: 5,
        reliance: 15,
        allied: false,
      };
    }
  }

  graph.player.asha.trust = 50;
  graph.asha.player.trust = 45;
  graph.player.meera.trust = 40;
  graph.meera.player.trust = 40;
  graph.kabir.meera.fear = 20;
  graph.nikhil.asha.trust = 55;

  return graph;
}
