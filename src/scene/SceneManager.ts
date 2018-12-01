import { Game } from "../Game";
import { Scene } from "./Scene";
import { SceneStatus, System } from "./System";
import { IDisposable } from "../Utils";

export class SceneManager implements IDisposable {
  constructor(private _game: Game) {
    this._scenes = new Map();
    this._pendingStart = [];
    _game.events.once('boot', this.boot, this);
    _game.events.once('dispose', this.dispose, this);
  }

  private _scenes: Map<string, Scene>;
  private _pendingStart: Scene[];

  private _renderWidth: number;
  private _renderHeight: number;
  private _renderBackground: string;
  private _renderContext: CanvasRenderingContext2D;

  private boot() {
    this._renderWidth = this._game.config.width ? this._game.config.width : this._game.canvas.width;
    this._renderHeight = this._game.config.height ? this._game.config.height : this._game.canvas.height;
    this._renderBackground = this._game.config.background ? this._game.config.background : "#ffffff";
    this._renderContext = this._game.canvas.getContext('2d');

    let scenes = this._game.config.scenes;
    if (!Array.isArray(scenes)) {
      scenes = [scenes];
    }
    scenes.forEach((config) => {
      if (this._scenes.has(config.key)) {
        throw Error(`duplicate scene ${config.key}`);
      }
      let scene = new config.ctor(this._game, config.key)
      scene.sys.init(config.data);
      this._scenes.set(config.key, scene);
      if (config.autoStart) {
        this._pendingStart.push(scene);
      }
    });
    if (this._pendingStart.length === 0) {
      this._pendingStart.push(this._scenes.values().next().value);
    }
  }

  start(key: string, data: any) {
    let scene = this._scenes.get(key);
    if (!scene) {
      console.warn(`A scene with key ${key} doesn't exist`);
      return;
    }
    // stop the scene if it is running or paused
    if (scene.sys.status !== SceneStatus.PENDING) {
      scene.sys.stop();
    }
    scene.sys.start(data);
  }

  stop(key) {
    let scene = this._scenes.get(key);
    if (!scene) {
      console.warn(`A scene with key ${key} doesn't exist`);
      return;
    }
    if (scene.sys.status === SceneStatus.PENDING) {
      return;
    }
    scene.sys.stop();
  }

  pause(key) {
    let scene = this._scenes.get(key);
    if (!scene) {
      console.warn(`A scene with key ${key} doesn't exist`);
      return;
    }
    if (scene.sys.status !== SceneStatus.RUNNING) {
      return;
    }
    scene.sys.pause();
  }

  resume(key: string): void {
    let scene = this._scenes.get(key);
    if (!scene) {
      console.warn(`A scene with key ${key} doesn't exist`);
      return;
    }
    if (scene.sys.status !== SceneStatus.PAUSED) {
      console.debug(`Status of scene ${key} is not PAUSED, returning.`);
      return;
    }
    scene.sys.resume();
  }

  update(time, dt) {
    if (this._pendingStart.length !== 0) {
      this._pendingStart.splice(0).forEach(scene => {
        scene.sys.start();
      })
    }
    //TODO
    this._renderContext.fillStyle = this._renderBackground;
    this._renderContext.fillRect(0, 0, this._renderWidth, this._renderHeight);
    this._scenes.forEach((scene, key) => {
      if (scene.sys.status === SceneStatus.RUNNING) {
        scene.sys.update(time, dt);
      }
      if (scene.sys.status !== SceneStatus.PENDING) {
        scene.sys.render(this._renderContext);
      }
    });
  }

  dispose(): void {
    if (this._game === undefined) {
      return;
    }
    this._scenes.forEach(scene => scene.sys.dispose());
    this._scenes.clear();
    this._scenes = undefined;
    this._game = undefined;
  }
}
