import { Game } from "../Game";
import { Texture } from "./Texture";

export class TextureManager {
  constructor(private _game: Game) {
    this._textures = new Map<string, Texture>();
    this._game.events.once('boot', this.boot, this);
  }

  private _textures: Map<string, Texture>;

  boot() {
    this._game.events.once('exit', this.dispose, this);
  }

  dispose(): void {
    if (this._game === undefined) {
      return;
    }
    this._textures.forEach(texture => texture.dispose());
    this._textures.clear();
    this._textures = undefined;
    this._game = undefined;
  }

  get(key: string): Texture {
    return this._textures.get(key);
  }

  has(key: string): boolean {
    return this._textures.has(key);
  }

  add(key: string, texture: Texture): TextureManager {
    if (this.has(key)) {
      return;
    }
    this._textures.set(key, texture);
  }
}