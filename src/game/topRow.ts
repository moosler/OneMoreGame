import Phaser from "phaser";
import { Rect } from "./rect";

export class TopRow {
  scene: Phaser.Scene;
  x: number;
  y: number;
  group: any;
  cols: number;
  elements: Rect[];
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
    this.elements = new Array(this.cols);
    this.init();
  }
  init() {
    for (let i = 0; i < this.cols; i++) {
      let style = {
        fill: 0xffffff,
      };
      let isMid = Math.floor(this.cols / 2) == i;
      let x =
        i * (this.rectSize + this.strokWeigth) + this.x + this.rectSize / 2;
      this.elements[i] = new Rect(
        this.scene,
        x,
        this.y,
        this.rectSize,
        isMid,
        style,
        String.fromCharCode(65 + i)
      );
      this.group.add(this.elements[i].gameObject, true);
    }
  }
}
