import { GetValue, IDisposable, noop } from '../Utils';
import TweenManager from './TweenManager';
import { DisplayObject } from '../displayobjects/DisplayObject';

export enum TweenState {
  PENDING,
  PLAYING,
  PLAYINGBACKWARD,
  FINISHED
};

const Ease = {
  sine: progress => Math.sin(progress * Math.PI / 2),
  linear: progress => progress,
  power2: progress => progress * progress,
  power3: progress => progress * progress * progress
};

export type TweenConfig = {
  target: DisplayObject | DisplayObject[];
  props: object;
  duration?: number;
  delay?: number;
  ease?: string;
  autoReverse?: boolean;
  onUpdate?: (targets: any[]) => void;
  onReverse?: (targets: any[]) => void;
  onFinish?: (targets: any[]) => void;
}

type TweenData = {
  target: DisplayObject;
  key: string;
  from: number;
  to: number;
}

export class Tween implements IDisposable {
  constructor(private _manager: TweenManager, config: TweenConfig) {
    // tween props
    this._duration = GetValue(config, 'duration', 500);
    this._delay = GetValue(config, 'delay', 0);
    this._ease = GetValue(config, 'ease', 'sine');
    if (Ease[this._ease] === undefined) {
      this._ease = 'sine';
    }
    this._autoReverse = GetValue(config, 'autoReverse', false);
    this._onUpdate = GetValue(config, 'onUpdate', noop);
    this._onReverse = GetValue(config, 'onReverse', noop);
    this._onFinish = GetValue(config, 'onFinish', noop);
    // tween params
    this._elapsed = 0;
    this._totalElapsed = 0;
    this._totalDuration = this._calculateTotalDuration();
    this.state = TweenState.PENDING;
    this._data = this._buildTweenData(config);
  }

  private _targets: DisplayObject[];

  private _elapsed: number;

  private _duration: number;

  private _delay: number;

  private _ease: string;

  private _autoReverse: boolean;

  private _onUpdate: (targets: any[]) => void;

  private _onReverse: (targets: any[]) => void;

  private _onFinish: (targets: any[]) => void;

  private _totalElapsed: number;

  private _totalDuration: number;

  private _data: TweenData[];

  state: TweenState;

  update(time: number, dt: number) {
    if (this._totalElapsed >= this._totalDuration) {
      this._data.forEach(data => {
        data.target[data.key] = data.to;
      });
      this._onUpdate(this._targets);
      this._onFinish(this._targets);
      this.state = TweenState.FINISHED;
      return;
    }
    if (this._totalElapsed < this._delay) {
      this._totalElapsed += dt;
      return;
    }
    if (this._autoReverse) {
      if (this.state !== TweenState.PLAYINGBACKWARD && this._elapsed >= this._duration) {
        this.state = TweenState.PLAYINGBACKWARD;
        this._elapsed = 0;
        let tmp;
        this._data.forEach(data => {
          data.target[data.key] = data.to;
          tmp = data.from;
          data.from = data.to;
          data.to = tmp;
        });
        this._onReverse(this._targets);
        return;
      }
    }
    let progress = Math.min(this._elapsed / this._duration, 1);
    this._data.forEach(data => {
      let value = data.from + (data.to - data.from) * Ease[this._ease](progress);
      data.target[data.key] = value;
    });
    this._onUpdate(this._targets);
    this._elapsed += dt;
    this._totalElapsed += dt;
  }

  stop() {
    this._totalElapsed = this._totalDuration;
  }

  private _calculateTotalDuration() {
    let duration = this._duration;
    if (this._autoReverse) {
      duration *= 2;
    }
    return duration + this._delay;
  }

  private _buildTweenData(config: TweenConfig) {
    let targets = GetValue(config, 'target', undefined);
    if (targets === undefined) {
      throw Error('null argument, target');
    }
    if (!Array.isArray(targets)) {
      targets = [targets];
    }
    this._targets = targets;
    let data = [];
    targets.forEach(target => {
      let props = GetValue(config, 'props', undefined);
      if (props === undefined) {
        throw Error('null argument, props');
      }
      Object.keys(props).forEach(key => {
        let tweenData = { target, key };
        tweenData['from'] = GetValue(props[key], 'from', target[key]);
        tweenData['to'] = GetValue(props[key], 'to', target[key]);
        data.push(tweenData);
      });
    });
    return data;
  }

  dispose(): void {
    this._data.splice(0).forEach(item => item.target = undefined);
    this._data = undefined;
    this._manager = undefined;
  }
}