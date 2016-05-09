import Rx from '@reactivex/rxjs/dist/cjs/Rx';
import * as tracking from 'tracking';
import transformer from './transformer';
import config from './config';

const colors = [
    createColor('refColor', config.refColor)
];

//Rx.Observable.fromEvent(document, 'keydown').subscribe;

export const tracker = Rx.Observable.create(observer => {
    var colorTracker = new tracking.ColorTracker();

    tracking.track('#video', colorTracker, {
        camera: true
    });

    colors.forEach(c => {
        registerColor(c.name, c.r, c.g, c.b);
    });

    colorTracker.setColors(colors.map(c => c.name));
    colorTracker.setMinDimension(config.minDimension);
    colorTracker.setMinGroupSize(config.minGroupSize);

    colorTracker.on('track', function(event) {
        const data = event.data.map(c => ({
            x: c.x + c.width / 2,
            y: c.y + c.height / 2
        }));
        if (config.calibrationMode) {
            observer.next({ trackables: data });
        } else {
            const corners = calculateCorners(data);

            if (corners) {
                transformer.updatePerspective([
                    corners.topLeft.x, corners.topLeft.y,
                    corners.topRight.x, corners.topRight.y,
                    corners.bottomRight.x, corners.bottomRight.y,
                    corners.bottomLeft.x, corners.bottomLeft.y]);

                observer.next({
                    trackables: data.map(trackable => transformer.transform(trackable))
                });
            }
        }
    });
});

function createColor(name, hex) {
    return {
        "name": name,
        "r": parseInt(hex.substring(0, 2), 16),
        "g": parseInt(hex.substring(2, 4), 16),
        "b": parseInt(hex.substring(4, 6), 16)
    };
}

function registerColor(name, r1, g1, b1) {
    console.log("register color", r1, g1, b1);

    tracking.ColorTracker.registerColor(name, function(r2, g2, b2) {
        if ((b2 - g2) >= (b1 - g1) && (r2 - g2) >= (r1 - g1)) {
            return true;
        }

        var dx = Math.abs(r2 - r1);
        var dy = Math.abs(g2 - g1);
        var dz = Math.abs(b2 - b1);
        return dx * dx + dy * dy + dz * dz < config.deltaMax;
    });
}

function calculateCorners(data) {
    if (data.length < 4) {
        return undefined;
    }

    var topLeft = data
        .sort((a, b) => a.x > b.x)
        .slice(0, 2)
        .sort((a, b) => a.y > b.y)
        .slice(0, 1)[0];

    var topRight = data
        .sort((a, b) => a.x < b.x)
        .slice(0, 2)
        .sort((a, b) => a.y > b.y)
        .slice(0, 1)[0];

    var bottomLeft = data
        .sort((a, b) => a.x > b.x)
        .slice(0, 2)
        .sort((a, b) => a.y < b.y)
        .slice(0, 1)[0];

    var bottomRight = data
        .sort((a, b) => a.x < b.x)
        .slice(0, 2)
        .sort((a, b) => a.y < b.y)
        .slice(0, 1)[0];

    return { topLeft, topRight, bottomRight, bottomLeft };
}

/*
function calculateTrackables(eventData, corners) {
    return eventData.filter(i => {
        return !corners.some(c => i.x === c.x && i.y === c.y)
    });
}*/
