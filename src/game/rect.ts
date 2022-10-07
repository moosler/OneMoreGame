import Phaser from "phaser";
import { gameInstance } from "../scenes/Game";
import { styleDefaultRect } from "./game";
/**
 * @todo set Color Style here
 */

let pointOverSytle = {
  strokeColor: 0xefc53f,
  strokWeigth: 4,
};

let hightlightStyle = {
  strokeColor: 0xc3c3c3,
  strokWeigth: 4,
};
let hightlightRegionStyle = {
  strokeColor: 0x38c885,
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
  textObject: Phaser.GameObjects.Text;
  pos: { x: number; y: number };
  marked: boolean;
  highlight: boolean;
  regionIndex: number;
  isStar: undefined | boolean;
  starObject: Phaser.GameObjects.Text | undefined;

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
    this.highlight = false;
    this.regionIndex = -1;
    this.isStar = undefined;
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
    this.textObject = this.scene.add.text(
      this.x - this.rectSize * 0.5,
      this.y - this.rectSize * 0.5,
      this.text,
      this.getStyle()
    );
    this.starObject = undefined;

    this.init();
  }
  init() {
    this.gameObject.setStrokeStyle(
      this.style.strokWeigth,
      this.style.strokeColor
    );
    if (this.isInteractive) {
      this.gameObject.setInteractive();
      this.gameObject.on("pointerover", () => {
        this.setStroke(pointOverSytle.strokeColor, pointOverSytle.strokWeigth);
      });
      this.gameObject.on("pointerout", () => {
        this.setStroke(this.style.strokeColor, this.style.strokWeigth);
      });
      this.gameObject.on("pointerdown", () => {
        gameInstance.currentPlayer.setMark(
          this,
          gameInstance.grid.getNeighbors(this, false, false)
        );
        this.setText("X");
        this.setMark();
      });
    }
    if (this.text !== "") {
      this.setText(this.text);
    }
  }
  setText(text: string) {
    this.textObject.text = text;
    this.text = text;
    this.setStyle(this.textObject);
    Phaser.Display.Align.In.Center(this.textObject, this.gameObject);
  }
  getText() {
    return this.text;
  }
  styleCell() {
    this.setStroke(this.style.strokeColor, this.style.strokWeigth);
  }
  setStyle(obj: Phaser.GameObjects.Text, depth = 1) {
    obj.setStroke("#111", 6);
    obj.setShadow(2, 2, "#333333", 2, true, true);
    obj.setDepth(depth);
  }
  getStyle(fontMultiplier = 1) {
    let fill = "#879eb4";
    if (this.isMid) {
      fill = "#974c75";
    }
    return {
      font: this.rectSize * 0.5 * fontMultiplier + "px Arial Black",
      fill: fill,
    };
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
  highlightCell() {
    this.highlight = true;
    this.setStroke(
      hightlightRegionStyle.strokeColor,
      hightlightRegionStyle.strokWeigth
    );
    this.style.strokeColor = hightlightRegionStyle.strokeColor;
    this.style.strokWeigth = hightlightRegionStyle.strokWeigth;
  }
  resetHighlight() {
    if (this.highlight === true) {
      this.setStroke(
        styleDefaultRect.strokeColor,
        styleDefaultRect.strokWeigth
      );
    }
  }
  setStar() {
    this.isStar = true;
    this.starObject = this.scene.add.text(
      this.x - this.rectSize * 0.5,
      this.y - this.rectSize * 0.5,
      "★",
      this.getStyle(1.75)
    );
    this.setStyle(this.starObject, 0);
    Phaser.Display.Align.In.Center(this.starObject, this.gameObject);
  }
  getRegionIndex(): number {
    return this.regionIndex;
  }
  getColor() {
    return this.style.color;
  }
}
