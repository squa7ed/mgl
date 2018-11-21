import { InputManager } from "./InputManager";

export type Point = {
  x: number;
  y: number;
}

export class Pointer {
  constructor(private _manager: InputManager) {
    this._position = { x: 0, y: 0 };
    this.reset();
  }

  private _position: Point;

  private _event: MouseEvent | TouchEvent;

  private _isDown: boolean;

  private _isMove: boolean;

  private _isUp: boolean;

  private _isActive: boolean;

  get position() { return this._position; }

  get x() { return this.position.x; }

  get y() { return this.position.y; }

  get event() { return this._event; }

  get isDown() { return this._isDown; }

  get isMove() { return this._isMove; }

  get isUp() { return this._isUp; }

  get isActive() { return this._isActive; }

  reset(): void {
    this._setPosition(0, 0);
    this._event = undefined;
    this._isDown = false;
    this._isMove = false;
    this._isUp = false;
    this._isActive = false;
  }

  mousedown(event: MouseEvent): void {
    this._isDown = true;
    this._isActive = true;
    this._event = event;
    this._setPosition(event.clientX, event.clientY);
    this._manager.transformPosition(this.position);
  }

  mousemove(event: MouseEvent): void {
    this._isMove = true;
    this._isActive = true;
    this._event = event;
    this._setPosition(event.clientX, event.clientY);
    this._manager.transformPosition(this.position);
  }

  mouseup(event: MouseEvent): void {
    this._isUp = true;
    this._isActive = true;
    this._event = event;
    this._setPosition(event.clientX, event.clientY);
    this._manager.transformPosition(this.position);
  }

  touchstart(event: TouchEvent): void {
    this._isDown = true;
    this._isActive = true;
    this._event = event;
    this._setPosition(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    this._manager.transformPosition(this.position);
  }

  touchmove(event: TouchEvent): void {
    this._isMove = true;
    this._isActive = true;
    this._event = event;
    this._setPosition(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    this._manager.transformPosition(this.position);
  }

  touchend(event: TouchEvent): void {
    this._isUp = true;
    this._isActive = true;
    this._event = event;
    this._setPosition(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
    this._manager.transformPosition(this.position);
  }

  private _setPosition(x: number, y: number) {
    this._position.x = x;
    this._position.y = y;
  }
}
