import Phaser from "phaser";
import config from "./config";
import GameScene from "./scenes/Game";

let con = Object.assign(config, {
  scene: [GameScene],
});
var game = new Phaser.Game(con);
