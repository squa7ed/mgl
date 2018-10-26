import { EventEmitter } from "../EventEmitter";
import { InputManager } from "../InputManager";
import { Scene } from "../scene/Scene";

export abstract class DisplayObject extends EventEmitter {
  constructor(private _scene: Scene) {
    super();
    this._scene = _scene;
    // coordinate
    this._x = 0;
    this._y = 0;
    this._displayX = 0;
    this._displayY = 0;
    // size
    this._width = 0;
    this._height = 0;
    this._displayWidth = 0;
    this._displayHeight = 0;
    // origin
    this._originX = 0;
    this._originY = 0;
    // anchor
    this._anchorX = 0.5;
    this._anchorY = 0.5;
    // transform
    this._scaleX = 1;
    this._scaleY = 1;
    this._rotation = 0;
    this._opacity = 1;
    // visibility
    this._visible = true;
    // data
    this._data = new Map();
    // interaction
    this._input = undefined;
  }
  
  private _x: number;
  private _y: number;
  private _displayX: number;
  private _displayY: number;
  // size
  private _width: number;
  private _height: number;
  private _displayWidth: number;
  private _displayHeight: number;
  // origin
  private _originX: number;
  private _originY: number;
  // anchor
  private _anchorX: number;
  private _anchorY: number;
  // transform
  private _scaleX: number;
  private _scaleY: number;
  private _rotation: number;
  private _opacity: number;
  // visibility
  private _visible: boolean;
  // data
  private _data: Map<string, any>;
  // interaction
  private _input: InputManager;

   //#region  getters and setters
  get scene() { return this._scene; }
  // coordinate
  get x() { return this._x; }
  set x(value) { this._x = value; }

  get y() { return this._y; }
  set y(value) { this._y = value; }

  // size
  get width() { return this._width; }
  set width(value) {
    if (this._width === value) {
      return;
    }
    this._width = value;
    this._updateDisplayValues();
  }

  get height() { return this._height; }
  set height(value) {
    if (this._height === value) {
      return;
    }
    this._height = value;
    this._updateDisplayValues();
  }

  // display
  get displayX() { return this._displayX; }

  get displayY() { return this._displayY; }

  get displayWidth() { return this._displayWidth; }

  get displayHeight() { return this._displayHeight; }

  // origin
  get originX() { return this._originX; }
  set originX(value) {
    if (this._originX === value) {
      return;
    }
    this._originX = value;
    this._updateDisplayValues();
  }

  get originY() { return this._originY; }
  set originY(value) {
    if (this._originY === value) {
      return;
    }
    this._originY = value;
    this._updateDisplayValues();
  }

  // transform
  get scaleX() { return this._scaleX; }
  set scaleX(value) {
    if (this._scaleX === value) {
      return;
    }
    this._scaleX = value;
    this._updateDisplayValues();
  }

  get scaleY() { return this._scaleY; }
  set scaleY(value) {
    if (this._scaleY === value) {
      return;
    }
    this._scaleY = value;
    this._updateDisplayValues();
  }

  get rotation() { return this._rotation; }
  set rotation(value) { this._rotation = value % 360; }

  get opacity() { return this._opacity; }
  set opacity(value) {
    if (value >= 1) {
      this._opacity = 1;
    } else if (value <= 0) {
      this._opacity = 0;
    } else {
      this._opacity = value;
    }
  }
  // anchor
  get anchorX() { return this._anchorX; }
  set anchorX(value) {
    if (this._anchorX === value) {
      return;
    }
    this._anchorX = value;
    this._updateDisplayValues();
  }

  get anchorY() { return this._anchorY; }
  set anchorY(value) {
    if (this._anchorY === value) {
      return;
    }
    this._anchorY = value;
    this._updateDisplayValues();
  }

  get visible() { return this._visible && this.displayWidth !== 0 && this.displayHeight !== 0; }
  set visible(value) { this._visible = value; }

  get data() { return this._data; }

  get input() { return this._input; }

  //#endregion

  //#region public methods
  setOrigin(ox: number, oy: number) {
    if (ox === undefined) {
      ox = 0;
    }
    if (oy === undefined) {
      oy = ox;
    }
    this._originX = ox;
    this._originY = oy;
    this._updateDisplayValues();
    return this;
  }

  setScale(sx: number, sy: number) {
    if (sx === undefined) {
      sx = 1;
    }
    if (sy === undefined) {
      sy = sx;
    }
    this._scaleX = sx;
    this._scaleY = sy;
    this._updateDisplayValues();
    return this;
  }

  setAnchor(ax: number, ay: number) {
    if (ax === undefined) {
      ax = 0.5;
    }
    if (ay === undefined) {
      ay = ax;
    }
    this._anchorX = ax;
    this._anchorY = ay;
    this._updateDisplayValues();
    return this;
  }

  //eslint-disable-next-line no-unused-vars
  abstract render(context: CanvasRenderingContext2D): void;

  setInteractive() {
    this._scene.input.enable(this);
    return this;
  }

  isMouseOver(x: number, y: number) {
    return this.visible &&
      x > this.displayX &&
      x < this.displayX + this.displayWidth &&
      y > this.displayY &&
      y < this.displayY + this.displayHeight;
  }

  dispose() {
    if (!this.scene) {
      return;
    }
    this.data.clear();
    this._data = undefined;
    this._scene = undefined;
  }

  //#endregion

  //#region private methods
  _updateDisplayValues() {
    this._displayX = this.x + (1 - this.scaleX) * (this.width * this.anchorX) - this.scaleX * this.width * this.originX;
    this._displayY = this.y + (1 - this.scaleY) * (this.anchorY * this.height) - this.scaleY * this.height * this.originY;
    this._displayWidth = this.width * this.scaleX;;
    this._displayHeight = this.height * this.scaleY;
  }

  //#endregion

}