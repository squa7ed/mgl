import { EventEmitter } from "./EventEmitter";
import { Texture } from './textures/Texture';
import { Scene } from "./scene/Scene";
import { TextureManager } from "./textures/TextureManager";
import { SoundManager } from "./sound/SoundManager";
import { Sound } from "./sound/Sound";

export class Loader extends EventEmitter {
  constructor(private _scene: Scene) {
    super();
    this._pending = 0;
    _scene.events.once('boot', this.boot, this);
  }

  private _textures: TextureManager;

  private _sounds: SoundManager;

  private _pending: number;

  get scene() { return this._scene; }

  get pending() { return this._pending; }
  set pending(value) {
    if (value === this._pending) {
      return;
    }
    this._pending = value;
    if (this._pending === 0) {
      this.scene.events.emit('loaded', this.scene);
    }
  }

  boot(): void {
    this._textures = this._scene.textures;
    this._sounds = this._scene.sound;
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
    console.info(`loading image ${key}`);
    this.pending++;
    let img = new Image();
    img.onload = () => {
      this._textures.add(key, new Texture(this._textures, key, img));
      this.pending--;
      console.info(`image ${key} loaded`);
    };
    img.src = url;
  }

  sound(key: string, url: string): void {
    if (url === undefined) {
      return;
    }
    console.info(`loading sound ${key}`);
    this.pending++;
    let audio = new Audio();
    audio.oncanplaythrough = () => {
      this._sounds.add(key, new Sound(this._sounds, key, audio));
      this.pending--;
      audio.oncanplaythrough = null;
      console.info(`sound ${key} loaded`);
    };
    audio.src = url;
  }
}