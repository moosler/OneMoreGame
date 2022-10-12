import Phaser from "phaser";
import { Rect } from "./rect";
import { Cell } from "./cell";
import { rectColors, Rand } from "./game";
// import { styleDefaultRect } from "./game";

export class Grid {
  group: Phaser.Physics.Arcade.StaticGroup;
  scene: Phaser.Scene;
  cols: number;
  rows: number;
  rectSize: number;
  marginLeft: number;
  marginTop: number;
  strokWeigth: number;
  // grid: Rect[][];
  grid: Cell[][];
  coherentCells: Cell[];
  regions: Cell[][];
  constructor(
    scene: Phaser.Scene,
    mLeft: number,
    mTop: number,
    cols: number = 15,
    rows: number = 7
  ) {
    this.scene = scene;
    this.group = this.scene.physics.add.staticGroup();
    this.cols = cols;
    this.rows = rows;
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
        //Math.random();
        let randColor =
          rectColors[Math.floor(Rand.random() * rectColors.length)];
        let color = Phaser.Display.Color.HexStringToColor(randColor).color;
        // const color = new Phaser.Display.Color(
        //   randColor.r,
        //   randColor.g,
        //   randColor.b
        // );
        let y =
          j * (this.rectSize + this.strokWeigth) +
          this.marginTop +
          this.rectSize / 2;
        let style = {
          fill: color,
        };
        // console.log(style);

        this.grid[i][j] = new Cell(
          this.scene,
          x,
          y,
          this.rectSize,
          { x: i, y: j },
          "",
          true,
          isMid,
          style
        );
        this.group.add(this.grid[i][j].gameObject, true);
      }
    }
    this.setStartCol();
    this.setStars();
    this.calcContiguousRegions();
    // console.log(this.regions);
  }

  /**
   * makes sure that all colors appear at least once in the middle column
   */
  setStartCol() {
    let dif = this.rows - rectColors.length;

    let rowArr: number[] = [];
    for (let i = 0; i < rectColors.length; i++) {
      const element = rectColors[i];
      // const color = new Phaser.Display.Color(element.r, element.g, element.b);
      const color = Phaser.Display.Color.HexStringToColor(element).color;

      // rowArr.push(color.color);
      rowArr.push(color);
    }

    for (let i = 0; i < dif; i++) {
      let color = rowArr[Math.floor(Rand.random() * rowArr.length)];
      rowArr.push(color);
    }
    rowArr.sort();
    let mid = Math.floor(this.cols / 2);
    for (let j = 0; j < this.grid[0].length; j++) {
      // this.grid[mid][j].setColor(rowArr[j]);
      this.grid[mid][j].setFill(rowArr[j]);
    }
  }
  setStars() {
    for (const key in rectColors) {
      if (Object.prototype.hasOwnProperty.call(rectColors, key)) {
        const element = rectColors[key];
        // const color = new Phaser.Display.Color(element.r, element.g, element.b);
        const color = Phaser.Display.Color.HexStringToColor(element).color;
        this.setStar(color);
      }
    }
  }
  setStar(color: number) {
    let cell =
      this.grid[Math.floor(Rand.random() * this.cols)][
        Math.floor(Rand.random() * this.rows)
      ];
    while (cell.style.fill !== color) {
      let randX = Math.floor(Rand.random() * this.cols);
      let randY = Math.floor(Rand.random() * this.rows);
      cell = this.grid[randX][randY];
    }
    cell.setStar();
  }

  calcReachableRegion() {
    let regions = [];
    let mid = Math.floor(this.cols / 2);

    for (let i = 0; i < this.rows; i++) {
      regions.push({ x: mid, y: i });
    }
    return regions;
  }

  drawCells(region: { x: number; y: number }[]) {
    this.redrawRegion(region);
  }
  /**
   * draws all X for the players marked region
   * @param region
   */
  redrawRegion(region: { x: number; y: number }[]) {
    for (let i = 0; i < region.length; i++) {
      const element = region[i];
      const cell = this.grid[element.x][element.y];
      cell.setX();
    }
  }
  resetCells(text: boolean = true) {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        let cell = this.grid[i][j];
        cell.resetCell();
      }
    }
  }

  /**
   * returns all contiguous cells of one color
   * @param cell
   */
  setContiguousCell(cell: Cell) {
    this.markCells(this.coherentCells, false); //reset current marking
    this.coherentCells = [];
    this.visit(cell);
  }

  /**
   * determine contiguous colored regions in a grid?
   * depth first search
   * @param cell
   */
  visit(cell: Cell) {
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

  markCells(cells: Cell[], mark: boolean = true) {
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      cell.setMark(mark);
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
    cell: Cell,
    selfInclude: boolean = true,
    onlySameColor = true
  ): Cell[] {
    // console.log(cell);

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

  checkCell(cell: Cell, cellB: Cell, onlySameColor: boolean) {
    if (onlySameColor && !this.isSameColor(cell, cellB)) return false;
    return true;
  }

  isSameColor(cellA: Cell, cellB: Cell) {
    return cellA.style.fill === cellB.style.fill;
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
  highlightCells(cells: Cell[]) {
    for (let i = 0; i < cells.length; i++) {
      const element = cells[i];
      // element.hightlightCell();
      element.draw();
    }
  }

  /**
   * calcs all contiguous Regions of a Color and stores it in the regions array
   * in eacht cell the reference to the region is set
   */
  calcContiguousRegions() {
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
    this.setRegionIndex();
  }
  /**
   * sets the region Index for each Cell
   */
  setRegionIndex() {
    for (let i = 0; i < this.regions.length; i++) {
      const regions = this.regions[i];
      for (let j = 0; j < regions.length; j++) {
        const cell = regions[j];
        cell.regionIndex = i;
      }
    }
  }
  getRegion(index: number) {
    return this.regions[index];
  }
  highlightRegion(regions: any[]) {
    for (let i = 0; i < regions.length; i++) {
      const regionIndex = regions[i];
      const region = this.regions[regionIndex];
      for (let i = 0; i < region.length; i++) {
        const cell = region[i];
        // if (!cell.isX) {
        let neighbors = this.getNeighbors(cell, true, false);
        cell.setHighlight(neighbors);
        cell.draw();
        // }
      }
    }
  }
}
