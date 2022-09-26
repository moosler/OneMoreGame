export class Button {
  label: string | undefined;
  obj: Phaser.GameObjects.Text;
  constructor(
    x: number,
    y: number,
    label: string,
    scene: Phaser.Scene,
    callback: { (): void; (): any }
  ) {
    this.obj = scene.add
      .text(x, y, label)
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({ backgroundColor: "#111" })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => callback())
      .on("pointerover", () => this.obj.setStyle({ fill: "#f39c12" }))
      .on("pointerout", () => this.obj.setStyle({ fill: "#FFF" }));
  }
  setText(text: string) {
    this.obj.text = text;
  }
}
