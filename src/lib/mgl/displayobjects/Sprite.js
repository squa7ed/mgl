import Game from "../Game";
import DisplayObject from "./DisplayObject";

export default class Sprite extends DisplayObject {
  /**
   * 
   * @param {Game} game 
   * @param {number} x 
   * @param {number} y 
   * @param {string} textureKey 
   * @param {number} width 
   * @param {number} height 
   */
  constructor(game, x, y, textureKey) {
    super(game, 'Sprite');
    this.x = x || 0;
    this.y = y || 0;
    // texture
    this.texture = game.textures.get(textureKey);
    // size
    this.width = this.texture.width || 0;
    this.height = this.texture.height || 0;
    this.data = new Map();
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  render(context) {
    context.drawImage(this.texture.source, this.x, this.y, this.width, this.height);
  }
}