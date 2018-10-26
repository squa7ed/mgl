import { EventEmitter } from "./EventEmitter";
import { Game } from "./Game";
import { DisplayObject } from "./displayobjects/DisplayObject";

export type Point = {
  x: number;
  y: number;
}

export class InputManager extends EventEmitter {
  constructor(private _game: Game) {
    super();
    // input handler
    this._inputHandler = undefined;
    // input enabled items.
    this._items = [];
    // input event queue
    this._eventQueue = [];
    _game.events.once('boot', this.boot, this);
  }

  private _inputHandler: (event) => any;

  private _items: Array<DisplayObject>;

  private _eventQueue: Array<MouseEvent>;

  boot(): void {
    let handler = event => {
      this._eventQueue.push(event);
    }
    this._inputHandler = handler.bind(this);
    this._game.canvas.addEventListener('mousedown', this._inputHandler);
    this._game.canvas.addEventListener('mousemove', this._inputHandler);
    this._game.canvas.addEventListener('mouseup', this._inputHandler);
    this._game.events.once('exit', this.dispose, this);
  }


  handlePointerEvent(event: MouseEvent): void {
    let pointer = this.translateCoordinates(event.clientX, event.clientY);
    let sprite = this._items.find(item => item.isMouseOver(pointer.x, pointer.y));
    if (sprite) {
      this.emit(event.type, sprite, pointer.x, pointer.y);
    }
  }

  translateCoordinates(x: number, y: number): Point {
    let rect = this._game.canvas.getBoundingClientRect();
    return { x: x - rect.left, y: y - rect.top };
  }

  enable(sprite: DisplayObject): DisplayObject {
    if (this._items.indexOf(sprite) === -1) {
      this._items.push(sprite);
    }
    return sprite;
  }

  update(time: number, dt: number): void {
    if (this._eventQueue.length === 0) {
      return;
    }
    let list = this._eventQueue.splice(0);
    list.forEach(event => {
      switch (event.type) {
        case 'mousedown':
        case 'mousemove':
        case 'mouseup':
          this.handlePointerEvent(event);
          break;
      }
    });
  }

  dispose(): void {
    if (this._game === undefined) {
      return;
    }
    this._game = undefined;
    this._items.length = 0;
    this._game.canvas.removeEventListener('mousedown', this._inputHandler);
    this._game.canvas.removeEventListener('mousemove', this._inputHandler);
    this._game.canvas.removeEventListener('mouseup', this._inputHandler);
    this.removeAllListeners();
  }
}