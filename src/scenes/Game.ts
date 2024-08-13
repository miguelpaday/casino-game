import { GameObjects, Math, Scene } from 'phaser';
import { Dimensions, Misc } from '../utils/misc';

export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text: Phaser.GameObjects.Text;
    reels: GameObjects.TileSprite[];
    slotmachine: GameObjects.Sprite;

    constructor() {
        super('Game');
    }

    create() {
        // this.camera = this.cameras.main;

        this.background = this.add.image(
            Dimensions.getWidth() / 2,
            Dimensions.getHeight() / 2,
            'background',
        );


        this.slotmachine = this.add.sprite(Misc.flexPosition({ row: 3, position: 2, direction: 'horizontal' }),
            Misc.flexPosition({ row: 3, position: 1, direction: 'vertical' }),
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


        this.reels = Array(3).fill(0).map((_, index) => {
            return this.add.tileSprite(
                Misc.flexPosition({ row: 9, position: 3 + (index * 2), direction: 'horizontal' }) + 7,
                Misc.flexPosition({ row: 3, position: 1, direction: 'vertical' }),
                320,
                550.21,
                'slotreel',
            ).setScale(0.4).setTilePosition(0, 420.21 * Math.RND.between(0, 14) - 60);
        });

        const button_graphics = this.add.graphics();

        button_graphics.fillStyle(0xffffff, 1);
        button_graphics.lineStyle(5, 0x000000, 1);
        button_graphics.fillRoundedRect(
            Misc.flexPosition({ row: 3, position: 2, direction: 'horizontal' }) - (200 / 2),
            Misc.flexPosition({ row: 3, position: 3, direction: 'vertical' }),
            200,
            60,
            20
        );
        button_graphics.displayOriginX = 100;

        const button_text = this.add.text(
            Misc.flexPosition({ row: 3, position: 2, direction: 'horizontal' }),
            Misc.flexPosition({ row: 3, position: 3, direction: 'vertical' }) + 30,
            'ROLL',
            {
                color: '#000000',
                fontSize: '24px',
                strokeThickness: 15,
            }
        ).setOrigin(0.5, 0.5);

        button_graphics.setInteractive(
            new Phaser.Geom.Rectangle(
                Misc.flexPosition({ row: 3, position: 2, direction: 'horizontal' }),
                Misc.flexPosition({ row: 3, position: 3, direction: 'vertical' }),
                200,
                60,
            ),
            Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {
                this.roll();
            })
            .on('pointerover', () => {
                this.input.setDefaultCursor('pointer');
            })
            .on('pointerout', () => {
                this.input.setDefaultCursor('default');
            })
            .displayOriginX = 100;

    }


    roll() {

        this.slotmachine.play('slotmachine-rolling');

        const results: number[] = Array(3).fill(0).map(() => Math.RND.between(0, 14));
        const cardHeight = 420.21;


        this.reels.forEach((reel, index) => {
            this.tweens.add({
                targets: reel,
                props: {
                    tilePositionY: {
                        value: (cardHeight * 14 * 2),
                        duration: 2000 - (index * 500),
                        delay: 500 * index,
                    },
                },
                onComplete: () => {
                    reel.tilePositionY = reel.tilePositionY % (cardHeight * 14);

                    if (index == this.reels.length - 1) {
                        console.log('syncing phase complete');
                    }

                    this.tweens.add({
                        targets: reel,
                        props: {
                            tilePositionY: {
                                value: reel.tilePositionY + (cardHeight * 14),
                                duration: 1000,
                            },
                        },
                        onComplete: () => {
                            reel.tilePositionY = reel.tilePositionY % (cardHeight * 14);

                            if (index == this.reels.length - 1) {
                                console.log('sustain sync complete');
                            }


                            this.tweens.add({
                                targets: reel,
                                props: {
                                    tilePositionY: {
                                        value: reel.tilePositionY + results[index] < 7 ?
                                            cardHeight * 14 + (cardHeight * results[index]) - 60 :
                                            (cardHeight * results[index]) - 60,
                                        duration: 1000 + (index * 500),
                                    },
                                },
                                onComplete: () => {
                                    reel.tilePositionY = reel.tilePositionY % (cardHeight * 14);

                                    if (index == this.reels.length - 1) {
                                        console.log('display result complete');
                                        this.slotmachine.play('slotmachine-result');

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
