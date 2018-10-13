import EventEmitter from './EventEmitter';
import InputManager from './InputManager';
import { TextureManager } from './textures';

export default class Game {
  constructor() {
    this.events = new EventEmitter();
    this.canvas = undefined;
    this.context = undefined;

    this.isStarted = false;

    this.bindLoop = this.loop.bind(this);
    this.input = new InputManager(this);
    this.textures = new TextureManager(this);

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

  start(scene) {
    if (scene === undefined) {
      return;
    }
    if (this.isStarted) {
      return;
    }
    console.debug('starting game.');
    this._lastTime = performance.now();
    scene.preload();
    if (scene.load.pending !== 0) {
      scene.once('load', scene.create, scene);
    } else {
      scene.create();
    }
    this.scene = scene;
    this.startAnimation();
    console.debug(this);
  }

  startAnimation() {
    requestAnimationFrame(this.bindLoop);
  }

  loop() {
    this.update();
    this.render();
    this.startAnimation();
  }

  update() {
    let now = performance.now();
    this._dt = now - this._lastTime;
    this.scene.update(now, this._dt);
    this.scene.timer.update(now, this._dt);
    this.input.update(now, this._dt);
    this._lastTime = now;
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.scene.displayList.render(this.context);
    this.scene.render(this.context);
  }
}