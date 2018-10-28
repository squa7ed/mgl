import { GetValue } from '../Utils';
import TweenManager from './TweenManager';
import { DisplayObject } from '../displayobjects/DisplayObject';

export enum TweenState { PLAYING, FINISHED };

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
}

type TweenData = {
  target: DisplayObject;
  key: string;
  from: number;
  to: number;
}

export class Tween {
  constructor(private _manager: TweenManager, config: TweenConfig) {
    // tween props
    this._duration = GetValue(config, 'duration', 500);
    this._delay = GetValue(config, 'delay', 0);
    this._ease = GetValue(config, 'ease', 'sine');
    if (Ease[this._ease] === undefined) {
      this._ease = 'sine';
    }
    // tween params
    this._elapsed = 0;
    this._totalElapsed = 0;
    this._totalDuration = this._calculateTotalDuration();
    this._state = TweenState.PLAYING;
    this._data = this._buildTweenData(config);
  }

  private _elapsed: number;

  private _duration: number;

  private _delay: number;

  private _ease: string;

  private _totalElapsed: number;

  private _totalDuration: number;

  private _state: TweenState;

  private _data: TweenData[];

  get state() { return this._state; }

  update(time: number, dt: number) {
    if (this._totalElapsed < this._delay) {
      this._totalElapsed += dt;
      return;
    }
    let progress = Math.min(this._elapsed / this._duration, 1);
    this._data.forEach(data => {
      let value = data.from + (data.to - data.from) * Ease[this._ease](progress);
      data.target[data.key] = value;
    });
    this._elapsed += dt;
    this._totalElapsed += dt;
    if (this._totalElapsed >= this._totalDuration) {
      this._data.forEach(data => {
        data.target[data.key] = data.to;
      });
      this._state = TweenState.FINISHED;
    }
  }

  stop() {
    this._totalElapsed = this._totalDuration;
  }

  private _calculateTotalDuration() {
    return this._duration + this._delay;
  }

  private _buildTweenData(config: TweenConfig) {
    let targets = GetValue(config, 'target', undefined);
    if (targets === undefined) {
      throw Error('null argument, target');
    }
    if (!Array.isArray(targets)) {
      targets = [targets];
    }
    let data = [];
    targets.forEach(target => {
      let props = GetValue(config, 'props', undefined);
      if (props === undefined) {
        throw Error('null argument, props');
      }
      Object.keys(props).forEach(key => {
        let tweenData = { target, key };
        tweenData['from'] = GetValue(props[key], 'from', 0);
        tweenData['to'] = GetValue(props[key], 'to', 1);
        target[key] = tweenData['from'];
        data.push(tweenData);
      });
    });
    return data;
  }
}