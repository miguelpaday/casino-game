import { Scene } from 'phaser';
import { Dimensions } from '../utils/misc';

export class Preloader extends Scene {

    constructor() {
        super('Preloader');
    }

    init() {

        const progressBarWidth = 468;
        //  We loaded this image in our Boot Scene, so we can display it here
        // this.add.image(768, 1024, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(Dimensions.getWidth() / 2, 384, progressBarWidth, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle((Dimensions.getWidth() / 2) - (progressBarWidth / 2) + 2, 384, 4, 28, 0xffffff).setOrigin(0, 0.5);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('assets');

        this.load.image('logo', 'logo.png');
        this.load.image('button-normal', 'buttons/reg-digit-background.png');
        this.load.image('button-pressed', 'buttons/reg-digit-background2.png');
        this.load.image('slotreel', 'slot/reg-slot-reel.png');
        this.load.spritesheet('slotmachine', 'slot/slot-machine-sprite.png', { frameWidth: 320, frameHeight: 175 });
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Game');
        // this.scene.start('MainMenu');
    }
}
