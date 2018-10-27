import { EventEmitter } from './EventEmitter';
import { InputManager } from './input/InputManager';
import { TextureManager } from './textures/TextureManager';
import { Scene } from './scene/Scene';

export class Game {
  constructor() {
    this.events = new EventEmitter();

    this.canvas = this.setupCanvas();

    this._context = this.canvas.getContext('2d');

    this._isStarted = false;

    this._bindLoop = this.loop.bind(this);

    this.input = new InputManager(this);

    this.textures = new TextureManager(this);

    this._lastUpdateTime = 0;
    this._deltaTime = 0;

    this.events.emit('boot');
  }
  
  private _isStarted: boolean;

  private _bindLoop: FrameRequestCallback;

  private _lastUpdateTime: number;

  private _deltaTime: number;

  private _currentScene: Scene;

  private _context: CanvasRenderingContext2D;

  readonly events: EventEmitter;

  readonly canvas: HTMLCanvasElement;

  readonly input: InputManager;

  readonly textures: TextureManager;

  setupCanvas(): HTMLCanvasElement {
    let canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 568;
    document.getElementById('container').appendChild(canvas);
    return canvas;
  }

  start(scene: Scene): void {
    if (scene === undefined) {
      return;
    }
    if (this._isStarted) {
      return;
    }
    this._lastUpdateTime = performance.now();
    scene.onLoad();
    if (scene.load.pending !== 0) {
      scene.events.once('load', scene.onCreate, scene);
    } else {
      scene.onCreate();
    }
    this._currentScene = scene;
    this.startAnimation();
  }

  startAnimation(): number {
    return requestAnimationFrame(this._bindLoop);
  }

  loop(): void {
    this.update();
    this.render();
    this.startAnimation();
  }

  update(): void {
    let now = performance.now();
    this._deltaTime = now - this._lastUpdateTime;
    this.input.update(now, this._deltaTime);
    this._currentScene.update(now, this._deltaTime);
    this._lastUpdateTime = now;
  }

  render(): void {
    this._context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._currentScene.displayList.render(this._context);
  }
}