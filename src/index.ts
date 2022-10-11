import Phaser from "phaser";
import config from "./config";
import GameScene from "./scenes/Game";

let con = Object.assign(config, {
  scene: [GameScene],
});
export var phaserGame = new Phaser.Game(con);
