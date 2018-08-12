import Sprite from './Sprite';
import EventEmitter from "./EventEmitter";
import InputManager from './InputManager';

export default class Game extends EventEmitter {
  constructor() {
    super();
    this.canvas = undefined;
    this.context = undefined;

    this.isStarted = false;

    this.bindLoop = this.loop.bind(this);

    this.displayList = [];
    this.input = new InputManager(this);

    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 320;
    this.canvas.height = 568;
    document.getElementById('container').appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.emit('boot');
  }

  start() {
    if (!this.isStarted) {
      console.debug('starting game.');
      this.startAnimation();
      this.create();
    }
  }

  startAnimation() {
    requestAnimationFrame(this.bindLoop);
  }

  create() { }

  loop() {
    this.update();
    this.render();
    this.startAnimation();
  }

  update() {
    this.input.update();
   }

  render() {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.displayList.forEach(sprite => sprite.render(this.context));
  }


  addSprite(x, y, color, width, height) {
    let sprite = new Sprite(this, x, y, color, width, height);
    this.displayList.push(sprite);
    return sprite;
  }

  enabelInput(sprite) {
    return this.input.enable(sprite);
  }

}