// import { Rect } from "./rect";
import { Cell } from "./cell";
export class Player {
  name: String;
  reachableRegion: { x: number; y: number }[];
  markedRegion: { x: number; y: number }[];
  index: number;

  constructor(
    name: String,
    index: number,
    reachableRegion: { x: number; y: number }[]
  ) {
    this.name = name;
    this.index = index;
    this.reachableRegion = reachableRegion;
    this.markedRegion = [];
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
  // isCellInMarkedRegion(cell: Rect): boolean {
  //   for (let j = 0; j < this.markedRegion.length; j++) {
  //     const markedCell = this.markedRegion[j];
  //     if (markedCell.x == cell.x && markedCell.y == cell.y) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  calcMovePosibilites() {
    //this.reachableRegion not marked
    //this.reachableRegion for each dice Color
    //this.reachableRegion for each dice Value
  }
}
