import Phaser from "phaser";
import { Rect } from "./rect";
import { styleDefaultRect } from "./game";

export class JokerRow {
  scene: Phaser.Scene;
  x: number;
  y: number;
  group: any;
  cols: number;
  elements: Rect[];
  rectSize: number;
  strokWeigth: number;

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
    for (let i = 0; i < this.cols / 2; i++) {
      let style = {
        ...styleDefaultRect,
        ...{
          color: 0xffffff,
        },
      };
      let x = i * (this.rectSize + this.strokWeigth) + this.x + this.rectSize / 2;
      this.elements[i] = new Rect(this.scene, x, this.y, this.rectSize, false, style, "!");
      this.group.add(this.elements[i].gameObject, true);
    }
  }
}
