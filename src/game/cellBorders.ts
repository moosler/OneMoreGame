import Phaser from "phaser";
import { Cell } from "./cell";

export class CellBorder {
  cell: Cell;
  scene: Phaser.Scene;
  orientation: string;
  strokeWidth: number;
  graphics: Phaser.GameObjects.Graphics;
  constructor(cell: Cell, scene: Phaser.Scene, orientation: string) {
    this.cell = cell;
    this.scene = scene;
    this.orientation = orientation;
    this.strokeWidth = 5;
    this.graphics = this.scene.add.graphics();
    this.init();
  }
  init() {
    this.graphics.fillStyle(0x0000ff, 1);

    let x = this.cell.x - this.cell.rectSize * 0.5 - this.strokeWidth * 0.5;
    let y = this.cell.y - this.cell.rectSize * 0.5 - this.strokeWidth * 0.5;
    let width = this.cell.rectSize + this.strokeWidth;
    let height = this.strokeWidth;
    if (this.orientation === "south")
      y = this.cell.y + this.cell.rectSize * 0.5;

    if (this.orientation === "east") {
      x = this.cell.x + this.cell.rectSize * 0.5 - this.strokeWidth * 0.5;
      width = this.strokeWidth;
      height = this.cell.rectSize + this.strokeWidth;
    }
    if (this.orientation === "west") {
      x = this.cell.x - this.cell.rectSize * 0.5 - this.strokeWidth * 0.5;
      width = this.strokeWidth;
      height = this.cell.rectSize + this.strokeWidth;
    }

    this.graphics.fillRect(x, y, width, height);
    this.graphics.setVisible(false);

    this.graphics.depth = 5;

    /**
     * with Polygon
     */
    // graphics.lineStyle(20, 0x2ecc40); //thickness fill alpha
    // graphics.beginPath();

    // graphics.moveTo(400, 100);
    // graphics.lineTo(200, 278);
    // graphics.lineTo(340, 430);
    // graphics.lineTo(650, 80);

    // graphics.closePath();
    // graphics.strokePath();
  }
  reset() {
    this.graphics.setVisible(false);
  }
  show(neighbors: Cell[]) {
    let pos = { ...this.cell.pos };
    //north
    pos.y = pos.y - 1;
    if (this.orientation === "north" && this.setBorder(pos, neighbors)) {
      this.graphics.setVisible(true);
      return;
    }
    //east
    pos = { ...this.cell.pos };
    pos.x = pos.x + 1;
    if (this.orientation === "east" && this.setBorder(pos, neighbors)) {
      this.graphics.setVisible(true);
      return;
    }
    //south
    pos = { ...this.cell.pos };
    pos.y = pos.y + 1;
    if (this.orientation === "south" && this.setBorder(pos, neighbors)) {
      this.graphics.setVisible(true);
      return;
    }
    //west
    pos = { ...this.cell.pos };
    pos.x = pos.x - 1;
    if (this.orientation === "west" && this.setBorder(pos, neighbors)) {
      this.graphics.setVisible(true);
      return;
    }
  }
  setBorder(pos: { x: any; y: any }, neighbors: Cell[]): boolean {
    let neighbor = this.cellIsInArray(pos, neighbors);
    if (neighbor) {
      if (neighbor.getColor() === this.cell.getColor()) {
        return false;
      }
    }
    return true;
  }
  cellIsInArray(pos: { x: any; y: any }, neighbors: Cell[]) {
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      if (pos.x === neighbor.pos.x && pos.y === neighbor.pos.y) {
        return neighbor;
      }
    }
    return false;
  }
}
