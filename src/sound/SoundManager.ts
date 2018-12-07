import { Game } from "../Game";
import { Sound } from "./Sound";
import { IDisposable } from "../Utils";

export class SoundManager implements IDisposable {
  constructor(private _game: Game) {
    this._sounds = new Map();
  }

  private _sounds: Map<string, Sound>;

  private _mute: boolean;

  get muted() { return this._mute }

  set muted(value) {
    if (this._mute === value) {
      return;
    }
    this._mute = value;
    this._sounds.forEach(sound => sound.muted = value);
    this._game.events.emit('mute', value);
  }

  add(key: string, sound: Sound): void {
    if (this.has(key)) {
      return;
    }
    this._sounds.set(key, sound);
  }

  has(key: string): boolean {
    return this._sounds.has(key);
  }

  get(key: string): Sound {
    return this._sounds.get(key);
  }

  play(key: string): void {
    if (this.muted) {
      return;
    }
    let sound = this.get(key);
    if (sound.isPlaying) {
      sound.stop();
    }
    sound.play();
  }

  stop(key: string): void {
    let sound = this._sounds.get(key);
    if (sound.isPlaying) {
      sound.stop();
    }
  }

  dispose(): void {
    this._sounds.forEach(sound => sound.dispose());
    this._sounds.clear();
    this._sounds = undefined;
    this._game = undefined;
  }
}
