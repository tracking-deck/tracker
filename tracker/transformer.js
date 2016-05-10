import PerspT from 'perspective-transform';
import config from '../config';

class Transformer {
    constructor() {
        this.dstCorners = [0, 0, config.canvasWidth, 0, config.canvasWidth, config.canvasWidth / config.screenRatio, 0, config.canvasWidth / config.screenRatio];
    }

    updatePerspective(srcCorners) {

            console.log('updatePerspective', srcCorners, this.dstCorners);
            this.perspT = PerspT(srcCorners, this.dstCorners);

    }

    transform({x, y}) {
        if (!this.perspT) {
            return {x: x, y: y};
        }

        const result = this.perspT.transform(x, y);
        return {
            x: result[0],
            y: result[1],
        };
    }
}

export default new Transformer();
