import { Scene, GameObjects } from 'phaser';
import { Dimensions, Misc } from '../utils/misc';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    create() {
        this.background = this.add.image(
            Dimensions.getWidth() / 2,
            Dimensions.getHeight() / 2,
            'background',
        );

        this.logo = this.add.image(
            Dimensions.getWidth() / 2,
            Misc.flexPosition({ slices: 5, position: 1, direction: 'vertical' }),
            'logo',
        );



        this.title = this.add.text(
            Dimensions.getWidth() / 2,
            Misc.flexPosition({ slices: 5, position: 1, direction: 'vertical' }),
            'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5, -1);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });

    }


}
