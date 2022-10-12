import Phaser from "phaser";
import { Dice, diceColors, diceValues } from "./dice";

let style = {
  fill: 0xaaaaaa,
  strokeColor: 0x2e4053,
  strokWeigth: 2,
};

export class DiceField {
  scene: Phaser.Scene;
  x: number;
  y: number;
  rectSize: number;
  textElement: Phaser.GameObjects.Text | undefined;
  textElementPoint: Phaser.GameObjects.Text | undefined;
  field: Phaser.GameObjects.Rectangle | undefined;
  groupField: Phaser.Physics.Arcade.Group;
  margin: number;
  dicesNo: number;
  dices: any[];
  groupDice: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, x: number, y: number, rectSize: number) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.rectSize = rectSize;
    this.field;
    this.groupField = this.scene.physics.add.group();
    this.groupDice = this.scene.physics.add.group();
    this.margin = 5;
    this.dicesNo = 6;
    this.dices = new Array(this.dicesNo);
    this.init();
  }
  init() {
    this.field = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.x + (this.rectSize * this.dicesNo) / 2,
      this.y,
      this.rectSize * this.dicesNo + this.margin * 2,
      this.rectSize + this.margin * 2,
      style.fill
    );
    this.field.setStrokeStyle(style.strokWeigth, style.strokeColor);
    this.groupField.add(this.field, true);
    this.createDices();
  }
  createDices() {
    let x = this.x + this.rectSize / 2;
    let mid = 3;
    for (let i = 0; i < this.dices.length; i++) {
      const type = i < mid ? "val" : "color";
      this.dices[i] = new Dice(this.scene, x, this.y, this.rectSize, type);

      this.groupDice.add(this.dices[i].gameObject, true);
      x += this.rectSize;
    }
  }
  getDiceValues(): number[] {
    let colAr = [];
    let mid = 3;
    for (let i = 0; i < mid; i++) {
      const element = this.dices[i];
      if (element.isUsed === false) {
        let val = element.getValue();
        if (val == "?") {
          let nArr = [...diceValues];
          nArr.pop();
          return nArr.map(Number);
        }
        colAr.push(parseInt(val));
      }
    }
    let unique = colAr.filter(function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    });
    return unique;
  }
  getDiceColors() {
    let colAr = [];
    let mid = 3;
    for (let i = mid; i < this.dices.length; i++) {
      const element = this.dices[i];
      if (element.isUsed === false) {
        let col = element.getColor();
        if (col == "#111111") {
          let nArr = [...diceColors];
          nArr.pop();
          return nArr;
        }
        colAr.push(col);
      }
    }
    let unique = colAr.filter(function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    });
    return unique;
  }

  // isInRange(no: number) {
  //   let values = this.getDiceValues();
  //   const min = Math.min(...values);
  //   const max = Math.max(...values);
  //   return no <= max && no >= min;
  // }
  matchesValue(no: number) {
    let values = this.getDiceValues();
    return values.includes(no);
  }
  isSmallerThen(no: number) {
    let values = this.getDiceValues();
    const max = Math.max(...values);
    return no <= max;
  }
  shuffleDices(arr: string[] | null = null) {
    for (let i = 0; i < this.dices.length; i++) {
      const dice = this.dices[i];
      if (arr) {
        dice.setNewDiceValue(arr[i]);
      } else {
        dice.setNewDiceValue();
      }
    }
  }
}
