// import { Rect } from "./rect";
import { Cell } from "./cell";
import { rectColors } from "./game";

export class Player {
  name: String;
  reachableRegion: { x: number; y: number }[];
  markedRegion: { x: number; y: number }[];
  index: number;
  bonusPoints: number;
  colPoints: number;
  starPoints: number;
  jokerPoints: number;
  totalPoints: number;
  moves: { 0: { x: number; y: number }[] } | any;
  colorsCount: { [k: string]: any };
  columnPointsArray: any;
  colorPointsArray: any[];
  cols: number;
  jokerPointsArray: any[];
  constructor(
    name: String,
    index: number,
    reachableRegion: { x: number; y: number }[],
    cols: number,
    initPoints: { star: number; joker: number }
  ) {
    this.name = name;
    this.index = index;
    this.reachableRegion = reachableRegion;
    this.cols = cols;
    this.markedRegion = [];
    this.moves = {};
    this.bonusPoints = 0;
    this.colPoints = 0;
    this.starPoints = initPoints.star;
    this.jokerPoints = initPoints.joker;
    this.totalPoints = 0;
    this.colorsCount = {};
    this.columnPointsArray = new Array(2);
    this.columnPointsArray[0] = new Array(this.cols).fill(null);
    this.columnPointsArray[1] = new Array(this.cols).fill(null);
    this.colorPointsArray = new Array(2);
    this.colorPointsArray[0] = new Array(rectColors.length).fill(null);
    this.colorPointsArray[1] = new Array(rectColors.length).fill(null);
    this.jokerPointsArray = new Array(initPoints.joker).fill(true);
    this.init();
  }
  init() {
    this.initColorsCount();
  }
  initColorsCount() {
    for (let i = 0; i < rectColors.length; i++) {
      const color = rectColors[i];
      this.colorsCount[color] = 0;
    }
  }
  setMark(cell: Cell, neighbors: Cell[], turn: number) {
    let obj = { x: cell.pos.x, y: cell.pos.y };
    //add cell to markedRegion
    this.addToArrayIfNotExist(obj, this.markedRegion);

    //add cell to reachableRegion
    this.addToArrayIfNotExist(obj, this.reachableRegion);
    //add all Neighbors to reachableRegion
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];
      const obj = { x: neighbor.pos.x, y: neighbor.pos.y };
      this.addToArrayIfNotExist(obj, this.reachableRegion);
    }

    //add ColorsCount
    const color = "#" + cell.style.fill.toString(16);
    this.colorsCount[color]++;

    this.addMovment(cell, turn);
  }
  addMovment(cell: Cell, turn: number) {
    //add every movement to the object moves
    if (!(turn in this.moves)) {
      this.moves[turn] = new Array();
    }
    this.moves[turn].push(cell);
  }
  addToArrayIfNotExist(obj: { x: any; y: any }, arr: any[]) {
    const index = arr.findIndex(
      (object: { x: any; y: any }) => object.x === obj.x && object.y === obj.y
    );
    if (index === -1) {
      arr.push(obj);
    }
  }
  incrementStarPoints(val: number = 1) {
    this.starPoints = this.starPoints + val;
  }
  // decrementJokerPoints(val: number = 1) {
  //   this.jokerPoints = this.jokerPoints - val;
  // }
  setCol(val: number) {
    this.colPoints = val;
  }
  setColor(val: number) {
    this.bonusPoints = val;
  }

  setJokerPoints() {
    const count = this.jokerPointsArray.filter(Boolean).length;
    this.jokerPoints = count;
  }
  setStarPoints(turn: number) {
    let starPoints = 0;
    for (let i = 0; i < this.moves[turn].length; i++) {
      const cell = this.moves[turn][i];
      if (cell.isStar) {
        starPoints++;
      }
    }
    this.incrementStarPoints(starPoints);
  }

  setColArrayPoint(index: number) {
    /**@todo ??? */
    if (this.columnPointsArray[0][index] === null) {
      this.columnPointsArray[0][index] = true;
      this.columnPointsArray[1][index] = false;
    }
    if (this.columnPointsArray[0][index] === false) {
      this.columnPointsArray[1][index] = true;
    }
    console.log(this.columnPointsArray);
  }

  setColorArrayPoint(index: number) {
    /**@todo ??? */
    if (this.colorPointsArray[0][index] === null) {
      this.colorPointsArray[0][index] = true;
      this.colorPointsArray[1][index] = false;
    }
    if (this.colorPointsArray[0][index] === false) {
      this.colorPointsArray[1][index] = true;
    }
  }
  disableColumPoints(index: number) {
    if (this.columnPointsArray[0][index] !== true) {
      this.columnPointsArray[0][index] = false;
    }
  }
  disableColorPoints(index: number) {
    if (this.colorPointsArray[0][index] !== true) {
      this.colorPointsArray[0][index] = false;
    }
  }

  getBonusPoints(): number {
    return this.bonusPoints;
  }
  getColPoints(): number {
    return this.colPoints;
  }
  getStarPoints(): number {
    return this.starPoints;
  }
  getJokerPoints(): number {
    return this.jokerPoints;
  }
  getTotalPoints(): number {
    return (
      this.getBonusPoints() +
      this.getColPoints() +
      this.getStarPoints() +
      this.getJokerPoints()
    );
  }
  getAllPoints() {
    return {
      bonus: this.getBonusPoints(),
      col: this.getColPoints(),
      star: this.getStarPoints(),
      joker: this.getJokerPoints(),
      total: this.getTotalPoints(),
    };
  }
  isInReachableRegion(cell: Cell) {
    for (let i = 0; i < this.reachableRegion.length; i++) {
      const region = this.reachableRegion[i];
      if (region.x === cell.pos.x && region.y === cell.pos.y) {
        return true;
      }
    }
    return false;
  }
  isInSameRegion(cell: Cell, turn: number): boolean {
    if (!(turn in this.moves)) return true;
    let eCell = this.moves[turn][0];
    console.log(eCell);
    console.log(cell.getColor());
    if (eCell.getColor() !== cell.getColor()) return false;
    return true;
  }
  isPossibleMove(cell: Cell, turn: number): boolean {
    return this.isInReachableRegion(cell) && this.isInSameRegion(cell, turn);
  }
  getMovesMade(turn: number) {
    if (!(turn in this.moves)) return 0;
    return this.moves[turn].length;
  }
  getMarkedRows(cols: number) {
    const rowsArr = Array(cols).fill(0);
    for (let i = 0; i < this.markedRegion.length; i++) {
      const marked = this.markedRegion[i];
      rowsArr[marked.x]++;
    }
    return rowsArr;
  }
}
