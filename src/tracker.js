import Rx from '@reactivex/rxjs/dist/cjs/Rx';
import * as tracking from 'tracking';
import Transformer from './transformer';

const calibrationMode = false;
const deltaMax = 3500;
const minDimension = 17;
const minGroupSize = 100;

var transformer = null;

//Previous colors: C90000
const colors = [
    createColor('refColor', '9f172d')

];

// var keyDowns = Rx.Observable.fromEvent(document, 'keydown');


export const tracker = Rx.Observable.create(observer => {
    var colorTracker = new tracking.ColorTracker();
    //console.debug("Observable created");

    tracking.track('#video', colorTracker, {
        camera: true
    });

    colors.forEach(c => {
        registerColor(c.name, c.r, c.g, c.b);
    });

    colorTracker.setColors(colors.map(c => c.name));
    colorTracker.setMinDimension(minDimension);
    colorTracker.setMinGroupSize(minGroupSize);

    colorTracker.on('track', function(event) {
        const data = event.data.map(c => ({
            x: c.x + c.width / 2,
            y: c.y + c.height / 2
        }));
        if (calibrationMode) {
            observer.next({
                topLeft: {
                    x: 0,
                    y: 0
                },
                topRight: {
                    x: 0,
                    y: 0
                },
                bottomLeft: {
                    x: 0,
                    y: 0
                },
                bottomRight: {
                    x: 0,
                    y: 0
                },
                trackables: data
            });
        } else {
            const corners = calculateCorners(data);

            if (corners) {
                var state = {
                    topLeft: corners[0],
                    topRight: corners[1],
                    bottomLeft: corners[3],
                    bottomRight: corners[2]
                };

                if (!transformer) {
                    transformer = new Transformer(
                        [state.topLeft.x, state.topLeft.y,
                            state.topRight.x, state.topRight.y,
                            state.bottomRight.x, state.bottomRight.y,
                            state.bottomLeft.x, state.bottomLeft.y
                        ], [0, 0, 1000, 0, 1000, 750, 0, 750]
                    );
                }

                var newState = {};
                newState.topLeft = transformer.transform(state.topLeft);
                newState.topRight = transformer.transform(state.topRight);
                newState.bottomLeft = transformer.transform(state.bottomLeft);
                newState.bottomRight = transformer.transform(state.bottomRight);
                newState.trackables = calculateTrackables(data, corners).map(trackable => transformer.transform(trackable));
                observer.next(newState);
            }
        }
    });
});

function createColor(name, hex) {
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    return {
        "name": name,
        "r": r,
        "g": g,
        "b": b
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
        return dx * dx + dy * dy + dz * dz < deltaMax;
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

    return [topLeft, topRight, bottomRight, bottomLeft];
}

function calculateTrackables(eventData, corners) {
    return eventData.filter(i => {
        return !corners.some(c => i.x === c.x && i.y === c.y)
    });
}
