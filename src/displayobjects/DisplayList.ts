import { DisplayObject } from './DisplayObject';
import { Scene } from '../scene/Scene';
import { IDisposable } from '../Utils';

export class DisplayList implements IDisposable {
  constructor(private _scene: Scene) {
    this._items = [];
    _scene.events.once('dispose', this.dispose, this);
  }

  private _items: DisplayObject[];

  get items() { return this._items; }

  add(item: DisplayObject): void {
    if (this._items.indexOf(item) === -1) {
      this._items.push(item);
    }
  }

  remove(item: DisplayObject, destroy: boolean) {
    let index = this.getIndexOf(item);
    if (index !== -1) {
      let item = this._items.splice(index, 1)[0];
      if (destroy) {
        item.dispose();
      }
    }
  }

  render(context: CanvasRenderingContext2D): void {
    this._items.forEach(sprite => sprite.render(context));
  }

  getIndexOf(item: DisplayObject) {
    return this._items.indexOf(item);
  }

  clear(): void {
    this._items.forEach(item => {
      item.dispose();
    });
    this._items.length = 0;
  }

  dispose(): void {
    if (!this._scene) {
      return;
    }
    this.clear();
    this._scene = undefined;
  }
}