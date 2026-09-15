import Phaser from "phaser";
import { characters, type Character } from "../data/characters";

type NpcActor = {
  character: Character;
  container: Phaser.GameObjects.Container;
};

export class MainScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Rectangle;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private escapeKey!: Phaser.Input.Keyboard.Key;
  private prompt!: Phaser.GameObjects.Text;
  private nearbyNpc: NpcActor | null = null;
  private npcActors: NpcActor[] = [];
  private onNpcEliminated = (event: Event) => {
    const npcEvent = event as CustomEvent<{ id: string }>;
    const npc = this.npcActors.find(
      (actor) => actor.character.id === npcEvent.detail.id,
    );

    if (!npc) return;

    this.tweens.killTweensOf(npc.container);
    npc.container.destroy();
    this.npcActors = this.npcActors.filter((actor) => actor !== npc);
  };

  constructor() {
    super("MainScene");
  }

  create() {
    this.drawMap();

    this.player = this.add.rectangle(480, 330, 28, 28, 0xffffff);
    this.add.text(448, 355, "MC", {
      fontSize: "14px",
      color: "#ffffff",
    });

    for (const character of characters) {
      const body = this.add.circle(0, 0, 22, character.color);
      const label = this.add.text(-42, 30, character.name, {
        fontSize: "14px",
        color: "#ffffff",
      });

      const container = this.add.container(character.x, character.y, [
        body,
        label,
      ]);

      const npcActor = { character, container };
      this.npcActors.push(npcActor);
      this.moveNpc(npcActor, 1);
    }

    this.prompt = this.add.text(0, 0, "", {
      fontSize: "18px",
      color: "#ffe66d",
      backgroundColor: "#000000",
      padding: { x: 8, y: 5 },
    });
    this.prompt.setVisible(false);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.interactKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.E,
    );
    this.escapeKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC,
    );

    window.addEventListener("npc-eliminated", this.onNpcEliminated);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      window.removeEventListener("npc-eliminated", this.onNpcEliminated);
    });
  }

  update(_: number, delta: number) {
    const speed = 0.22 * delta;
    let moveX = 0;
    let moveY = 0;

    if (this.cursors.left.isDown) moveX -= speed;
    if (this.cursors.right.isDown) moveX += speed;
    if (this.cursors.up.isDown) moveY -= speed;
    if (this.cursors.down.isDown) moveY += speed;

    this.player.x = Phaser.Math.Clamp(this.player.x + moveX, 20, 940);
    this.player.y = Phaser.Math.Clamp(this.player.y + moveY, 20, 620);

    this.findNearbyNpc();

    if (this.nearbyNpc && Phaser.Input.Keyboard.JustDown(this.interactKey)) {
      window.dispatchEvent(
        new CustomEvent("npc-chat-open", {
          detail: { name: this.nearbyNpc.character.name },
        }),
      );
    }

    if (Phaser.Input.Keyboard.JustDown(this.escapeKey)) {
      window.dispatchEvent(new CustomEvent("npc-chat-close"));
    }
  }

  private moveNpc(npc: NpcActor, routeIndex: number) {
    if (!npc.container.active || !this.npcActors.includes(npc)) return;

    const destination = npc.character.route[routeIndex];

    this.tweens.add({
      targets: npc.container,
      x: destination.x,
      y: destination.y,
      duration: 5000,
      ease: "Linear",
      hold: 1000,
      onComplete: () => {
        if (!npc.container.active || !this.npcActors.includes(npc)) return;

        const nextIndex = (routeIndex + 1) % npc.character.route.length;
        this.moveNpc(npc, nextIndex);
      },
    });
  }

  private findNearbyNpc() {
    this.nearbyNpc = null;

    for (const npc of this.npcActors) {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        npc.container.x,
        npc.container.y,
      );

      if (distance < 65) {
        this.nearbyNpc = npc;
        this.prompt.setText(`Press E to talk to ${npc.character.name}`);
        this.prompt.setPosition(this.player.x - 85, this.player.y - 55);
        this.prompt.setVisible(true);
        return;
      }
    }

    this.prompt.setVisible(false);
  }

  private drawMap() {
    const rooms = [
      { name: "Asha's Room", x: 150, y: 140 },
      { name: "Kabir's Room", x: 380, y: 140 },
      { name: "Meera's Room", x: 610, y: 140 },
      { name: "Nikhil's Room", x: 840, y: 140 },
      { name: "Common Hall", x: 480, y: 330 },
      { name: "Dining Area", x: 220, y: 510 },
      { name: "Library", x: 700, y: 510 },
      { name: "Courtroom", x: 480, y: 560 },
    ];

    for (const room of rooms) {
      this.add.rectangle(room.x, room.y, 190, 120, 0x24243a)
        .setStrokeStyle(2, 0x7777a5);

      this.add.text(room.x - 55, room.y - 48, room.name, {
        fontSize: "15px",
        color: "#c9c9e8",
      });
    }
  }
}
