import Phaser from "phaser";
import { Rect } from "./rect";
import { rectColors } from "./game";

import { PointsField } from "./pointsField";

export class PointsColor {
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
    this.elements[0] = new Array(rectColors.length);
    this.elements[1] = new Array(rectColors.length);

    for (let i = 0; i < rectColors.length; i++) {
      let color = Phaser.Display.Color.HexStringToColor(rectColors[i]).color;

      // const color = new Phaser.Display.Color(
      //   rectColors[i].r,
      //   rectColors[i].g,
      //   rectColors[i].b
      // );

      let style = {
        fill: color,
      };
      let y = i * (this.rectSize + this.strokWeigth) + this.y;
      this.elements[0][i] = new Rect(
        this.scene,
        this.x,
        y,
        this.rectSize,
        false,
        style,
        String(5)
      );
      this.group.add(this.elements[0][i].gameObject, true);
      let x = this.x + (this.rectSize + this.strokWeigth);
      this.elements[1][i] = new Rect(
        this.scene,
        x,
        y,
        this.rectSize,
        false,
        style,
        String(3)
      );
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
      this.rectSize,
      -4
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
  getPointForColor(column: number) {
    let leftElement = this.elements[0][column];
    let rightElement = this.elements[1][column];
    let point = parseInt(leftElement.getText());
    if (!leftElement.getHightlight()) {
      point = parseInt(rightElement.getText());
    }
    return point;
  }
  highlight(colArray: any[]) {
    for (let i = 0; i < colArray.length; i++) {
      const left_right = colArray[i];
      for (let j = 0; j < left_right.length; j++) {
        const element = left_right[j];
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
