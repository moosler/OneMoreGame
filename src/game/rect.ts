import Phaser from "phaser";
import { styleDefaultRect } from "./game";
/**
 * @todo set Color Style here
 */

let pointOverSytle = {
  strokeColor: 0xefc53f,
  strokWeigth: 4
}

let hightlightStyle = {
  strokeColor: 0xc3c3c3,
  strokWeigth: 4,
};

export class Rect {
  rectSize: number;
  x: number;
  y: number;
  group: any;
  scene: Phaser.Scene;
  style: {
    color: number;
    strokeColor: number;
    strokeColorStart: number;
    strokWeigth: number;
  };
  isMid: boolean;
  gameObject: Phaser.GameObjects.Rectangle;
  text: string;
  isInteractive: boolean;
  textObject: Phaser.GameObjects.Text | undefined;
  pos: { x: number; y: number };
  marked: boolean;
  highlight: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    rectSize: number,
    isMid: boolean,
    style: any,
    text: string = "",
    pos: { x: number; y: number } = { x: 0, y: 0 },
    isInteractive = false
  ) {
    this.x = x;
    this.y = y;
    this.rectSize = rectSize;
    this.text = text;
    this.scene = scene;
    this.isMid = isMid;
    this.style = style;
    this.pos = pos;
    this.isInteractive = isInteractive;
    this.marked = false;
    this.highlight =false;
    if (isMid) {
      this.style.strokeColor = this.style.strokeColorStart;
    }
    this.gameObject = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.x,
      this.y,
      this.rectSize,
      this.rectSize,
      this.style.color
    );
    this.textObject;

    this.init();
  }
  init() {
    this.gameObject.setStrokeStyle(this.style.strokWeigth, this.style.strokeColor);

    if (this.isInteractive) {
      this.gameObject.setInteractive();
      this.gameObject.on("pointerover", () => {
        this.setStroke(pointOverSytle.strokeColor, pointOverSytle.strokWeigth);
      });
      this.gameObject.on("pointerout", () => {
        this.setStroke(this.style.strokeColor, this.style.strokWeigth);
      });
      this.gameObject.on("pointerdown", () => {
        this.text = "X";
        this.showText();
      });
    }
    if (this.text !== "") {
      this.showText();
    }
  }
  showText() {
    let fill = "#879eb4";
    if (this.isMid) {
      fill = "#974c75";
    }
    let textStyle = {
      font: this.rectSize * 0.5 + "px Arial Black",
      fill: fill,
    };
    this.textObject = this.scene.add.text(
      this.x - this.rectSize * 0.5,
      this.y - this.rectSize * 0.5,
      this.text,
      textStyle
    );
    this.textObject.setStroke("#111", 6);
    this.textObject.setShadow(2, 2, "#333333", 2, true, true);
    this.textObject.setDepth(1);

    Phaser.Display.Align.In.Center(this.textObject, this.gameObject);
  }
  setColor(colorObj: number) {
    this.gameObject.fillColor = colorObj;
    this.style.color = colorObj;
  }
  setStroke(color: number, weight: number = 2) {
    this.gameObject.setStrokeStyle(weight, color);
  }
  /**
   * sets Cell as visited
   */
  setMark(marked = true) {
    this.marked = marked;
  }
  hightlightCell(){
    this.highlight = true;
    this.setStroke(hightlightStyle.strokeColor, hightlightStyle.strokWeigth);
    this.style.strokeColor = hightlightStyle.strokeColor;
    this.style.strokWeigth = hightlightStyle.strokWeigth;
  }
}
