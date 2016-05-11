import PerspT from 'perspective-transform';
import config from '../config';

class Transformer {
    constructor() {
        this.dstCorners = [0, 0, config.canvasWidth, 0, config.canvasWidth, config.canvasWidth / config.screenRatio, 0, config.canvasWidth / config.screenRatio];
    }

    calibrate(rawData) {
        const corners = this.calculateCorners(rawData);

        if (corners) {
            this.updatePerspective([
                corners.topLeft.x, corners.topLeft.y,
                corners.topRight.x, corners.topRight.y,
                corners.bottomRight.x, corners.bottomRight.y,
                corners.bottomLeft.x, corners.bottomLeft.y
            ]);
        }
    }

    updatePerspective(srcCorners) {
        this.perspT = PerspT(srcCorners, this.dstCorners);
    }

    transform({x, y, rectangle}) {
        if (!this.perspT) {
            return {
                x: x,
                y: y,
                rectangle: rectangle,
            };
        }

        const result = this.perspT.transform(x, y, rectangle);
        return {
            x: result[0],
            y: result[1],
            rectangle: rectangle,
        };
    }

    calculateCorners(data) {
        if (data.length < 4) {
            return undefined;
        }

        var topLeft = data
            .sort((a, b) => a.x - b.x)
            .slice(0, 2)
            .sort((a, b) => a.y - b.y)
            .slice(0, 1)[0];

        var topRight = data
            .sort((a, b) => b.x - a.x)
            .slice(0, 2)
            .sort((a, b) => a.y - b.y)
            .slice(0, 1)[0];

        var bottomLeft = data
            .sort((a, b) => b.y - a.y)
            .slice(0, 2)
            .sort((a, b) => a.x - b.x)
            .slice(0, 1)[0];

        var bottomRight = data
            .sort((a, b) => b.y - a.y)
            .slice(0, 2)
            .sort((a, b) => b.x - a.x)
            .slice(0, 1)[0];

        return {
            topLeft,
            topRight,
            bottomRight,
            bottomLeft
        };
    }
}

export default new Transformer();
