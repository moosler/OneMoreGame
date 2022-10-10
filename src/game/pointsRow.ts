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
    this.elements = new Array(2);
    this.init();
  }
  init() {
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
      this.elements[0] = new Array(this.cols);
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
      this.elements[1] = new Array(this.cols);
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
}
