import { Scene } from "./Scene";
import { IDisposable } from "../Utils";
import { SceneManager } from "./SceneManager";

export class ScenePlugin implements IDisposable {
  constructor(private _scene: Scene) {
    _scene.events.once('boot', this.boot, this);
    _scene.events.once('dispose', this.dispose, this);
  }

  private _manager: SceneManager;

  private _key: string;

  boot(): void {
    this._manager = this._scene.game.scene;
    this._key = this._scene.sys.key;
  }

  dispose(): void {
    if (this._scene === undefined) {
      return;
    }
    this._manager = undefined;
    this._scene = undefined;
  }

  start(key: string, data?: any): void {
    this._manager.stop(this._key);
    this._manager.start(key, data);
  }

  restart(key: string, data?: any): void {
    this._manager.stop(key);
    this._manager.start(key, data);
  }

  stop(key?: string): void {
    if (key === undefined) {
      key = this._key;
    }
    this._manager.stop(key);
  }

  pause(key: string): void {
    this._manager.pause(key);
  }

  run(key: string, data?: any): void {
    this._manager.pause(this._key);
    this._manager.start(key, data);
  }

  launch(key: string, data?: any) {
    this._manager.start(key, data);
  }

  resume(key: string): any {
    this._manager.resume(key);
  }

}