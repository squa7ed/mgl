import { EventEmitter } from "../EventEmitter";
import { DisplayList } from '../displayobjects/DisplayList';
import { Loader } from '../Loader';
import { InputPlugin } from "../input/InputPlugin";
import { Game } from "../Game";
import { TextureManager } from "../textures/TextureManager";
import { DisplayObjectFactory } from "../displayobjects/DisplayObjectFactory";
import { Timer } from "../timers/Timer";
import TweenManager from "../tween/TweenManager";
import { SoundManager } from "../sound/SoundManager";
import { System } from "./System";

export abstract class Scene {
  constructor(private _game: Game) {
    this._displayList = new DisplayList(this);
    this._events = new EventEmitter();
    this._timer = new Timer(this);
    this._textures = _game.textures;
    this._sound = _game.sound;
    this._add = new DisplayObjectFactory(this);
    this._input = new InputPlugin(this);
    this._tweens = new TweenManager(this);
    this._load = new Loader(this);
    this._sys = new System(this);
  }

  private _displayList: DisplayList;

  private _events: EventEmitter;

  private _input: InputPlugin;

  private _timer: Timer;

  private _textures: TextureManager;

  private _sound: SoundManager;

  private _load: Loader;

  private _add: DisplayObjectFactory;

  private _tweens: TweenManager;

  private _sys: System;

  get game() { return this._game; }

  get displayList() { return this._displayList; }

  get events() { return this._events; }

  get input() { return this._input; }

  get timer() { return this._timer; }

  get textures() { return this._textures; }

  get sound() { return this._sound; }

  get tweens() { return this._tweens; }

  get load() { return this._load; }

  get add() { return this._add; }

  get sys() { return this._sys; }

  abstract onLoad(): void;

  abstract onCreate(): void;

  abstract onUpdate(time: number, dt: number): void;
}