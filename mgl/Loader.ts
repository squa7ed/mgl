import { EventEmitter } from "./EventEmitter";
import { Texture } from './textures/Texture';
import { Scene } from "./scene/Scene";
import { TextureManager } from "./textures/TextureManager";

export class Loader extends EventEmitter {
  constructor(private _scene: Scene) {
    super();
    this._textures = _scene.textures;
    this._pending = 0;
    _scene.events.once('boot', this.boot, this);
  }

  private readonly _textures: TextureManager;

  private _pending: number;

  get scene() { return this._scene; }

  get pending() { return this._pending; }
  set pending(value) {
    if (value === this._pending) {
      return;
    }
    this._pending = value;
    if (this._pending === 0) {
      this.scene.events.emit('load');
    }
  }

  boot(): void {
    this.scene.events.once('exit', this.dispose, this);
  }

  dispose(): void {
    if (this.scene === undefined) {
      return;
    }
    this._scene = undefined;
    this.removeAllListeners();
  }

  image(key: string, url: string): void {
    if (url === undefined) {
      return;
    }
    this.pending++;
    let img = new Image();
    img.onload = () => {
      this._textures.add(key, new Texture(this._textures, key, img));
      this.pending--;
    };
    img.src = url;
  }
}