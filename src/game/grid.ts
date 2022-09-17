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
  regions: Rect[][];
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
    this.regions = [];
    this.coherentCells = []; //???
    this.init();
  }
  init() {
    for (let i = 0; i < this.cols; i++) {
      let isMid = Math.floor(this.cols / 2) == i;
      this.grid[i] = new Array(this.rows);
      let x =
        i * (this.rectSize + this.strokWeigth) +
        this.marginLeft +
        this.rectSize / 2;
      for (let j = 0; j < this.rows; j++) {
        let randColor =
          rectColors[Math.floor(Math.random() * rectColors.length)];
        const color = new Phaser.Display.Color(
          randColor.r,
          randColor.g,
          randColor.b
        );
        let y =
          j * (this.rectSize + this.strokWeigth) +
          this.marginTop +
          this.rectSize / 2;
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
    if (cells.length < 1) return;
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
  getNeighbors(
    cell: Rect,
    selfInclude: boolean = true,
    onlySameColor = true
  ): Rect[] {
    let neighbors = [];
    if (selfInclude) neighbors.push(cell);
    if (this.isCellinGrid(cell.pos.x + 1, cell.pos.y)) {
      let cellRight = this.grid[cell.pos.x + 1][cell.pos.y];
      if (this.checkCell(cell, cellRight, onlySameColor)) {
        neighbors.push(cellRight);
      }
    }
    if (this.isCellinGrid(cell.pos.x - 1, cell.pos.y)) {
      let cellLeft = this.grid[cell.pos.x - 1][cell.pos.y];
      if (this.checkCell(cell, cellLeft, onlySameColor)) {
        neighbors.push(cellLeft);
      }
    }
    if (this.isCellinGrid(cell.pos.x, cell.pos.y - 1)) {
      let cellBottom = this.grid[cell.pos.x][cell.pos.y - 1];
      if (this.checkCell(cell, cellBottom, onlySameColor)) {
        neighbors.push(cellBottom);
      }
    }
    if (this.isCellinGrid(cell.pos.x, cell.pos.y + 1)) {
      let cellTop = this.grid[cell.pos.x][cell.pos.y + 1];
      if (this.checkCell(cell, cellTop, onlySameColor)) {
        neighbors.push(cellTop);
      }
    }
    return neighbors;
  }

  checkCell(cell: Rect, cellB: Rect, onlySameColor: boolean) {
    if (onlySameColor && !this.isSameColor(cell, cellB)) return false;
    return true;
  }

  isSameColor(cellA: Rect, cellB: Rect) {
    return cellA.style.color === cellB.style.color;
  }
  /**
   *
   * @param cell
   * @returns true or false
   */
  isCellinGrid(x: Number, y: Number): boolean {
    if (x < 0 || y < 0) return false;
    if (x > this.cols - 1 || y > this.rows - 1) return false;
    return true;
  }
  highlightCells(cells: any[]) {
    for (let i = 0; i < cells.length; i++) {
      const element = cells[i];
      element.hightlightCell();
    }
  }

  /**
   * calcs all contiguous Regions of a Color and stores it in the regions array
   * in eacht cell the reference to the region is set
   */
  calcContiguousRegions(startCell: Rect) {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let cell = this.grid[i][j];
        this.visit(cell);
        if (this.coherentCells.length >= 1) {
          this.regions.push([...this.coherentCells]);
          this.coherentCells = [];
        }
      }
    }
    console.log(this.regions);
  }
}
