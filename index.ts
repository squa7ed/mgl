import { GameConfig, Game } from "./mgl";
import { GameScene, StartScene } from "./scenes";


let config: GameConfig = {
  scenes: [GameScene, StartScene]
}

let game = new Game(config);
game.scene.start('StartScene');