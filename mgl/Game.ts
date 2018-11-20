import { EventEmitter } from './EventEmitter';
import { InputManager } from './input/InputManager';
import { TextureManager } from './textures/TextureManager';
import { Scene } from './scene/Scene';
import { SoundManager } from './sound/SoundManager';
import { SceneManager } from './scene/SceneManager';

export type GameConfig = {
  scenes: (new (game: Game) => Scene)[];
}

export class Game {
  constructor(public readonly config: GameConfig) {
    this.events = new EventEmitter();

    this.canvas = this.setupCanvas();

    this._context = this.canvas.getContext('2d');

    this._bindLoop = this.loop.bind(this);

    this.input = new InputManager(this);

    this.scene = new SceneManager(this);

    this.textures = new TextureManager(this);

    this.sound = new SoundManager(this);

    this._lastUpdateTime = 0;

    this.events.emit('boot');
    this.start();
  }

  private _bindLoop: FrameRequestCallback;

  private _lastUpdateTime: number;

  private _deltaTime: number;

  private _currentScene: Scene;

  private _context: CanvasRenderingContext2D;

  get context() { return this._context; }

  readonly events: EventEmitter;

  readonly canvas: HTMLCanvasElement;

  readonly input: InputManager;

  readonly textures: TextureManager;

  readonly sound: SoundManager;

  readonly scene: SceneManager;

  setupCanvas(): HTMLCanvasElement {
    let canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 568;
    document.getElementById('container').appendChild(canvas);
    return canvas;
  }

  start(): void {
    this._lastUpdateTime = performance.now();
    this.startAnimation();
  }

  startAnimation(): number {
    return requestAnimationFrame(this._bindLoop);
  }

  loop(): void {
    this.update();
    this.startAnimation();
  }

  update(): void {
    let now = performance.now();
    this._deltaTime = now - this._lastUpdateTime;
    this.input.update(now, this._deltaTime);
    this.scene.update(now, this._deltaTime);
    this._lastUpdateTime = now;
  }
}