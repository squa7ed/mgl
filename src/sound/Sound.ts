import { SoundManager } from "./SoundManager";
import { IDisposable } from "../Utils";

export class Sound implements IDisposable {
  constructor(private _manager: SoundManager, private _key: string, private _soundSource: HTMLAudioElement) {
  }

  get key() { return this._key; }

  private _isPlaying: boolean = false;

  get isPlaying() { return this._isPlaying; }

  stop(): void {
    this._soundSource.pause();
    this._soundSource.currentTime = 0;
    this._isPlaying = false;
  }

  play(): void {
    this._soundSource.currentTime = 0;
    this._soundSource.play();
    this._isPlaying = true;
  }

  dispose(): void {
    if (this._manager === undefined) {
      return;
    }
    this._soundSource.onplay = null;
    this._soundSource.onended = null;
    this._soundSource.onpause = null;
    this._soundSource = undefined;
    this._manager = undefined;
  }
}
