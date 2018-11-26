import { DisplayObject } from "./DisplayObject";
import { Scene } from "../scene/Scene";
import { Texture } from "../textures/Texture";

export class Sprite extends DisplayObject {
  constructor(scene: Scene, x: number, y: number, private _textureKey: string) {
    super(scene);
    this.x = x || 0;
    this.y = y || 0;
    this.setTexture(_textureKey);
  }

  private _texture: Texture;

  setTexture(key: string): void {
    this._texture = this.scene.textures.get(key);
    // size
    this.width = this._texture.width || 0;
    this.height = this._texture.height || 0;
  }

  render(context: CanvasRenderingContext2D): void {
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
    context.drawImage(this._texture.source, this.x, this.y, this.width, this.height);
    // context.strokeRect(this.x, this.y, this.width, this.height);
    context.globalAlpha = alpha;
    context.setTransform(1, 0, 0, 1, 0, 0);
  }
}