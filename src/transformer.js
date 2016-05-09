import PerspT from 'perspective-transform';
import config from './config';

class Transformer {
    constructor(srcCorners) {
        this.dstCorners = [0, 0, config.canvasWidth, 0, config.canvasWidth, config.canvasWidth / config.screenRatio, 0, config.canvasWidth / config.screenRatio];
        this.updatePerspective(srcCorners);
    }

    updatePerspective(srcCorners) {
        this.perspT = PerspT(srcCorners || this.dstCorners, this.dstCorners);
    }

    transform({x, y}) {
        const result = this.perspT.transform(x, y);
        return {
            x: result[0],
            y: result[1],
        };
    }
}

export default new Transformer();
