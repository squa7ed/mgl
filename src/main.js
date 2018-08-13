import mgl from "./lib/mgl";
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

export default class Main extends mgl.Game {
  create() {
    const tileSize = this.canvas.width / (COLUMNS + 2);
    const fieldOffsetY = (this.canvas.height - tileSize * ROWS) / 3;
    const fieldOffsetX = tileSize;
    const buttonsOffsetY = fieldOffsetY + tileSize * ROWS + 2 * tileSize;
    let index = 0;
    let gap = Math.round((COLUMNS * tileSize - 2 * COLORS.length * tileSize) / (COLORS.length - 1));
    this.field = [];
    for (let r = 0; r < ROWS; r++) {
      this.field[r] = [];
      for (let c = 0; c < COLUMNS; c++) {
        index = Math.round(Math.random() * 1000) % COLORS.length;
        let item = this.addSprite(fieldOffsetX + c * tileSize, fieldOffsetY + r * tileSize, COLORS[index], tileSize, tileSize);
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
        COLORS[index],
        tileSize * 2,
        tileSize * 2);
      item.data.set('color', index);
      this.enabelInput(item);
    }
    this.input.on('mousedown', this.onButtonPressed, this);
  }

  onButtonPressed(button) {
    console.debug(button.data.get('color'));
    if (this.field[0][0].data.get('color') !== button.data.get('color')) {
      this.flood(button.data.get('color'), 0, 0);
    }
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
          this.timer.delayedCallback(() => {
            sprite.data.set('color', color);
            sprite.color = COLORS[color];
          }, index * delay, this);
        })
    }
  }

}