import DisplayObject from "./DisplayObject";

export default class Sprite extends DisplayObject {
  constructor(scene, x, y, textureKey) {
    super(scene);
    this.x = x || 0;
    this.y = y || 0;
    // texture
    this.texture = scene.textures.get(textureKey);
    // size
    this.width = this.texture.width || 0;
    this.height = this.texture.height || 0;
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  render(context) {
    if (!this.visible) {
      return;
    }
    let alpha = context.globalAlpha;
    context.globalAlpha = this.opacity;
    context.translate(this.x + this.width * this.anchorX, this.y + this.height * this.anchorY);
    context.scale(this.scaleX, this.scaleY);
    context.rotate(this.rotation * Math.PI / 180);
    context.translate(-(this.x + this.width * this.anchorX), -(this.y + this.height * this.anchorY));
    context.translate(-this.width * this.originX, -this.height * this.originY);
    context.drawImage(this.texture.source, this.x, this.y, this.width, this.height);
    context.globalAlpha = alpha;
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
}