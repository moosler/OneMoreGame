import Phaser from "phaser";
import { Grid } from "./grid";
import { TopRow } from "./topRow";
import { PointsRow } from "./pointsRow";
import { JokerRow } from "./jokerRow";
import { PointsCol } from "./pointsCol";
import { DiceField } from "./diceField";
import { Button } from "./button";
import { Player } from "./player";

/**
 * @todo use hex Colors
let diceColors = ["#62b1db", "#c66a8d", "#ae7749", "#c8b47f", "#58853e", "#111111"];
 * 
 */
export const rectColors = [
  { r: 98, g: 177, b: 219 }, //blue #62b1db //6468059
  { r: 198, g: 106, b: 141 }, //red #c66a8d //13003405
  { r: 174, g: 119, b: 73 }, //orange #ae7749 // 11433801
  { r: 200, g: 180, b: 127 }, //yellow #c8b47f //13153407
  { r: 88, g: 133, b: 62 }, //green #58853e // 5801278
];

export let styleDefaultRect = {
  color: 0xff0000,
  strokeColor: 0x2e4053,
  strokeColorStart: 0xeaeded,
  strokWeigth: 2,
};

export class Game {
  scene: Phaser.Scene;
  grid: Grid;
  marginLeft: number;
  marginTop: number;
  topRow: TopRow;
  pointsRow: PointsRow;
  jokerRow: JokerRow;
  pointsCol: PointsCol;
  diceField: DiceField;
  diceButton: Button;
  nextButton: Button;
  players: Player[] | any;
  playerStat: Phaser.GameObjects.Text;
  currentPlayer: Player;
  turn: number;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.marginLeft = 50;
    this.marginTop = 50;
    this.grid = new Grid(this.scene, this.marginLeft, this.marginTop + 50);
    this.players = [new Player("One", 1), new Player("Two", 2)];
    this.currentPlayer = this.players[0];
    this.turn = 1;
    /**@todo move to UI Components */

    this.playerStat = this.scene.add.text(
      this.scene.sys.game.canvas.width * 0.5,
      0,
      String(""),
      {
        font: "25px Arial Black",
        color: "#aaa",
      }
    );
    this.playerStat.x -= this.playerStat.width * 0.5;

    this.topRow = new TopRow(
      this.scene,
      this.marginLeft,
      this.marginTop,
      this.grid.cols
    );
    this.pointsRow = new PointsRow(
      this.scene,
      this.marginLeft,
      this.marginTop + 50 + this.grid.rectSize * (this.grid.rows + 1),
      this.grid.cols
    );
    this.jokerRow = new JokerRow(
      this.scene,
      this.marginLeft,
      this.marginTop + 3 * 50 + this.grid.rectSize * (this.grid.rows + 1),
      this.grid.cols
    );
    this.pointsCol = new PointsCol(
      this.scene,
      this.marginLeft + 30 + this.grid.rectSize * (this.grid.cols + 1),
      this.marginTop,
      this.grid.cols
    );
    this.diceField = new DiceField(
      this.scene,
      this.marginLeft + this.grid.rectSize * (this.grid.cols / 2 + 2),
      this.marginTop + 3 * 50 + this.grid.rectSize * (this.grid.rows + 1),
      this.grid.rectSize
    );
    this.diceButton = new Button(
      this.marginLeft + 100,
      580,
      "Start Game",
      this.scene,
      () => console.log("game is started")
    );
    this.nextButton = new Button(
      this.marginLeft + 400,
      580,
      "=> " + this.turn + "." + this.currentPlayer.index,
      this.scene,
      () => {
        console.log("next round");
        this.nextStep();
      }
    );

    this.init();
  }
  init() {
    this.setPlayer();
  }
  nextStep() {
    this.nextPlayer();
  }
  rotatePlayerArray() {
    let first = this.players.shift();
    this.players.push(first);
  }
  nextPlayer() {
    let index = this.currentPlayer.index; //index starts at one
    let nextIndex = index % this.players.length;
    if (nextIndex - 1 > index) {
      this.rotatePlayerArray();
      this.turn++;
    }
    this.currentPlayer = this.players[nextIndex];
    this.setPlayer();
  }
  setPlayer() {
    let player = this.currentPlayer;
    this.playerStat.text = "" + player.name + "´s (" + player.index + ") turn:";
    this.playerStat.x =
      this.scene.sys.game.canvas.width * 0.5 - this.playerStat.width * 0.5;
  }
}
