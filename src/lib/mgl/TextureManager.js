import Game from "./Game";

export default class TextureManager {
  /**
   * 
   * @param {Game} game 
   */
  constructor(game) {
    this.game = game;
    this.textures = new Map();
    game.events.once('boot', this.boot, this);
  }

  boot() {
    this.game.events.once('exit', this.dispose, this);
  }

  get(key) {
    return this.textures.get(key);
  }

  has(key) {
    return this.textures.has(key);
  }

  add(key, texture) {
    if (this.has(key)) {
      let texture = this.get(key);
      texture.addSource(key, texture.source, texture.source.width, texture.source.height);
      return;
    }
    this.textures.set(key, texture);
  }

  dispose() {
    if (this.game === undefined) {
      return;
    }
    this.textures.forEach(texture => texture.dispose());
    this.textures.clear();
    this.textures = undefined;
    this.game = undefined;
  }
}