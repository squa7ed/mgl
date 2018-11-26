import { Scene } from "./Scene";
import { DisplayList } from "../displayobjects/DisplayList";

export class System {
  constructor(private _scene: Scene, public readonly key: string) {
  }

  public status: SceneStatus;

  public isBooted: boolean;

  private _displayList: DisplayList;

  boot() {
    this.status = SceneStatus.PENDING;
    this._displayList = this._scene.displayList;
    this.isBooted = true;
    this._scene.events.emit('boot');
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
  START,
  LOAD,
  CREATE,
  RUNNING,
  PAUSED,
  STOP,
  DISPOSED
}