import Phaser from "phaser";
import { Rect } from "./rect";
import { rectColors } from "./game";
import { styleDefaultRect } from "./game";

import { PointsField } from "./pointsField";

export class PointsCol {
  scene: Phaser.Scene;
  x: number;
  y: number;
  group: any;
  cols: number;
  elements: Rect[][];
  rectSize: number;
  strokWeigth: number;
  bonusPoints: PointsField | undefined;
  colPoints: PointsField | undefined;
  jokerPoints: PointsField | undefined;
  starPoints: PointsField | undefined;
  totalPoints: PointsField | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number, cols: number) {
    this.scene = scene;
    this.group = this.scene.physics.add.staticGroup();
    this.x = x;
    this.y = y;
    this.cols = cols;
    this.rectSize = 40;
    this.strokWeigth = 2;
    this.elements = new Array(2);
    this.bonusPoints;
    this.colPoints;
    this.jokerPoints;
    this.starPoints;
    this.totalPoints;
    this.init();
  }
  init() {
    for (let i = 0; i < rectColors.length; i++) {
      const color = new Phaser.Display.Color(rectColors[i].r, rectColors[i].g, rectColors[i].b);

      let style = {
        ...styleDefaultRect,
        ...{
          color: color.color,
        },
      };
      let y = i * (this.rectSize + this.strokWeigth) + this.y;
      this.elements[0] = new Array(rectColors.length);
      this.elements[0][i] = new Rect(this.scene, this.x, y, this.rectSize, false, style, String(5));
      this.group.add(this.elements[0][i].gameObject, true);
      let x = this.x + (this.rectSize + this.strokWeigth);
      this.elements[1] = new Array(rectColors.length);
      this.elements[1][i] = new Rect(this.scene, x, y, this.rectSize, false, style, String(3));
      this.group.add(this.elements[1][i].gameObject, true);
    }
    let j = 0;
    this.bonusPoints = new PointsField(
      this.scene,
      this.x - this.rectSize * 0.5,
      this.y +
        rectColors.length * (this.rectSize + this.strokWeigth) +
        j * (this.rectSize + this.strokWeigth),
      "Bonus:",
      this.rectSize
    );
    this.colPoints = new PointsField(
      this.scene,
      this.x - this.rectSize * 0.5,
      this.y +
        rectColors.length * (this.rectSize + this.strokWeigth) +
        ++j * (this.rectSize * 0.5 + this.strokWeigth * 2),
      "Col:",
      this.rectSize
    );
    this.jokerPoints = new PointsField(
      this.scene,
      this.x - this.rectSize * 0.5,
      this.y +
        rectColors.length * (this.rectSize + this.strokWeigth) +
        ++j * (this.rectSize * 0.5 + this.strokWeigth * 2),
      "!:",
      this.rectSize
    );
    this.starPoints = new PointsField(
      this.scene,
      this.x - this.rectSize * 0.5,
      this.y +
        rectColors.length * (this.rectSize + this.strokWeigth) +
        ++j * (this.rectSize * 0.5 + this.strokWeigth * 2),
      "Star:",
      this.rectSize
    );
    this.totalPoints = new PointsField(
      this.scene,
      this.x - this.rectSize * 0.5,
      this.y +
        rectColors.length * (this.rectSize + this.strokWeigth) +
        ++j * (this.rectSize * 0.5 + this.strokWeigth * 2),
      "Total:",
      this.rectSize
    );
  }
}
