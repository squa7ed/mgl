import { Scene } from "./Scene";
import { DisplayList } from "../displayobjects/DisplayList";

export class System {
  constructor(private _scene: Scene, public readonly key: string) {
  }

  private _status: SceneStatus;

  get status() { return this._status; }

  private _displayList: DisplayList;

  boot() {
    this._status = SceneStatus.PENDING;
    this._displayList = this._scene.displayList;
    this._scene.events.emit('boot');
  }

  start(): void {
    // load
    this._scene.onLoad();
    if (this._scene.load.pending > 0) {
      this._scene.events.once('loaded',
        // create
        () => {
          this._scene.onCreate();
          this._scene.events.emit('start', this._scene);
          this._status = SceneStatus.RUNNING;
        }, this);
    } else {
      this._scene.onCreate();
      this._scene.events.emit('start', this._scene);
      this._status = SceneStatus.RUNNING;
    }
  }

  pause(): void {
    this._scene.events.emit('pause', this._scene);
    this._status = SceneStatus.PAUSED;
  }

  stop(): void {
    this._displayList.clear();
    this._scene.events.removeAllListeners();
    this._scene.timer.clear();
    this._scene.input.clear();
    this._scene.tweens.clear();
    this._scene.events.emit('stop', this._scene);
    this._status = SceneStatus.PENDING;
  }

  update(time: number, dt: number): void {
    this._scene.timer.update(time, dt);
    this._scene.input.update(time, dt);
    this._scene.tweens.update(time, dt);
    this._scene.onUpdate(time, dt);
  }

  render(context: CanvasRenderingContext2D) {
    this._displayList.render(context);
  }
}

export enum SceneStatus {
  PENDING,
  RUNNING,
  PAUSED
}