/**
 * Simple sprite object, we use colored rectangles at this moment.
 */
export default class Sprite {
  constructor(game, x, y, color, width, height) {
    this.game = game;
    this.x = x || 0;
    this.y = y || 0;
    // size
    this.width = width || 0;
    this.height = height || 0;
    // color
    this.color = color || '#ff0000'
    this.data = new Map();
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  render(context) {
    const color = context.fillStyle;
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillStyle = color;
  }

  isMouseOver(x, y) {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

}