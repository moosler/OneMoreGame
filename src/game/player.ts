export class Player {
  name: String;
  reachableRegion: { x: number; y: number; }[];
  markedRegion: { x: number; y: number; }[];
  
  constructor(name:String) {
    this.name = name;
    this.reachableRegion = [{x:7,y:0},{x:7,y:1},{x:7,y:2},{x:7,y:3},{x:7,y:4},{x:7,y:5},{x:7,y:6},{x:7,y:6}];
    this.markedRegion = [];
    this.init();
  }
  init() {
  }
}
