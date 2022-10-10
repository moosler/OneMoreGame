import Phaser from "phaser";

export let styleNonInteractiveRect = {
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
    depth: 3,
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

export class Rect {
  rectSize: number;
  x: number;
  y: number;
  group: any;
  scene: Phaser.Scene;
  style: {
    font: any;
    fill: number;
    strokeColor: number;
    strokeColorStart: number;
    strokWeigth: number;
    depth: number;
    highlightPermanent: any;
    alpha: number;
    strokeWeigth: number;
    highlight: any;
    hover: any;
  };
  gameObject: Phaser.GameObjects.Rectangle;
  text: string;
  textObject: Phaser.GameObjects.Text;
  pos: { x: number; y: number };
  highlight: boolean;
  isHovered: boolean;
  highlightPermanent: boolean;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    rectSize: number,
    isMid: boolean,
    style: any,
    text: string = "",
    pos: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.rectSize = rectSize;
    this.style = style;
    this.text = text;
    this.pos = pos;
    this.highlightPermanent = isMid;

    if (isMid) {
      this.style.strokeColor = this.style.strokeColorStart;
    }
    this.style = {
      ...styleNonInteractiveRect,
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
    this.highlight = false; //highlight region
    this.isHovered = false;
    this.init();
  }
  init() {
    this.style.font.size = this.rectSize * 0.5 * this.style.font.multiplier;
    this.setTextStyle();
    this.setRectStyle();
    this.draw();
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
    if (this.highlight) {
      strokeColor = this.style.highlight.strokeColor;
      strokeWeight = this.style.highlight.strokeWeigth;
    }
    if (this.highlightPermanent) {
      strokeColor = this.style.highlightPermanent.strokeColor;
      strokeWeight = this.style.highlightPermanent.strokeWeigth;
    }
    if (this.isHovered) {
      strokeColor = this.style.hover.strokeColor;
      strokeWeight = this.style.hover.strokeWeigth;
    }
    this.gameObject.setStrokeStyle(strokeWeight, strokeColor);
  }
  draw() {
    this.setRectStyle();
    this.setTextStyle();
  }
}
