import { GameObjects, Math, Scene } from 'phaser';
import { Dimensions, Misc } from '../utils/misc';
import { Components } from '../utils/components';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    reels: GameObjects.TileSprite[];
    slotmachine: GameObjects.Sprite;
    possibleValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'Joker'];
    reelIndex = 0;

    cardHeight = 420.21;

    constructor() {
        super('Game');
    }

    create() {
        this.camera = this.cameras.main;

        this.camera.fadeIn(1000, 0, 0, 0);

        this.sound.play('reg-bgm', {
            loop: true,
            volume: 0.5,
        });

        this.background = this.add.image(
            Dimensions.getWidth() / 2,
            Dimensions.getHeight() / 2,
            'background',
        );

        this.placeSlotMachine();
        this.placeReels();
        this.placeNumberButtons();
        this.placeRollButton();

    }

    moveReel(position: number) {
        const currentPosition = (this.reels[this.reelIndex].tilePositionY + 60) / this.cardHeight;
        if (currentPosition !== position) {
            this.tweens.add({
                targets: this.reels[this.reelIndex],
                props: {
                    tilePositionY: { value: (this.cardHeight * position) - 60, duration: 400 }
                },
                ease: Math.Easing.Expo.InOut
            })
        } else {
            this.tweens.add({
                targets: this.reels[this.reelIndex],
                props: {
                    tilePositionY: { value: this.reels[this.reelIndex].tilePositionY + 60, duration: 100 }
                },
                yoyo: true,
                ease: Math.Easing.Expo.InOut
            })
        }
        this.reelIndex = (this.reelIndex + 1) % this.reels.length;
    }

    placeNumberButtons() {

        const buttons = Array(this.possibleValues.length).fill(0).map((_, index) => this.slotButton(
            {
                x: 0,
                y: 0,
                index,
                onPress: () => {
                    this.moveReel(index)
                }
            }
        ));

        const gap = 10;
        const column = 4;
        let width = 0;
        let height = 0;

        buttons.forEach((button, index) => {
            const buttonWidth = button.getBounds().width + gap;
            const buttonHeight = button.getBounds().width + gap;

            button.x = (buttonWidth) * (index % column);
            button.y = (buttonHeight) * Math.FloorTo(index / column);

            if (index === 0) {
                width = buttonWidth * (column - 1);
                height = buttonHeight * Math.FloorTo(buttons.length / column - 1);
            }
        });

        const buttonGrid = this.add.container(0, 0, buttons);
        buttonGrid.x = this.camera.centerX - (width / 2);
        buttonGrid.y = Misc.flexPosition({ slices: 3, position: 2, direction: 'vertical' }) - (height / 2) + 20;


    }

    slotButton = ({
        x,
        y,
        index,
        onPress,
    }: {
        x: number,
        y: number,
        index: number,
        onPress: () => void,
    }): GameObjects.Container => {
        const buttonSprite = this.add.sprite(0, 0, 'button-normal').setScale(0.7);
        buttonSprite.setInteractive();
        buttonSprite.on('pointerdown', () => {
            buttonSprite.setTexture('button-pressed');

            buttonText.y += 2;
        }).on('pointerup', () => {
            this.sound.play('reg-button');
            buttonSprite.setTexture('button-normal');
            onPress();

            buttonText.y -= 2;
        });
        const buttonText = this.add.text(0, 0, this.possibleValues[index], {
            fontSize: 40,
            color: '#000000',
            fontStyle: 'bold',
        }).setOrigin(0.5);

        return this.add.container(
            x, y, [buttonSprite, buttonText]);
    }

    placeRollButton() {

        const button_width = 200;
        const button_height = 60;

        Components.button({
            context: this,
            x: this.camera.centerX,
            y: Misc.flexPosition({ slices: 5, position: 5, direction: 'vertical' }),
            width: button_width,
            height: button_height,
            text: 'ROLL',
            onPress: () => {
                this.sound.play('reg-lever');
                this.roll();
            },
        });
    }

    placeReels() {

        this.reels = Array(3).fill(0).map((_, index) => {
            return this.add.tileSprite(
                Misc.flexPosition({ slices: 9, position: 3 + (index * 2), direction: 'horizontal' }) + 7,
                Misc.flexPosition({ slices: 3, position: 1, direction: 'vertical' }),
                320,
                550.21,
                'slotreel',
            ).setScale(0.4).setTilePosition(0, 420.21 * Math.RND.between(0, 14) - 60);
        });
    }

    placeSlotMachine() {

        this.slotmachine = this.add.sprite(Misc.flexPosition({ slices: 3, position: 2, direction: 'horizontal' }),
            Misc.flexPosition({ slices: 3, position: 1, direction: 'vertical' }),
            'slotmachine',).setScale(2);

        this.anims.create({
            key: 'slotmachine-idle',
            frames: this.anims.generateFrameNames('slotmachine', { start: 0, end: 34 }),
            frameRate: 25,
            repeat: -1,
            yoyo: true,
        });

        this.anims.create({
            key: 'slotmachine-rolling',
            frames: this.anims.generateFrameNames('slotmachine', { start: 0, end: 28 }),
            frameRate: 50,
            repeat: -1,
            yoyo: false,
        });

        this.anims.create({
            key: 'slotmachine-result',
            frames: this.anims.generateFrameNames('slotmachine', { start: 76, end: 106 }),
            frameRate: 25,
            repeat: -1,
        });

        this.slotmachine.play('slotmachine-idle');
    }


    roll() {

        this.slotmachine.play('slotmachine-rolling');
        this.sound.play('reg-rolling')

        const results: number[] = Array(3).fill(0).map(() => Math.RND.between(0, 14));


        this.reels.forEach((reel, index) => {
            this.tweens.add({
                targets: reel,
                props: {
                    tilePositionY: {
                        value: (this.cardHeight * 14 * 2),
                        duration: 2000 - (index * 500),
                        delay: 500 * index,
                    },
                },
                onComplete: () => {
                    reel.tilePositionY = reel.tilePositionY % (this.cardHeight * 14);

                    if (index == this.reels.length - 1) {
                        console.log('syncing phase complete');
                    }

                    this.tweens.add({
                        targets: reel,
                        props: {
                            tilePositionY: {
                                value: reel.tilePositionY + (this.cardHeight * 14),
                                duration: 1000,
                            },
                        },
                        onComplete: () => {
                            reel.tilePositionY = reel.tilePositionY % (this.cardHeight * 14);

                            if (index == this.reels.length - 1) {
                                console.log('sustain sync complete');
                            }


                            this.tweens.add({
                                targets: reel,
                                props: {
                                    tilePositionY: {
                                        value: reel.tilePositionY + results[index] < 7 ?
                                            this.cardHeight * 14 + (this.cardHeight * results[index]) - 60 :
                                            (this.cardHeight * results[index]) - 60,
                                        duration: 1000 + (index * 1000),
                                    },
                                },
                                onComplete: () => {
                                    reel.tilePositionY = reel.tilePositionY % (this.cardHeight * 14);
                                    this.sound.play('reg-slot-stop');

                                    if (index == this.reels.length - 1) {
                                        console.log('display result complete');
                                        this.slotmachine.play('slotmachine-result');
                                        this.sound.play('reg-winning')

                                        this.time.delayedCall(5000, () => {
                                            this.slotmachine.play('slotmachine-idle');
                                        });
                                    }

                                },
                                ease: Math.Easing.Quadratic.Out,
                            });
                        },
                        ease: Math.Easing.Linear,
                    });
                },
                ease: Math.Easing.Quadratic.In,
            });
        });
    }


}
