import { Scene } from "./Scene";
import { DisplayList } from "../displayobjects/DisplayList";

export class System {
  constructor(private _scene: Scene) {
  }

  public status: SceneStatus;

  public isBooted: boolean;

  private _context: CanvasRenderingContext2D;

  private _displayList: DisplayList;

  boot() {
    this.status = SceneStatus.PENDING;
    this._context = this._scene.game.context;
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

  render() {
    this._displayList.render(this._context);
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