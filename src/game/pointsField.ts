import Phaser from "phaser";

export class PointsField {
  scene: Phaser.Scene;
  x: number;
  y: number;
  text: string;
  rectSize: number;
  textElement: Phaser.GameObjects.Text | undefined;
  textElementPoint: Phaser.GameObjects.Text | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number, text: string, rectSize: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.text = text;
    this.rectSize = rectSize;
    this.textElement;
    this.textElementPoint;
    this.init();
  }
  init() {
    let textStyle = {
      font: this.rectSize * 0.5 + "px Arial Black",
      fill: "#f8f3ff",
    };
    this.textElement = this.scene.add.text(this.x, this.y, this.text, textStyle);
    this.textElement.setStroke("#111", 6);
    this.textElement.setShadow(2, 2, "#333333", 2, true, true);
    this.textElement.setDepth(1);

    this.textElementPoint = this.scene.add.text(
      this.x + this.textElement.width,
      this.y,
      String(0),
      textStyle
    );
    this.textElementPoint.setStroke("#111", 6);
    this.textElementPoint.setShadow(2, 2, "#333333", 2, true, true);
    this.textElementPoint.setDepth(1);
  }
}
