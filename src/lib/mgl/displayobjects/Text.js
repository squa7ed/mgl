import DisplayObject from "./DisplayObject";
import { GetValue } from "../Utils";

export default class Text extends DisplayObject {
  constructor(scene, x, y, text, style) {
    super(scene);
    this.x = x;
    this.y = y;
    this.text = text;
    this.style = style;
  }

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
    if (this._style === undefined) {
      this._style = {};
    }
    if (value === undefined) {
      value = {};
    }
    this.style.color = GetValue(value, 'color', '#000000');
    this.style.fontStyle = GetValue(value, 'fontStyle', 'normal');
    this.style.fontWeight = GetValue(value, 'fontWeight', 'normal');
    this.style.fontSize = GetValue(value, 'fontSize', 16);
    this.style.fontFamily = GetValue(value, 'fontFamily', 'sans-serif');

    if (value.hasOwnProperty('font')) {
      let font = value.font;
      if (font.includes('italic') || font.includes('oblique')) {
        this.style.fontStyle = 'italic';
      }
      if (font.includes('bold')) {
        this.style.fontWeight = 'bold';
      }
      let fontSize = font.match(/[\d]+/);
      this.style.fontSize = fontSize ? parseInt(fontSize[0]) : 16;
      this.style.fontFamily = font.split(' ').splice(-1)[0];
    }
    this.style.font = [this.style.fontStyle, this.style.fontWeight, this.style.fontSize + 'pt', this.style.fontFamily].join(' ');
    this._measureTextSize();
  }

  _measureTextSize() {
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

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  render(context) {
    if (!this.visible) {
      return;
    }
    let alpha = context.globalAlpha;
    let fillStyle = context.fillStyle;
    let font = context.font;
    context.globalAlpha = this.opacity;
    context.fillStyle = this.style.color;
    context.font = this.style.font;
    context.translate(this.x + this.width * this.anchorX, this.y + this.height * this.anchorY);
    context.scale(this.scaleX, this.scaleY);
    context.rotate(this.rotation * Math.PI / 180);
    context.translate(-(this.x + this.width * this.anchorX), -(this.y + this.height * this.anchorY));
    context.translate(-this.width * this.originX, -this.height * this.originY);
    context.fillText(this.text, this.x, this.y);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalAlpha = alpha;
    context.fillStyle = fillStyle;
    context.font = font;
  }

}