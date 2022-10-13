import Phaser from "phaser";

export class PointsField {
  scene: Phaser.Scene;
  x: number;
  y: number;
  text: string;
  rectSize: number;
  textElement: Phaser.GameObjects.Text;
  textElementPoint: Phaser.GameObjects.Text;
  style: { font: string; fill: string };
  initPointVal: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    text: string,
    rectSize: number,
    startpoint: number = 0
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.text = text;
    this.rectSize = rectSize;
    this.initPointVal = startpoint;
    this.style = {
      font: this.rectSize * 0.5 + "px Arial Black",
      fill: "#f8f3ff",
    };
    this.textElement = this.scene.add.text(
      this.x,
      this.y,
      this.text,
      this.style
    );
    this.textElementPoint = this.scene.add.text(
      this.x + this.textElement.width,
      this.y,
      String(this.initPointVal),
      this.style
    );
    this.init();
  }
  init() {
    this.textElement.setStroke("#111", 6);
    this.textElement.setShadow(2, 2, "#333333", 2, true, true);
    this.textElement.setDepth(1);

    this.textElementPoint.setStroke("#111", 6);
    this.textElementPoint.setShadow(2, 2, "#333333", 2, true, true);
    this.textElementPoint.setDepth(1);
  }
  setText(text: number) {
    this.textElementPoint.text = String(text);
  }
}
