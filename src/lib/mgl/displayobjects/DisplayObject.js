import EventEmitter from "../EventEmitter";

export default class DisplayObject extends EventEmitter {

  constructor(game, type) {
    super();
    this.game = game;
    this.type = type;
    this.x = 0;
    this.y = 0;
    this.width = 16;
    this.height = 16;
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  render(context) { }

  isMouseOver(x, y) {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }
}