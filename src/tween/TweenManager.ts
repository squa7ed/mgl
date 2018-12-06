import { Tween, TweenState, TweenConfig } from './Tween';
import { Scene } from '../scene/Scene';

export default class TweenManager {
  constructor(private _scene: Scene) {
    this._tweens = [];
    this._pendingAdd = [];
    this._pendingRemove = [];
  }

  private _tweens: Tween[];

  private _pendingAdd: Tween[];

  private _pendingRemove: Tween[];

  add(config: TweenConfig) {
    let tween = new Tween(this, config);
    this._pendingAdd.push(tween);
    return this;
  }

  update(time: number, dt: number) {
    this._pendingRemove.push(...this._tweens.filter(tween => tween.state === TweenState.FINISHED));
    this._pendingRemove.forEach(tween => {
      let index = this._tweens.indexOf(tween);
      if (index !== -1) {
        this._tweens.splice(index, 1)[0].dispose();
      }
    });
    this._pendingRemove.length = 0;
    this._pendingAdd.forEach(tween => tween.state = TweenState.PLAYING);
    this._tweens.push(...this._pendingAdd);
    this._pendingAdd.length = 0;
    this._tweens.forEach(tween => {
      tween.update(time, dt);
    });
  }

  clear(): void {
    this._pendingAdd.splice(0).forEach(item => item.dispose());
    this._pendingRemove.splice(0).forEach(item => item.dispose());
    this._tweens.splice(0).forEach(item => item.dispose());
  }

  dispose(): any {
    if (!this._scene) {
      return;
    }
    this.clear();
    this._pendingAdd = undefined;
    this._pendingRemove = undefined;
    this._tweens = undefined;
    this._scene = undefined;
  }
}