import { Rect } from "./rect";
export class Player {
  name: String;
  reachableRegion: { x: number; y: number }[];
  markedRegion: { x: number; y: number }[];
  index: number;

  constructor(name: String, index: number) {
    this.name = name;
    this.index = index;
    /**
     * @todo calc initial Region
     */
    this.reachableRegion = [
      { x: 7, y: 0 },
      { x: 7, y: 1 },
      { x: 7, y: 2 },
      { x: 7, y: 3 },
      { x: 7, y: 4 },
      { x: 7, y: 5 },
      { x: 7, y: 6 },
      { x: 7, y: 6 },
    ];
    this.markedRegion = [];
    this.init();
  }
  init() {}
  setMark(cell: Rect) {
    let obj = { x: cell.pos.x, y: cell.pos.y };
    //add cell to markedRegion
    this.addToArrayIfNotExist(obj, this.markedRegion);
    //add cell to reachableRegion
    this.addToArrayIfNotExist(obj, this.reachableRegion);
  }
  addToArrayIfNotExist(obj: { x: any; y: any }, arr: any[]) {
    const index = arr.findIndex(
      (object: { x: any; y: any }) => object.x === obj.x && object.y === obj.y
    );
    if (index === -1) {
      arr.push(obj);
    }
  }
}
