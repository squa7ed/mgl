import { GameConfig, Game } from "./mgl";
import { GameScene, StartScene } from "./scenes";

let canvas = document.createElement('canvas');

document.getElementById('container').appendChild(canvas);

let config: GameConfig = {
  canvas: canvas,
  scenes: [
    { key: 'GameScene', ctor: GameScene },
    { key: 'StartScene', ctor: StartScene }
  ],
  width: 375,
  height: 667,
  background: '#ffffff'
}

let game = new Game(config);
game.scene.start('StartScene');