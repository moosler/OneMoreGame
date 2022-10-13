import Phaser from "phaser";
import { CellBorder } from "../game/cellBorders";
import { gameInstance } from "../scenes/Game";

export let styleDefaultRect = {
  fill: 0xff0000,
  strokeColor: 0x2e4053,
  strokeColorStart: 0xeaeded,
  strokeWeigth: 2,
  depth: 1,
  alpha: 1,
  font: {
    size: 15, //is calculated depending on the cell
    font: "Arial Black",
    fill: "#879eb4",
    fillPermanent: "#974c75",
    strokeColor: "#111",
    strokeWeight: 6,
    multiplier: 1,
    starMultiplier: 1.75,
    depth: 3,
    starDepth: 2,
    shadow: {
      x: 2,
      y: 2,
      color: "#333333",
      blur: 2,
      stroke: true,
      fill: true,
    },
  },
  hover: {
    strokeColor: 0xefc53f,
    strokeWeigth: 4,
  },
  highlight: {
    strokeColor: 0x38c885,
    strokeWeigth: 4,
  },
  highlightPermanent: {
    strokeColor: 0xc3c3c3,
    strokeWeigth: 4,
  },
};

export class Cell {
  rectSize: number;
  x: number;
  y: number;
  scene: Phaser.Scene;
  gameObject: Phaser.GameObjects.Rectangle;
  style: any;
  pos: { x: number; y: number };
  isInteractive: boolean;
  marked: boolean;
  highlight: boolean;
  regionIndex: number;
  isStar: undefined | boolean;
  isHovered: boolean;
  textObject: Phaser.GameObjects.Text;
  text: string;
  highlightPermanent: boolean;
  isX: boolean;
  starObject: Phaser.GameObjects.Text | undefined;
  borders: CellBorder[];

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    rectSize: number,
    pos: { x: number; y: number } = { x: 0, y: 0 },
    text: string = "",
    isInteractive = true,
    highlightPermanent = false,
    style: {} = {}
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.rectSize = rectSize;
    this.pos = pos;
    this.text = text;
    this.isInteractive = isInteractive;
    this.highlightPermanent = highlightPermanent;
    this.style = {
      ...styleDefaultRect,
      ...style,
    };

    this.gameObject = new Phaser.GameObjects.Rectangle(
      this.scene,
      this.x,
      this.y,
      this.rectSize,
      this.rectSize,
      this.style.fill
    );
    this.textObject = this.scene.add.text(
      this.x - this.rectSize * 0.5,
      this.y - this.rectSize * 0.5,
      this.text,
      {
        font: this.style.font.size + "px " + this.style.font.font,
        color: this.style.font.fill,
      }
    );
    (this.isX = false), (this.marked = false); //only for region calculation
    this.highlight = false; //highlight region
    this.isHovered = false;
    this.regionIndex = -1;
    this.isStar = undefined;
    this.starObject = undefined;
    this.borders = this.initBorders();

    this.init();
  }
  initBorders() {
    return [
      new CellBorder(this, this.scene, "north"),
      new CellBorder(this, this.scene, "east"),
      new CellBorder(this, this.scene, "south"),
      new CellBorder(this, this.scene, "west"),
    ];
  }
  init() {
    this.style.font.size = this.rectSize * 0.5 * this.style.font.multiplier;
    this.setTextStyle();
    this.setRectStyle();
    this.draw();
    this.setInteraction();
  }
  setTextStyle() {
    let size = this.style.font.size;
    this.textObject.setFontStyle(size + "px");
    this.textObject.setStroke(
      this.style.font.strokeColor,
      this.style.font.strokeWeight
    );
    // this.textObject.setFill(0xff00ff);
    let color = this.style.font.fill;
    if (this.highlightPermanent) {
      color = this.style.font.fillPermanent;
    }
    this.textObject.setColor(color);
    this.textObject.setShadow(
      this.style.font.shadow.x,
      this.style.font.shadow.y,
      this.style.font.shadow.color,
      this.style.font.shadow.blur,
      this.style.font.shadow.stroke,
      this.style.font.shadow.fill
    );
    this.textObject.setDepth(this.style.font.depth);
    Phaser.Display.Align.In.Center(this.textObject, this.gameObject);
  }
  setFill(color: number) {
    this.style.fill = color;
    this.gameObject.setFillStyle(this.style.fill, this.style.alpha);
  }
  setRectStyle() {
    this.gameObject.setDepth(this.style.depth);
    this.gameObject.setFillStyle(this.style.fill, this.style.alpha);
    let strokeColor = this.style.strokeColor;
    let strokeWeight = this.style.strokeWeigth;

    if (this.highlightPermanent) {
      strokeColor = this.style.highlightPermanent.strokeColor;
      strokeWeight = this.style.highlightPermanent.strokeWeigth;
    }
    if (this.highlight) {
      strokeColor = this.style.highlight.strokeColor;
      strokeWeight = this.style.highlight.strokeWeigth;
    }
    if (this.isHovered) {
      strokeColor = this.style.hover.strokeColor;
      strokeWeight = this.style.hover.strokeWeigth;
    }
    this.gameObject.setStrokeStyle(strokeWeight, strokeColor);
  }
  setInteraction() {
    if (this.isInteractive) {
      this.gameObject.setInteractive();
      this.gameObject.on("pointerover", () => {
        this.isHovered = true;
        this.draw();
      });
      this.gameObject.on("pointerout", () => {
        this.isHovered = false;
        this.draw();
      });
      this.gameObject.on("pointerdown", () => {
        gameInstance.setXForPlayer(this);
      });
    }
  }
  setStroke(color: number, weight: number = 2) {
    this.gameObject.setStrokeStyle(weight, color);
  }
  /**
   * sets Cell as visited
   */
  setMark(marked = true) {
    this.marked = marked;
  }
  setHighlight(neighbors: Cell[]) {
    // this.highlight = true;
    for (let i = 0; i < this.borders.length; i++) {
      const border = this.borders[i];
      border.show(neighbors);
    }
  }

  setX(marked = true) {
    this.isX = marked;
    this.setText("X");
  }
  setText(text: string) {
    this.textObject.text = text;
    this.text = text;
    Phaser.Display.Align.In.Center(this.textObject, this.gameObject);
  }
  setStar() {
    this.isStar = true;
    this.starObject = this.scene.add.text(
      this.x - this.rectSize * 0.5,
      this.y - this.rectSize * 0.5,
      "★",
      {
        font:
          this.rectSize * 0.5 * this.style.font.starMultiplier +
          "px " +
          this.style.font.font,
        color: this.style.font.fill,
      }
    );
    this.starObject.setStroke(
      this.style.font.strokeColor,
      this.style.font.strokeWeight
    );
    this.starObject.setShadow(
      this.style.font.shadow.x,
      this.style.font.shadow.y,
      this.style.font.shadow.color,
      this.style.font.shadow.blur,
      this.style.font.shadow.stroke,
      this.style.font.shadow.fill
    );
    this.starObject.setDepth(this.style.font.starDepth);
    Phaser.Display.Align.In.Center(this.starObject, this.gameObject);
  }
  draw() {
    this.setRectStyle();
    this.setTextStyle();
  }
  resetCell() {
    this.isX = false;
    this.setText("");
    this.highlight = false;
    for (let i = 0; i < this.borders.length; i++) {
      const border = this.borders[i];
      border.reset();
    }
    this.draw();
  }
  getNeighbors() {
    return gameInstance.grid.getNeighbors(this, false, false);
  }
  getRegionIndex(): number {
    return this.regionIndex;
  }
  getColor() {
    return this.style.fill;
  }
  getText() {
    return this.text;
  }
}
