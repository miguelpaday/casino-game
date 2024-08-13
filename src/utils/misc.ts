

export class PaddingHelper {
    static padding: number = 50;
    static paddingSmall = 25;
    static paddingLarge = 75;
}

export class Misc {
    static flexPosition({ row, position, direction }: { row: number, position: number, direction: 'horizontal' | 'vertical' }) {
        if (direction === 'horizontal') {
            return (Dimensions.getWidth() / row) / 2 + (Dimensions.getWidth() / row) * (position - 1);
        }

        return (Dimensions.getHeight() / row) / 2 + (Dimensions.getHeight() / row) * (position - 1);
    }
}

export class Dimensions {
    static instance: Dimensions; // Add static property 'instance'

    private width: number;
    private height: number;

    constructor(
        width: number,
        height: number
    ) {
        this.width = width;
        this.height = height;

        if (Dimensions.instance) {
            return Dimensions.instance;
        }

        Dimensions.instance = this;
    }

    static getWidth() {
        if (!this.instance) {
            new Dimensions(0, 0);
        }

        return this.instance.width;
    }

    static getHeight() {
        if (!this.instance) {
            new Dimensions(0, 0);
        }

        return this.instance.height;
    }
}