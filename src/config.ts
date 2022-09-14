import Phaser from "phaser";

export default {
  // type: Phaser.AUTO,
  type: Phaser.CANVAS,
  parent: "game",
  backgroundColor: "#4c4275",
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
