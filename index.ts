import { GameConfig, Game } from "./mgl";
import { GameScene, StartScene } from "./scenes";

let canvas = document.createElement('canvas');

document.getElementById('container').appendChild(canvas);

let config: GameConfig = {
  canvas: canvas,
  scenes: [GameScene, StartScene],
  width: 320,
  height: 568,
  background: '#ffffff'
}

let game = new Game(config);
game.scene.start('StartScene');