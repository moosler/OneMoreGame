import Phaser from "phaser";
import { Game } from "../game/game";
import { Cell } from "../game/cell";

export let gameInstance: Game;

export default class Demo extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("logo", "assets/phaser3-logo.png");
  }

  create() {
    gameInstance = new Game(this);
    // let test = new Cell(
    //   this,
    //   100,
    //   100,
    //   100,
    //   { x: 1, y: 1 },
    //   "hallo",
    //   true, //isInteractice
    //   false //fillPermanent
    // );
  }
}
