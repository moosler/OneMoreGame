import Phaser from "phaser";
import { Rect } from "./rect";

export class PointsRow {
  scene: Phaser.Scene;
  x: number;
  y: number;
  group: any;
  cols: number;
  elements: Rect[][];
  rectSize: number;
  strokWeigth: number;
  // gameObject: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, cols: number) {
    this.scene = scene;
    this.group = this.scene.physics.add.staticGroup();
    this.x = x;
    this.y = y;
    this.cols = cols;
    this.rectSize = 40;
    this.strokWeigth = 2;
    this.elements = [...Array(2)].map((_) => Array(this.cols).fill({}));
    this.init();
  }
  init() {
    this.elements[0] = new Array(this.cols);
    this.elements[1] = new Array(this.cols);

    for (let i = 0; i < this.cols; i++) {
      let style = {
        fill: 0xffffff,
      };
      let mid = Math.floor(this.cols / 2);
      let isMid = mid == i;

      /**TextCalculation */
      let textTop = 1;
      let textBot = 0;
      if (!isMid) {
        textTop = Math.ceil(Math.abs(i - mid) * 0.33 + 1);
        textBot = textTop - 1;
      }
      if (i == 0 || i == this.cols - 1) {
        textTop++;
        textBot = textTop - 2;
      }

      //Top
      let x =
        i * (this.rectSize + this.strokWeigth) + this.x + this.rectSize / 2;

      this.elements[0][i] = new Rect(
        this.scene,
        x,
        this.y,
        this.rectSize,
        isMid,
        style,
        String(textTop)
      );
      this.group.add(this.elements[0][i].gameObject, true);
      //Bottom
      this.elements[1][i] = new Rect(
        this.scene,
        x,
        this.y + this.rectSize,
        this.rectSize,
        isMid,
        style,
        String(textBot)
      );
      this.group.add(this.elements[1][i].gameObject, true);
    }
  }
  getPointForColumn(column: number) {
    let topElement = this.elements[0][column];
    let bottomElement = this.elements[1][column];
    let point = parseInt(topElement.getText());
    if (topElement.getHightlight() === false) {
      point = parseInt(bottomElement.getText());
    }
    console.log(point);

    return point;
  }
  highlight(colArray: any[]) {
    for (let i = 0; i < colArray.length; i++) {
      const top_bottom = colArray[i];
      for (let j = 0; j < top_bottom.length; j++) {
        const element = top_bottom[j];
        if (element) {
          this.elements[i][j].setHighlight();
        }
        if (element === false) {
          this.elements[i][j].setNotAvailable();
        }
      }
    }
  }
}
