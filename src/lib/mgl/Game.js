import Sprite from './Sprite';
import InputManager from './InputManager';
import Timer from './Timer';
import TextureManager from './TextureManager';
import Loader from './Loader';
import EventEmitter from './EventEmitter';
import DisplayList from './DisplayList';
import SpriteFactory from './SpriteFactory';

export default class Game {
  constructor() {
    this.events = new EventEmitter();
    this.canvas = undefined;
    this.context = undefined;

    this.isStarted = false;

    this.bindLoop = this.loop.bind(this);

    this.displayList = new DisplayList(this);
    this.input = new InputManager(this);
    this.timer = new Timer(this);
    this.textures = new TextureManager(this);
    this.load = new Loader(this);
    this.add = new SpriteFactory(this);

    this._lastTime = 0;
    this._dt = 0;

    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 320;
    this.canvas.height = 568;
    document.getElementById('container').appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.events.emit('boot');
  }

  start() {
    if (!this.isStarted) {
      console.debug('starting game.');
      this._lastTime = performance.now();
      this.startAnimation();
      this.preload();
      if (this.load.pending !== 0) {
        this.load.once('load', this.create, this);
      } else {
      }
    }
    console.debug(this);
  }

  startAnimation() {
    requestAnimationFrame(this.bindLoop);
  }

  preload() { }

  create() { }

  loop() {
    this.update();
    this.render();
    this.startAnimation();
  }

  update() {
    let now = performance.now();
    this._dt = now - this._lastTime;
    this.input.update(now, this._dt);
    this.timer.update(now, this._dt);
    this._lastTime = now;
  }

  render() {
    this.displayList.render(this.context);
  }
}