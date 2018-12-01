import { Texture } from './textures/Texture';
import { Scene } from "./scene/Scene";
import { TextureManager } from "./textures/TextureManager";
import { SoundManager } from "./sound/SoundManager";
import { Sound } from "./sound/Sound";
import { IDisposable } from "./Utils";

export class Loader implements IDisposable {
  constructor(private _scene: Scene) {
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
    this.scene.events.once('dispose', this.dispose, this);
  }

  dispose(): void {
    if (this.scene === undefined) {
      return;
    }
    this._scene = undefined;
  }

  image(key: string, url: string): void {
    if (url === undefined) {
      return;
    }
    if (this._textures.has(key)) {
      return;
    }
    console.debug(`loading image ${key}`);
    this.pending++;
    let img = new Image();
    img.onload = (event: Event) => {
      let img = <HTMLImageElement>event.target;
      this._textures.add(key, new Texture(this._textures, key, img));
      this.pending--;
      console.debug(`image ${key} loaded`);
    }
    img.src = url;
  }

  sound(key: string, url: string): void {
    if (url === undefined) {
      return;
    }
    if (this._sounds.has(key)) {
      return;
    }
    console.debug(`loading sound ${key}`);
    this.pending++;
    let audio = new Audio();
    audio.oncanplaythrough = () => {
      this._sounds.add(key, new Sound(this._sounds, key, audio));
      audio.oncanplaythrough = undefined;
      this.pending--;
      console.debug(`sound ${key} loaded`);
    };
    audio.src = url;
  }
}