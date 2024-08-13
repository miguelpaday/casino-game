import { Actions, Cameras, Game, GameObjects, Scene } from "phaser";
import { Dimensions, PaddingHelper } from "../utils/misc";

export class Slot extends Scene {

    camera: Cameras.Scene2D.Camera;
    title: GameObjects.Text;
    card: GameObjects.Image;
    symbols: string[] = ['card-2', 'card-3', 'card-4', 'card-5', 'card-6'];
    reel: GameObjects.Group;

    constructor() {
        super('Slot');
    }

    preload() {
        console.log('Slot preload');
    }

    create() {
    }

}