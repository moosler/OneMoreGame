import Phaser from "phaser";
import { Grid } from "./grid";
import { TopRow } from "./topRow";
import { PointsRow } from "./pointsRow";
import { JokerRow } from "./jokerRow";
import { PointsCol } from "./pointsCol";
import { DiceField } from "./diceField";
import { Button } from "./button";
import { Player } from "./player";
import { Random } from "./random";

export var Rand = new Random();

var debug = false;

/**
 * only for debugging
 * @todo has to be removed
 */
let debugShuffle = ["3", "5", "5", "#c66a8d", "#58853e", "#c8b47f"];
/** */

/**
 * @todo use hex Colors
let diceColors = ["#62b1db", "#c66a8d", "#ae7749", "#c8b47f", "#58853e", "#111111"];
 * 
 */
// Blue #24287B
// red #DD292B
// orange #EF7D36
// yellow #E6DC3F
// green #44A043
export const rectColors = [
  { r: 98, g: 177, b: 219 }, //blue #62b1db //6468059 #24287B
  { r: 198, g: 106, b: 141 }, //red #c66a8d //13003405
  { r: 174, g: 119, b: 73 }, //orange #ae7749 // 11433801
  { r: 200, g: 180, b: 127 }, //yellow #c8b47f //13153407
  { r: 88, g: 133, b: 62 }, //green #58853e // 5801278
];

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
  tickPerTurn: number;
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.marginLeft = 50;
    this.marginTop = 50;
    this.grid = new Grid(this.scene, this.marginLeft, this.marginTop + 50);
    this.players = [
      new Player("One", 0, this.grid.calcReachableRegion()),
      new Player("Two", 1, this.grid.calcReachableRegion()),
      new Player("Hans", 2, this.grid.calcReachableRegion()),
    ];
    this.currentPlayer = this.players[0];
    this.turn = 1;
    this.tickPerTurn = 0;
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
    /**
     * only for debug
     */
    if (debug) {
      this.diceField.shuffleDices(debugShuffle);
      let cell = this.grid.grid[7][3];
      this.players[0].setMark(cell, this.grid.getNeighbors(cell, false, false));
      let cell2 = this.grid.grid[8][3];
      this.players[0].setMark(
        cell2,
        this.grid.getNeighbors(cell2, false, false)
      );
    }
    /** */

    this.setPlayer();
    this.grid.resetCells();
    this.grid.drawCells(this.currentPlayer.markedRegion);
    this.highlightMovements();
  }
  highlightMovements() {
    let regions = this.calcMovementForDices();
    this.grid.highlightRegion(regions);
  }
  nextStep() {
    this.nextPlayer();
    /**
     * @todo remove debug
     */
    let values = null;
    if (debug) {
      values = debugShuffle;
    }
    this.diceField.shuffleDices(values);
    this.grid.resetCells();
    this.grid.drawCells(this.currentPlayer.markedRegion);
    this.highlightMovements();
  }
  rotatePlayerArray() {
    let first = this.players.shift();
    this.players.push(first);
  }
  nextPlayer() {
    let nextIndex = this.tickPerTurn + 1;
    if (this.tickPerTurn === this.players.length - 1) {
      this.rotatePlayerArray();
      this.turn = this.turn + 1;
      nextIndex = 0;
      this.tickPerTurn = -1;
    }
    this.tickPerTurn++;
    this.currentPlayer = this.players[nextIndex];
    this.setPlayer();
  }
  setPlayer() {
    let player = this.currentPlayer;
    this.playerStat.text =
      "" + player.name + "´s (" + (player.index + 1) + ") turn:";
    this.playerStat.x =
      this.scene.sys.game.canvas.width * 0.5 - this.playerStat.width * 0.5;

    this.nextButton.setText(
      "=> " + this.turn + "." + (this.currentPlayer.index + 1)
    );
    this.showPointsForPlayer();
  }
  calcMovementForDices(): number[] {
    let colors = this.diceField.getDiceColors();
    let values = this.diceField.getDiceValues();

    let regions = this.getRegionsdForDices(colors, values);
    let uniqueRegions = regions.filter(function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    });
    /**
     * @todo calc if each region has contiguous free Cells
     *
     */
    return uniqueRegions;
  }
  /**
   * Calculates if a region has enough free cells based on the rolled numbers of the dice.
   * Attention!
   * It is not considered whether the free cells are contiguous. It may be that the region was separated by a previously set cell.
   * @param colors
   * @param values
   * @returns
   */
  getRegionsdForDices(colors: String[], values: number[]): any[] {
    let player = this.currentPlayer;
    let regionsIndexes: any[] = [];
    for (let i = 0; i < player.reachableRegion.length; i++) {
      const obj = player.reachableRegion[i];
      const cell = this.grid.grid[obj.x][obj.y];

      let cellColor = this.convertDectoHex(cell.getColor());
      if (colors.includes(cellColor)) {
        const regionIndex = cell.getRegionIndex();
        if (this.hasRegionEnoughFreeCellsForDice(regionIndex, values)) {
          regionsIndexes.push(regionIndex);
        }
      }
    }
    return regionsIndexes;
  }

  /**
   * calculates if a region has enough free Cells (not marked) for the dice values
   * @param regionIndex
   * @param values
   * @returns
   */
  hasRegionEnoughFreeCellsForDice(
    regionIndex: number,
    values: number[]
  ): boolean {
    const region = this.grid.getRegion(regionIndex);
    let freeCells = this.getFreeRegionCount(region);
    for (let i = 0; i < values.length; i++) {
      const number = values[i];
      if (number <= freeCells) {
        return true;
      }
    }
    return false;
  }
  /**
   * calculates for each region how many free Cells (not marked) exist
   * @param region
   * @returns
   */
  getFreeRegionCount(region: string | any[]): number {
    let freeCells = 0;
    for (let i = 0; i < region.length; i++) {
      const cell = region[i];
      let player = this.currentPlayer;
      freeCells = freeCells + 1;
      if (cell.isX) {
        freeCells = freeCells - 1;
      }
    }
    return freeCells;
  }

  convertDectoHex(dec: Number): String {
    return "#" + dec.toString(16);
  }
  showPointsForPlayer() {
    let points = this.currentPlayer.getAllPoints();
    this.pointsCol.bonusPoints?.setText(points["bonus"]);
    this.pointsCol.colPoints?.setText(points["col"]);
    this.pointsCol.jokerPoints?.setText(points["joker"]);
    this.pointsCol.starPoints?.setText(points["star"]);
    this.pointsCol.totalPoints?.setText(points["total"]);
  }
  setStarPoint() {
    this.currentPlayer.incrementStarPoints();
    this.showPointsForPlayer();
  }
}
