import Phaser from "phaser";
import { Game } from "../game/game";

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
  }
}
