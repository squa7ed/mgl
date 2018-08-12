import EventEmitter from "./EventEmitter";
import Game from "./Game";

export default class InputManager extends EventEmitter {
  /**
   * 
   * @param {Game} game 
   */
  constructor(game) {
    super();
    this.game = game;
    // input handler
    this.inputHandler = undefined;
    // input enabled items.
    this._items = [];
    // input event queue
    this._queue = [];
    game.once('boot', this.boot, this);
    game.once('exit', this.dispose, this);
  }

  boot() {
    let handler = event => {
      this._queue.push(event);
    }
    this.inputHandler = handler.bind(this);
    this.game.canvas.addEventListener('mousedown', this.inputHandler);
    this.game.canvas.addEventListener('mousemove', this.inputHandler);
    this.game.canvas.addEventListener('mouseup', this.inputHandler);
  }

  dispose() {
    this.game = undefined;
    this._items.length = 0;
    this.game.canvas.removeEventListener('mousedown', this.inputHandler);
    this.game.canvas.removeEventListener('mousemove', this.inputHandler);
    this.game.canvas.removeEventListener('mouseup', this.inputHandler);
    super.dispose();
  }

  update() {
    if (this._queue.length === 0) {
      return;
    }
    let list = this._queue.splice(0);
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

  /**
  * 
  * @param {MouseEvent} event 
  */
  handlePointerEvent(event) {
    let pointer = this.translateCoordinates(event.clientX, event.clientY);
    let sprite = this._items.find(item => item.isMouseOver(pointer.x, pointer.y));
    if (sprite) {
      this.emit(event.type, sprite, pointer.x, pointer.y);
    }
  }

  translateCoordinates(x, y) {
    let rect = this.game.canvas.getBoundingClientRect();
    return { x: x - rect.left, y: y - rect.top };
  }

  enable(sprite) {
    if (this._items.indexOf(sprite) === -1) {
      this._items.push(sprite);
    }
    return sprite;
  }

}