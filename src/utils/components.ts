import { Scene } from "phaser";

export class Components {
    static button({
        x,
        y,
        width,
        height,
        text,
        onPress,
        context,
        borderRadius = 20,
        buttonColor = 0xffffff,
        buttonBorderColor = 0x00ff00,
        buttonBorderWidth = 20,
        fontColor = '#000000',
        fontSize = 24,
        fontStyle = 'normal',
    }: {
        x: number,
        y: number,
        width: number,
        height: number,
        text: string,
        onPress: () => void,
        context: Scene,
        buttonColor?: number;
        buttonBorderColor?: number;
        buttonBorderWidth?: number;
        borderRadius?: number;
        fontColor?: string | CanvasGradient | CanvasPattern;
        fontSize?: number;
        fontStyle?: 'normal' | 'bold' | 'italic';
    }) {

        const button_graphics = context.add.graphics();
        button_graphics.fillStyle(buttonColor, 1);
        button_graphics.lineStyle(buttonBorderWidth, buttonBorderColor, 1);
        button_graphics.fillRoundedRect(
            0, 0,
            width,
            height,
            borderRadius
        );

        const button_text = context.add.text(
            width / 2, height / 2,
            text,
            {
                color: fontColor,
                fontSize: fontSize,
                fontStyle: fontStyle,
            }
        );

        button_text.setOrigin(0.5);

        button_graphics.setInteractive(
            new Phaser.Geom.Rectangle(
                0, 0,
                width,
                height,
            ),
            Phaser.Geom.Rectangle.Contains)
            .on('pointerdown', () => {
                onPress();
            })
            .on('pointerover', () => {
                context.input.setDefaultCursor('pointer');
            })
            .on('pointerout', () => {
                context.input.setDefaultCursor('default');
            })
            .displayOriginX = 0.5;


        const buttonGroup = context.add.container();
        buttonGroup.add(button_graphics);
        buttonGroup.add(button_text);
        buttonGroup.setPosition(x - width / 2, y - height / 2);
    }

}