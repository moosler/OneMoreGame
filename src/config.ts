import Phaser from "phaser";

export default {
  // type: Phaser.AUTO,
  type: Phaser.CANVAS,
  parent: "game",
  backgroundColor: "#1E1E1E",
  scale: {
    width: 800,
    height: 600,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
  },
};
