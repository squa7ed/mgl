const ROWS = 14;
const COLUMNS = 14;
const COLORS = [
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ff00ee',
  '#ffee00',
];

let cnt = 0;

export default class Game {
  constructor() {
    this.canvas = undefined;
    this.context = undefined;

    this.bindLoop = this.loop.bind(this);
    this.inputHandler = this.onButtonPressed.bind(this);

    this.onload = undefined;

    this.displayList = [];
    this.inputList = [];

    this.field = [];

    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 320;
    this.canvas.height = 568;
    document.getElementById('container').appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
  }

  start() {
    this.startAnimation();
    this.onload = this.create;
    this.load();
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

  }

  render() {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.displayList.forEach(sprite => sprite.render(this.context));
  }

  load() {
    cnt++;
    console.log('calling load...');
    console.log('load finshed...');
    if (this.onload && typeof this.onload === 'function') {
      this.onload.call(this);
    }
  }

  create() {
    const tileSize = this.canvas.width / (COLUMNS + 2);
    const fieldOffsetY = (this.canvas.height - tileSize * ROWS) / 3;
    const fieldOffsetX = tileSize;
    const buttonsOffsetY = fieldOffsetY + tileSize * ROWS + 2 * tileSize;
    let index = 0;
    let gap = Math.round((COLUMNS * tileSize - 2 * COLORS.length * tileSize) / (COLORS.length - 1));
    for (let r = 0; r < ROWS; r++) {
      this.field[r] = [];
      for (let c = 0; c < COLUMNS; c++) {
        index = Math.round(Math.random() * 1000) % COLORS.length;
        let item = this.addSprite(fieldOffsetX + c * tileSize, fieldOffsetY + r * tileSize, tileSize, tileSize, COLORS[index]);
        item.data.set('row', r);
        item.data.set('column', c);
        item.data.set('color', index);
        this.field[r][c] = item;
      }
    }
    for (index = 0; index < COLORS.length; index++) {
      let item = this.addSprite(
        fieldOffsetX + index * tileSize * 2 + index * gap,
        buttonsOffsetY,
        tileSize * 2,
        tileSize * 2,
        COLORS[index]);
      item.data.set('color', index);
      this.enabelInput(item);
    }
    this.startListeners();
  }

  enabelInput(sprite) {
    if (this.inputList.indexOf(sprite) === -1) {
      this.inputList.push(sprite);
    }
  }

  startListeners() {
    this.canvas.addEventListener('mousedown', this.inputHandler, { passive: false });
  }

  /**
   * 
   * @param {MouseEvent} event 
   */
  onButtonPressed(event) {
    let pointer = this.translateCoordinates(event.clientX, event.clientY);
    let button = this.inputList.find(item => item.isMouseOver(pointer.x, pointer.y));
    if (button) {
      if (this.field[0][0].data.get('color') !== button.data.get('color')) {
        this.flood(button.data.get('color'), 0, 0);
      }
    }
  }

  translateCoordinates(x, y) {
    let rect = this.canvas.getBoundingClientRect();
    return { x: x - rect.left, y: y - rect.top };
  }

  flood(color, row, column) {
    let oldColor = this.field[row][column].data.get('color');
    let stack = [this.field[row][column]];
    let matched = [];
    while (stack.length !== 0) {
      let tile = stack.pop();
      let r = tile.data.get('row');
      let c = tile.data.get('column');
      if (matched.indexOf(tile) === -1) {
        matched.push(tile);
      }
      if (r > 0 && this.field[r - 1][c].data.get('color') === oldColor && matched.indexOf(this.field[r - 1][c]) === -1) {
        stack.push(this.field[r - 1][c]);
      }
      if (c < COLUMNS - 1 && this.field[r][c + 1].data.get('color') === oldColor && matched.indexOf(this.field[r][c + 1]) === -1) {
        stack.push(this.field[r][c + 1]);
      }
      if (r < ROWS - 1 && this.field[r + 1][c].data.get('color') === oldColor && matched.indexOf(this.field[r + 1][c]) === -1) {
        stack.push(this.field[r + 1][c]);
      }
      if (c > 0 && this.field[r][c - 1].data.get('color') === oldColor && matched.indexOf(this.field[r][c - 1]) === -1) {
        stack.push(this.field[r][c - 1]);
      }
    }
    if (matched.length > 0) {
      let len = matched.length;
      let delay = Math.round(500 / len);
      matched
        .sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y))
        .forEach((sprite, index) => {
          setTimeout(() => {
            sprite.data.set('color', color);
            sprite.color = COLORS[color];
          }, index * delay);
        });
    }
  }

  addSprite(x, y, width, height, color) {
    let sprite = new Sprite(x, y, width, height, color);
    this.displayList.push(sprite);
    return sprite;
  }
};

/**
 * Simple sprite object, we use colored rectangles at this moment.
 */
class Sprite {
  constructor(x, y, width, height, color) {
    this.x = x || 0;
    this.y = y || 0;
    // size
    this.width = width || 0;
    this.height = height || 0;
    this.color = color || '#ff0000'
    this.data = new Map();
  }

  /**
   * 
   * @param {CanvasRenderingContext2D} context 
   */
  render(context) {
    const color = context.fillStyle;
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillStyle = color;
  }

  isMouseOver(x, y) {
    return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
  }

}