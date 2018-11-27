import { InputManager } from "./InputManager";
import { IDisposable } from "../Utils";

export class TouchManager implements IDisposable {
  constructor(private _manager: InputManager) {
    this._target = undefined;
    this._handler = undefined;
  }

  private _target: HTMLCanvasElement;

  private _handler: (event) => {};

  boot(): void {
    this._target = this._manager.game.canvas;
    this._addListeners();
  }

  dispose(): void {
    this._removeListeners();
    this._manager = undefined;
    this._target = undefined;
    this._handler = undefined;
  }

  private _addListeners(): void {
    let handler;
    let target = this._target;
    let manager = this._manager;
    handler = function (event) {
      if (event.defaultPrevented) {
        return;
      }
      manager.queueEvent(event);
      event.preventDefault();
    };

    target.addEventListener('touchstart', handler);
    target.addEventListener('touchmove', handler);
    target.addEventListener('touchend', handler);
    this._handler = handler;
  }

  private _removeListeners() {
    this._target.removeEventListener('touchstart', this._handler);
    this._target.removeEventListener('touchmove', this._handler);
    this._target.removeEventListener('touchend', this._handler);
  }

}
