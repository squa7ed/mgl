import DisplayObject from "./DisplayObject";
import { GetValue } from "../Utils";

export default class Text extends DisplayObject {
  constructor(game, x, y, text, style) {
    super(game, 'Text');
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
    //TODO update text width and height.
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  render(context) {
    context.save();
    context.fillStyle = this.style.color;
    context.font = this.style.font;
    context.fillText(this.text, this.x, this.y);
    context.restore();
  }

}