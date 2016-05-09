var PerspT = require('perspective-transform');

class Transformer {
    constructor(srcCorners, dstCorners) {
        this.perspT = PerspT(srcCorners, dstCorners);
    }
    
    transform({x, y}) {
        const result = this.perspT.transform(x, y);
        return {
            x: result[0],
            y: result[1],
        };
    }
}

exports["default"] = Transformer;
module.exports = exports["default"];