import { MouseManager } from './MouseManager';
import { Pointer, Point } from './Pointer';
import { TouchManager } from './TouchManager';
import { Game } from '../Game';
import { IDisposable } from '../Utils';

let eventTypes = {
  mousedown: 0,
  mousemove: 1,
  mouseup: 2,
  touchstart: 3,
  touchmove: 4,
  touchend: 5
};

export class InputManager implements IDisposable {
  constructor(private _game: Game) {
    this._touch = new TouchManager(this);
    this._mouse = new MouseManager(this);
    this._pointer = new Pointer(this);

    this._pendingAdd = [];
    this._eventQueue = [];
    _game.events.once('boot', this.boot, this);
    _game.events.once('dispose', this.dispose, this);
  }

  private _touch: TouchManager;

  private _mouse: MouseManager;

  private _pointer: Pointer;

  private _eventQueue: Event[];

  private _pendingAdd: Event[];

  private _canvas: HTMLCanvasElement;

  get game() { return this._game; }

  get pointer() { return this._pointer; }

  get canvas() { return this._canvas; }

  boot(): void {
    this._canvas = this._game.canvas;
    this._touch.boot();
    this._mouse.boot();
  }

  queueEvent(event: PointerEvent): void {
    this._pendingAdd.push(event);
  }

  update(time: number, dt: number): void {
    this._pointer.reset();
    this._processEventQueue();
    if (this._eventQueue.length === 0) {
      return;
    }
    let queue = this._eventQueue.splice(0);
    queue.forEach(event => {
      switch (eventTypes[event.type]) {
        case eventTypes.mousedown:
          this._pointer.mousedown(<MouseEvent>event);
          break;
        case eventTypes.mousemove:
          this._pointer.mousemove(<MouseEvent>event);
          break;
        case eventTypes.mouseup:
          this._pointer.mouseup(<MouseEvent>event);
          break;
        case eventTypes.touchstart:
          this._pointer.touchstart(<TouchEvent>event);
          break;
        case eventTypes.touchmove:
          this._pointer.touchmove(<TouchEvent>event);
          break;
        case eventTypes.touchend:
          this._pointer.touchend(<TouchEvent>event);
          break;
      }
    });
  }

  transformPosition(position: Point): void {
    let bounds = this._canvas.getBoundingClientRect();
    position.x -= bounds.left;
    position.y -= bounds.top;
  }

  dispose(): void {
    if (!this._game) {
      return;
    }
    this._touch.dispose();
    this._mouse.dispose();
    this._pointer.dispose();
    this._touch = undefined;
    this._mouse = undefined;
    this._pointer = undefined;
    this._game = undefined;
  }

  private _processEventQueue(): void {
    this._eventQueue.push(...this._pendingAdd.splice(0));
  }
}
