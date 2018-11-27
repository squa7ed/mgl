import { TextureManager } from "./TextureManager";
import { IDisposable } from "../Utils";

export type TextureSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap;

export class Texture implements IDisposable {
  constructor(private _manager: TextureManager, public readonly key: string, private _source: TextureSource) {
    this.width = _source.width;
    this.height = _source.height;
  }

  readonly width: number;

  readonly height: number;

  get source() { return this._source; }

  dispose(): void {
    if (this._manager === undefined) {
      return;
    }
    this._manager = undefined;
    this._source = undefined;
  }

}

