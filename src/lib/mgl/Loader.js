import EventEmitter from "./EventEmitter";
import { Texture } from './textures';

export default class Loader extends EventEmitter {
  constructor(scene) {
    super();
    this.scene = scene;
    this.textures = scene.textures;
    this._pending = 0;
    scene.once('boot', this.boot, this);
  }

  boot() {
    this.scene.events.once('exit', this.dispose, this);
  }

  dispose() {
    if (this.scene === undefined) {
      return;
    }
    this.scene = undefined;
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
      console.debug('loaded');
      this.scene.emit('load');
    }
  }
}