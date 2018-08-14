import EventEmitter from "./EventEmitter";
import Game from "./Game";
import Texture from './Texture';

export default class Loader extends EventEmitter {
  /**
   * 
   * @param {Game} game 
   */
  constructor(game) {
    super();
    this.game = game;
    this.textures = game.textures;
    this._pending = 0;
    game.events.once('boot', this.boot, this);
  }

  boot() {
    this.game.events.once('exit', this.dispose, this);
  }

  dispose() {
    if (this.game === undefined) {
      return;
    }
    this.game = undefined;
    super.dispose();
  }

  image(key, url) {
    if (url === undefined) {
      return;
    }
    console.debug(`adding image ${url} with key ${key}.`);
    this.pending++;
    let img = new Image();
    img.onload = () => {
      console.debug(`image ${key} loaded.`);
      this.textures.add(key, new Texture(this.textures, key, img));
      console.debug(`texture ${key} added.`);
      this.pending--;
    };
    img.src = url;
  }

  get pending() { return this._pending; }
  set pending(value) {
    if (value === this._pending) {
      return;
    }
    this._pending = value;
    if (this._pending === 0) {
      this.emit('load')
    }
  }
}