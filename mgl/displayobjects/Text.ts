import { DisplayObject } from "./DisplayObject";
import { GetValue } from "../Utils";
import { Scene } from "../scene/Scene";

export class Text extends DisplayObject {
  constructor(scene: Scene, x: number, y: number, text: string, style: TextStyleType) {
    super(scene);
    this.x = x;
    this.y = y;
    this._text = text;
    this._style = new TextStyle(this, style || {});
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

  set style(value) {
    this.style.update(value);
    this._measureTextSize();
  }

  private _measureTextSize(): void {
    if (undefined === this.style) {
      return;
    }
    //TODO update text width and height.
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

/**
 * Each property is pretty much slef-explanatory.
 */
export type TextStyleType = {
  color?: string;
  fontStyle?: string;
  fontWeight?: string;
  fontSize?: number;
  fontFamily?: string;
  font?: string;
};


export class TextStyle {
  constructor(private _text: Text, style: TextStyleType) {
    this.update(style);
  }

  private _color: string;

  private _fontStyle: string;

  private _fontWeight: string;

  private _fontSize: number;

  private _fontFamily: string;

  private _font: string;

  get color() { return this._color; }

  get fontSize() { return this._fontSize; }

  get font() { return this._font; }

  update(style: TextStyleType): void {
    this._color = GetValue(style, 'color', '#000000');
    this._fontStyle = GetValue(style, 'fontStyle', 'normal');
    this._fontWeight = GetValue(style, 'fontWeight', 'normal');
    this._fontSize = GetValue(style, 'fontSize', 16);
    this._fontFamily = GetValue(style, 'fontFamily', 'sans-serif');

    if (style.font) {
      let font = style.font;
      if (font.includes('italic') || font.includes('oblique')) {
        this._fontStyle = 'italic';
      }
      if (font.includes('bold')) {
        this._fontWeight = 'bold';
      }
      let fontSize = font.match(/[\d]+/);
      this._fontSize = fontSize ? parseInt(fontSize[0]) : 16;
      this._fontFamily = font.split(' ').splice(-1)[0];
    }
    this._font = [this._fontStyle, this._fontWeight, this._fontSize + 'pt', this._fontFamily].join(' ');
  }
}