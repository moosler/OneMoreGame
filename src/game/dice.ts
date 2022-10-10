import Phaser from "phaser";

let style = {
  fill: 0x333333,
  strokeColor: 0xbbbbbb,
  strokWeigth: 2,
};
let textStyle = {
  fill: "#eee",
  stroke: "#444",
  strokeWeight: 6,
  shadow: "#333333",
};

export const diceValues = [1, 2, 3, 4, 5, "?"];
export const diceColors = [
  "#62b1db", //blue
  "#c66a8d", //red
  "#ae7749", //orange
  "#c8b47f", //yellow
  "#58853e", //green
  "#111111",
];

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
  textObject: any;
  isUsed: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    rectSize: number,
    type: string = "val"
  ) {
    this.x = x;
    this.y = y;
    this.rectSize = rectSize;
    this.type = type;
    this.text = this.getNewDiceValue();
    this.color;
    this.scene = scene;
    this.isUsed = false; //marks if a player has selected this dice
    this.textObject = this.scene.add.text(
      this.x - this.rectSize * 0.5,
      this.y - this.rectSize * 0.5,
      this.text,
      this.getStyle()
    );
    this.gameObject = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.x,
      this.y,
      this.rectSize,
      this.rectSize,
      style.fill
    );
    this.init();
  }
  init() {
    this.gameObject.setStrokeStyle(style.strokWeigth, style.strokeColor);
    this.gameObject.setDepth(1);
    this.drawDice();
    Phaser.Display.Align.In.Center(this.textObject, this.gameObject);
  }
  drawDice() {
    let fill = textStyle.fill;
    this.textObject.text = this.text;
    this.color = fill;
    if (this.type !== "val") {
      this.color = this.text;
      this.text = "+";
      this.textObject.text = "+";
      this.textObject.setColor(this.color);
      this.textObject.setFontStyle(this.rectSize * 0.75 + "px");
    }
    this.textObject.setStroke(textStyle.stroke, textStyle.strokeWeight);
    this.textObject.setShadow(2, 2, textStyle.shadow, 2, true, true);
    this.textObject.setDepth(2);
  }
  getStyle() {
    let fill = textStyle.fill;
    if (this.type !== "val") {
      fill = this.text;
    }
    let textSty = {
      font: this.rectSize * 0.5 + "px Arial Black",
      fill: fill,
    };
    return textSty;
  }
  getColor() {
    return this.color;
  }
  getValue() {
    return this.text;
  }
  getNewDiceValue() {
    let dice = String(
      diceValues[Math.floor(Math.random() * diceValues.length)]
    );
    if (this.type !== "val") {
      dice = String(diceColors[Math.floor(Math.random() * diceColors.length)]);
    }
    return dice;
  }
  setNewDiceValue(value = null) {
    let val = this.getNewDiceValue();
    if (value !== null) {
      val = value;
    }
    this.text = val;
    this.drawDice();
  }
}
