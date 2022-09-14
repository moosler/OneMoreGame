import Phaser from "phaser";
import { Rect } from "./rect";
import { rectColors } from "./game";
import { styleDefaultRect } from "./game";

export class Grid {
  group: Phaser.Physics.Arcade.StaticGroup;
  scene: Phaser.Scene;
  cols: number;
  rows: number;
  rectSize: number;
  marginLeft: number;
  marginTop: number;
  strokWeigth: number;
  grid: Rect[][];
  coherentCells: Rect[];
  constructor(scene: Phaser.Scene, mLeft: number, mTop: number) {
    this.scene = scene;
    this.group = this.scene.physics.add.staticGroup();
    this.cols = 15;
    this.rows = 7;
    this.rectSize = 40;
    this.marginLeft = mLeft;
    this.marginTop = mTop;
    this.strokWeigth = 2;
    this.grid = new Array(this.cols);
    this.coherentCells = [];
    this.init();
  }
  init() {
    for (let i = 0; i < this.cols; i++) {
      let isMid = Math.floor(this.cols / 2) == i;
      this.grid[i] = new Array(this.rows);
      let x = i * (this.rectSize + this.strokWeigth) + this.marginLeft + this.rectSize / 2;
      for (let j = 0; j < this.rows; j++) {
        let randColor = rectColors[Math.floor(Math.random() * rectColors.length)];
        const color = new Phaser.Display.Color(randColor.r, randColor.g, randColor.b);
        let y = j * (this.rectSize + this.strokWeigth) + this.marginTop + this.rectSize / 2;
        let style = {
          ...styleDefaultRect,
          ...{
            color: color.color,
          },
        };
        this.grid[i][j] = new Rect(
          this.scene,
          x,
          y,
          this.rectSize,
          isMid,
          style,
          "",
          { x: i, y: j },
          true
        );
        this.group.add(this.grid[i][j].gameObject, true);
      }
    }
  }
  /**
   * makes sure that all colors appear at least once in the middle column
   */
  setStartCol() {
    let dif = this.rows - rectColors.length;

    let rowArr: number[] = [];
    for (let i = 0; i < rectColors.length; i++) {
      const element = rectColors[i];
      const color = new Phaser.Display.Color(element.r, element.g, element.b);
      rowArr.push(color.color);
    }

    for (let i = 0; i < dif; i++) {
      let color = rowArr[Math.floor(Math.random() * rowArr.length)];
      rowArr.push(color);
    }
    rowArr.sort();
    let mid = Math.floor(this.cols / 2);
    for (let j = 0; j < this.grid[0].length; j++) {
      this.grid[mid][j].setColor(rowArr[j]);
    }
  }

  /**
   * returns all contiguous cells of one color
   * @param cell
   * @returns array of all contiguous cells
   */
  setContiguousCell(cell: Rect) {
    this.markCells(this.coherentCells, false); //reset current marking
    this.coherentCells = [];
    this.visit(cell);
  }

  /**
   * determine contiguous colored regions in a grid?
   * depth first search
   * @param cell
   * @returns
   */
  visit(cell: Rect) {
    if (cell.marked) return;
    cell.setMark(true);
    this.coherentCells.push(cell);
    let cells = this.getNeighbors(cell, false);
    for (let i = 0; i < cells.length; i++) {
      const element = cells[i];
      if (this.isSameColor(cell, element)) {
        this.visit(element);
      }
    }
  }

  markCells(cells: Rect[], mark: boolean = true) {
    for (let i = 0; i < cells.length; i++) {
      const element = cells[i];
      element.setMark(mark);
    }
  }
  /**
   *
   * @param cell Cell from Grid
   * @param selfInclude if true include self cell in array
   * @param onlySameColor get only Cells of same Color
   * @returns array with alle neighbors
   */
  getNeighbors(cell: Rect, selfInclude: boolean = true, onlySameColor = true): Rect[] {
    let neighbors = [];
    if (selfInclude) neighbors.push(cell);

    let cellRight = this.grid[cell.pos.x + 1][cell.pos.y];
    if (this.checkCell(cell, cellRight, onlySameColor)) {
      neighbors.push(cellRight);
    }
    let cellLeft = this.grid[cell.pos.x - 1][cell.pos.y];
    if (this.checkCell(cell, cellLeft, onlySameColor)) {
      neighbors.push(cellLeft);
    }
    let cellBottom = this.grid[cell.pos.x][cell.pos.y - 1];
    if (this.checkCell(cell, cellBottom, onlySameColor)) {
      neighbors.push(cellBottom);
    }
    let cellTop = this.grid[cell.pos.x][cell.pos.y + 1];
    if (this.checkCell(cell, cellTop, onlySameColor)) {
      neighbors.push(cellTop);
    }
    return neighbors;
  }

  checkCell(cell: Rect, cellB: Rect, onlySameColor: boolean) {
    if (this.isCellinGrid(cell)) {
      if (onlySameColor && !this.isSameColor(cell, cellB)) return false;
      return true;
    }
  }

  isSameColor(cellA: Rect, cellB: Rect) {
    return cellA.style.color === cellB.style.color;
  }
  /**
   *
   * @param cell
   * @returns true or false
   */
  isCellinGrid(cell: Rect): boolean {
    if (cell.pos.x < 0 || cell.pos.y < 0) return false;
    if (cell.pos.x > this.rows || cell.pos.y > this.cols) return false;
    return true;
  }
}
