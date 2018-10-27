import { InputPlugin } from "./InputPlugin";
import { DisplayObject } from "../displayobjects/DisplayObject";
import { Pointer } from "./Pointer";

export class InteractiveObject {
  constructor(private _manager: InputPlugin, private _target: DisplayObject) {
    this._isEnabled = false;
  }

  private _isEnabled: boolean;

  get target() { return this._target; }

  get isEnabled() { return this._isEnabled; }

  disable() {
    if (!this._isEnabled) {
      return;
    }
    this._isEnabled = false;
    this._manager.remove(this);
  }

  enable() {
    if (this._isEnabled) {
      return;
    }
    this._isEnabled = true;
    this._manager.add(this);
    return this.target;
  }

  isPointerOver(pointer: Pointer) {
    // TODO test hitarea
    return this.target.visible &&
      pointer.x > this.target.displayX &&
      pointer.x < this.target.displayX + this.target.displayWidth &&
      pointer.y > this.target.displayY &&
      pointer.y < this.target.displayY + this.target.displayHeight;
  }

}
