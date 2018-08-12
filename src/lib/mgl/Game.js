import Sprite from './Sprite';
import EventEmitter from "./EventEmitter";

export default class Game extends EventEmitter {
  constructor() {
    super();
    this.canvas = undefined;
    this.context = undefined;

    this.isStarted = false;

    this.bindLoop = this.loop.bind(this);

    this.displayList = [];
    this.inputList = [];

    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 320;
    this.canvas.height = 568;
    document.getElementById('container').appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.canvas.addEventListener('mousedown', this.inputHandler.bind(this));
  }

  /**
  * 
  * @param {MouseEvent} event 
  */
  inputHandler(event) {
    let pointer = this.translateCoordinates(event.clientX, event.clientY);
    let sprite = this.inputList.find(item => item.isMouseOver(pointer.x, pointer.y));
    if (sprite) {
      this.emit('mousedown', sprite);
    }
  }

  translateCoordinates(x, y) {
    let rect = this.canvas.getBoundingClientRect();
    return { x: x - rect.left, y: y - rect.top };
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

  update() { }

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
    if (this.inputList.indexOf(sprite) === -1) {
      this.inputList.push(sprite);
    }
  }

}