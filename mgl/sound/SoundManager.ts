import { Game } from "../Game";
import { Sound } from "./Sound";

export class SoundManager {
  constructor(private _game: Game) {
    this._sounds = new Map();
  }

  private _sounds: Map<string, Sound>;

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

  dispose() {
    this._sounds.forEach(sound => sound.dispose());
    this._sounds.clear();
    this._sounds = undefined;
    this._game = undefined;
  }
}
