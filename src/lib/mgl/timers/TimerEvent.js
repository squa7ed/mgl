import { GetValue } from '../Utils';

/**
 * @typedef {object} TimerEventConfig
 *
 * @property {number} [delay=0] - [description]
 * @property {function} [callback] - [description]
 * @property {*} [context] - [description]
 */

export default class TimerEvent {
  /**
   * 
   * @param {TimerEventConfig} config 
   */
  constructor(config) {
    this.config = config;
    this.delay = 0;
    this.callback = undefined;
    this.context = undefined;
    this.args = [];
    this.elapsed = 0;
    this.reset(config);
  }

  reset(config) {
    this.delay = GetValue(config, 'delay', 0);
    this.callback = GetValue(config, 'callback', undefined);
    this.context = GetValue(config, 'context', undefined);
    this.args = GetValue(config, 'args', []);
    this.elapsed = 0;
  }

  dispose() {
    this.callback = undefined;
    this.context = undefined;
  }

  get progress() { return this.elapsed / this.delay; }
}