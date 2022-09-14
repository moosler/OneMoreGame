import Phaser from "phaser";
import { Game } from "../game/game";

export default class Demo extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("logo", "assets/phaser3-logo.png");
  }

  create() {
    let game = new Game(this);
  }
}
