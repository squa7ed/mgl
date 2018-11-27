import { Scene, Text } from "../mgl/index";

const announcement = [
  '抵制不良游戏，拒绝盗版游戏。',
  '注意自我保护，谨防受骗上当。',
  '适度游戏益脑，沉迷游戏伤身。',
  '合理安排时间，享受健康生活。'
]

export class StartScene extends Scene {

  private stageWidth: number;

  private stageHeight: number;

  private textStart: Text;

  private textQuit: Text;

  onLoad(): void {
  }

  onCreate(): void {
    this.stageWidth = this.game.canvas.width;
    this.stageHeight = this.game.canvas.height;

    this.textStart = this.add.text(this.stageWidth / 4, this.stageHeight / 2, '开始', { fontSize: 28 }).setOrigin(0.5);
    this.input.enable(this.textStart);
    this.textStart.on('pointerDown', this.onStartButtonPressed, this);
    this.textQuit = this.add.text(this.stageWidth * 3 / 4, this.stageHeight / 2, '退出', { fontSize: 28 }).setOrigin(0.5);
    this.input.enable(this.textQuit);
    this.textQuit.on('pointerDown', this.onQuitButtonPressed, this);

    this.add.text(this.game.canvas.width / 2, this.game.canvas.height / 4, '颜色领域', { fontSize: 32 }).setOrigin(0.5);

    announcement.forEach((str, i) => {
      this.add.text(this.game.canvas.width / 2, this.game.canvas.height * (10 + i) / 16, str, { fontSize: 14 }).setOrigin(0.5, 0);
    })
  }

  onStartButtonPressed(): void {
    this.game.scene.stop('StartScene');
    this.game.scene.start('GameScene');
  }

  onQuitButtonPressed(): void {
    console.debug('Not implemented.');
  }

  onUpdate(time: number, dt: number): void {
  }


}