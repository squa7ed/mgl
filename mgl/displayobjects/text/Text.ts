import { DisplayObject } from "../DisplayObject";
import { Scene } from "../../scene/Scene";
import { TextStyleType, TextStyle } from "./TextStyle";

export class Text extends DisplayObject {
  constructor(scene: Scene, x: number, y: number, text: string, style: TextStyleType) {
    super(scene);
    this.x = x;
    this.y = y;
    this._text = text;
    this._style = new TextStyle(this, style || {});
    this.on('styleChanged', this._measureTextSize, this);
    this._measureTextSize();
  }

  private _text: string;

  private _style: TextStyle;

  get text() { return this._text; }

  set text(value) {
    if (value === this._text) {
      return;
    }
    this._text = value;
    this._measureTextSize();
  }

  get style() { return this._style; }

  private _measureTextSize(): void {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    context.font = this.style.font;
    this.width = context.measureText(this._text).width;
    this.height = context.measureText('MI').width;
  }

  render(context: CanvasRenderingContext2D): void {
    if (!this.visible) {
      return;
    }
    let alpha = context.globalAlpha;
    let fillStyle = context.fillStyle;
    let font = context.font;
    context.globalAlpha = this.opacity;
    context.fillStyle = this.style.color;
    context.font = this.style.font;
    context.textAlign = "left";
    context.textBaseline = "top";
    context.translate(this.x + this.width * this.anchorX, this.y + this.height * this.anchorY);
    context.scale(this.scaleX, this.scaleY);
    context.rotate(this.rotation * Math.PI / 180);
    context.translate(-(this.x + this.width * this.anchorX), -(this.y + this.height * this.anchorY));
    context.translate(-this.width * this.originX, -this.height * this.originY);
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.fillText(this.text, this.x, this.y);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalAlpha = alpha;
    context.fillStyle = fillStyle;
    context.font = font;
  }

}