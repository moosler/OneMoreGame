import Phaser from "phaser";
import { Game } from "../game/game";

export let gameInstance: Game;

export default class OneMore extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    // this.load.image("logo", "assets/phaser3-logo.png");
  }

  create() {
    gameInstance = new Game(this);
    //  Let's show the logo when the camera shakes, and hide it when it completes
    this.cameras.main.on("camerashakestart", function () {
      // logo.setVisible(true);
    });
  }
}
