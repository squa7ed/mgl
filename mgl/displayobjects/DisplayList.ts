import { DisplayObject } from './DisplayObject';
import { Scene } from '../scene/Scene';

export class DisplayList {
  constructor(public readonly scene: Scene) {
    this._items = [];
  }

  private _items: DisplayObject[];

  add(item: DisplayObject): void {
    if (this._items.indexOf(item) === -1) {
      this._items.push(item);
    }
  }

  render(context: CanvasRenderingContext2D): void {
    this._items.forEach(sprite => sprite.render(context));
  }
}