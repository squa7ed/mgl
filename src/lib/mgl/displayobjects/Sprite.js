import Game from "../Game";

export default class Sprite {
  /**
   * 
   * @param {Game} game 
   * @param {number} x 
   * @param {number} y 
   * @param {string} textureKey 
   * @param {number} width 
   * @param {number} height 
   */
  constructor(game, x, y, textureKey, width, height) {
    this.game = game;
    this.x = x || 0;
    this.y = y || 0;
    // texture
    this.texture = game.textures.get(textureKey);
    // size
    this.width = width || this.texture.width;
    this.height = height || this.texture.height;
    this.data = new Map();
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  render(context) {
    context.drawImage(this.texture.source, this.x, this.y, this.width, this.height);
  }

  isMouseOver(x, y) {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

}