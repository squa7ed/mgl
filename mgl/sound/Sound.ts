import { SoundManager } from "./SoundManager";

export class Sound {
  constructor(private _manager: SoundManager, private _key: string, private _soundSource: HTMLAudioElement) {
    _soundSource.onplay = () => {
      this._isPlaying = true;
    }
    _soundSource.onended = () => {
      this._isPlaying = false;
    }
    _soundSource.onpause = () => {
      this._isPlaying = false;
    }
  }

  get key() { return this._key; }

  private _isPlaying: boolean = false;

  get isPlaying() { return this._isPlaying; }

  stop(): void {
    this._soundSource.pause();
    this._soundSource.currentTime = 0;
  }

  play(): void {
    this._soundSource.currentTime = 0;
    this._soundSource.play();
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
