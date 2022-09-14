import Phaser from "phaser";

let style = {
  color: 0x333333,
  strokeColor: 0xbbbbbb,
  strokWeigth: 2,
};
let textStyle = {
  fill: "#eee",
  stroke: "#444",
  strokeWeight: 6,
  shadow: "#333333",
};

let diceValues = [1, 2, 3, 4, 5, "?"];
export const diceColors = ["#62b1db", "#c66a8d", "#ae7749", "#c8b47f", "#58853e", "#111111"];

export class Dice {
  rectSize: number;
  x: number;
  y: number;
  group: any;
  scene: Phaser.Scene;
  gameObject: Phaser.GameObjects.Rectangle;
  text: string;
  type: string;
  color: string | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number, rectSize: number, type: string = "val") {
    this.x = x;
    this.y = y;
    this.rectSize = rectSize;
    this.type = type;
    this.text = String(diceValues[Math.floor(Math.random() * diceValues.length)]);
    if (this.type !== "val") {
      this.text = String(diceColors[Math.floor(Math.random() * diceColors.length)]);
    }
    this.color;
    this.scene = scene;
    this.gameObject = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.x,
      this.y,
      this.rectSize,
      this.rectSize,
      style.color
    );
    this.init();
  }
  init() {
    this.gameObject.setStrokeStyle(style.strokWeigth, style.strokeColor);
    this.gameObject.setDepth(1);

    if (this.text !== "") {
      let fill = textStyle.fill;
      if (this.type !== "val") {
        fill = this.text;
        this.text = "+";
      }
      this.color = fill;
      let textSty = {
        font: this.rectSize * 0.5 + "px Arial Black",
        fill: fill,
      };

      const text = this.scene.add.text(
        this.x - this.rectSize * 0.5,
        this.y - this.rectSize * 0.5,
        this.text,
        textSty
      );

      text.setStroke(textStyle.stroke, textStyle.strokeWeight);
      text.setShadow(2, 2, textStyle.shadow, 2, true, true);
      text.setDepth(2);

      Phaser.Display.Align.In.Center(text, this.gameObject);
    }
  }
  getColor() {
    return this.color;
  }
}
