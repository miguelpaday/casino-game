import { Boot } from './scenes/Boot';
import { Game as MainGame } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { MainMenu } from './scenes/MainMenu';
import { Preloader } from './scenes/Preloader';

import { Game, Types } from "phaser";
import { Slot } from './scenes/Slot';
import { Dimensions } from './utils/misc';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig



new Dimensions(768, 1024);


const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: Dimensions.getWidth(),
    height: Dimensions.getHeight(),
    parent: 'game-container',
    backgroundColor: '#5f0b19',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        Slot
    ]
};



export default new Game(config);
