// import { Rect } from "./rect";
import { Cell } from "./cell";
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

  constructor(
    name: String,
    index: number,
    reachableRegion: { x: number; y: number }[]
  ) {
    this.name = name;
    this.index = index;
    this.reachableRegion = reachableRegion;
    this.markedRegion = [];
    this.bonusPoints = 0;
    this.colPoints = 0;
    this.starPoints = 0;
    this.jokerPoints = 0;
    this.totalPoints = 0;
    this.init();
  }
  init() {}
  setMark(cell: Cell, neighbors: Cell[]) {
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
  }
  addToArrayIfNotExist(obj: { x: any; y: any }, arr: any[]) {
    const index = arr.findIndex(
      (object: { x: any; y: any }) => object.x === obj.x && object.y === obj.y
    );
    if (index === -1) {
      arr.push(obj);
    }
  }
  incrementStarPoints() {
    this.starPoints = this.starPoints + 1;
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
}
