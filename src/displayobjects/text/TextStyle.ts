import { GetValue, IDisposable } from "../../Utils";
import { Text } from "./Text";
import { EventEmitter } from "../../EventEmitter";
/**
 * Each property is pretty much slef-explanatory.
 */
export type TextStyleType = {
  color?: string;
  fontStyle?: 'normal' | 'italic';
  fontWeight?: 'normal' | 'bold';
  fontSize?: number;
  fontFamily?: string;
  font?: string;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
};

const fontStyleValues = {
  normal: 'normal',
  italic: 'italic'
};

const fontWeightValues = {
  normal: 'normal',
  bold: 'bold'
};

const alignValues = {
  left: 'left',
  center: 'center',
  right: 'right'
}

const baselineValues = {
  top: 'top',
  middle: 'middle',
  bottom: 'bottom'
}

export class TextStyle extends EventEmitter implements IDisposable {
  constructor(private _text: Text, style: TextStyleType) {
    super();
    this._color = GetValue(style, 'color', '#000000');
    this._fontStyle = GetValue(style, 'fontStyle', fontStyleValues.normal);
    this._fontWeight = GetValue(style, 'fontWeight', fontWeightValues.normal);
    this._fontSize = GetValue(style, 'fontSize', 16);
    this._fontFamily = GetValue(style, 'fontFamily', 'sans-serif');
    this._align = GetValue(style, 'align', alignValues.left);
    this._baseline = GetValue(style, 'baseline', baselineValues.top);

    if (style.font) {
      let font = style.font;
      if (font.includes('italic') || font.includes('oblique')) {
        this._fontStyle = fontStyleValues.italic;
      }
      if (font.includes('bold')) {
        this._fontWeight = fontWeightValues.bold;
      }
      let fontSize = font.match(/[\d]+/);
      this._fontSize = fontSize ? parseInt(fontSize[0]) : 16;
      this._fontFamily = font.split(' ').splice(-1)[0];
    }
    this._font = [this._fontStyle, this._fontWeight, this._fontSize + 'pt', this._fontFamily].join(' ');
  }

  private _color: string;

  private _fontStyle: string;

  private _fontWeight: string;

  private _fontSize: number;

  private _fontFamily: string;

  private _font: string;

  private _align: CanvasTextAlign;

  private _baseline: CanvasTextBaseline;

  get color() { return this._color; }

  set color(value) {
    if (value === this._color) {
      return;
    }
    this._color = value;
    this._text.emit('styleChanged', 'color', value);
  }

  get fontStyle() { return this._fontStyle; }

  set fontStyle(value) {
    if (value === this._fontStyle || !fontStyleValues[value]) {
      return;
    }
    this._fontStyle = fontStyleValues[value];
    this._font = [this._fontStyle, this._fontWeight, this._fontSize + 'pt', this._fontFamily].join(' ');
    this._text.emit('styleChanged', 'fontStyle', value);
  }

  get fontWeight() { return this._fontWeight; }

  set fontWeight(value) {
    if (value === this._fontWeight || !fontWeightValues[value]) {
      return;
    }
    this._fontWeight = fontWeightValues[value];
    this._font = [this._fontStyle, this._fontWeight, this._fontSize + 'pt', this._fontFamily].join(' ');
    this._text.emit('styleChanged', 'fontWeight', value);
  }

  get fontSize() { return this._fontSize; }

  set fontSize(value) {
    if (value === this._fontSize) {
      return;
    }
    this._fontSize = value;
    this._font = [this._fontStyle, this._fontWeight, this._fontSize + 'pt', this._fontFamily].join(' ');
    this._text.emit('styleChanged', 'fontSize', value);
  }

  get fontFamily() { return this._fontFamily; }

  set fontFamily(value) {
    if (value === this._fontFamily) {
      return;
    }
    this._fontFamily = value;
    this._font = [this._fontStyle, this._fontWeight, this._fontSize + 'pt', this._fontFamily].join(' ');
    this._text.emit('styleChanged', 'fontFamily', value);
  }

  get align() { return this._align; }

  set align(value) {
    if (value === this._align || !alignValues[value]) {
      return;
    }
    this._align = alignValues[value];
    this._text.emit('styleChanged', 'align', alignValues[value]);
  }

  get baseline() { return this._baseline; }

  set baseline(value) {
    if (value === this._baseline || !baselineValues[value]) {
      return;
    }
    this._baseline = baselineValues[value];
    this._text.emit('styleChanged', 'baseline', alignValues[value]);
  }

  get font() { return this._font; }

  dispose(): void {
    this._text = undefined;
  }
}