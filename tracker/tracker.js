import Rx from '@reactivex/rxjs/dist/cjs/Rx';
import * as tracking from 'tracking';
import transformer from './transformer';
import config from '../config';
import io from 'socket.io-client';

let socket = io.connect(config.busAddress);

const colors = [
    createColor('custom', config.refColorCustom)
];

const rawData = Rx.Observable
    .create(rawDataObservable)
    .startWith([]);
const tracker = rawData
    .map(transformTrackables);
const keypress = Rx.Observable
    .fromEvent(document, 'keydown')
    .filter(e => e.code === 'Space');
const delayedStartup = Rx.Observable
    .interval(1000)
    .take(1);
const configUpdates = Rx.Observable
	.fromEvent(socket, 'configUpdate')
    .do(change => {
        if (change.type === 'color') {
            let newColor = createColor(change.name, change.color);
            registerColorCustomFunction(newColor.name, newColor.r, newColor.g, newColor.b);
        }
    });
const calibration = Rx.Observable
    .merge(keypress, delayedStartup, configUpdates)
    .withLatestFrom(rawData)
    .subscribe(result => calibrate(result[1]));

tracker.throttleTime(1000).subscribe(trackables => socket.emit('trackables', trackables));

function transformTrackables(rawData) {
    return rawData.map(trackable => transformer.transform(trackable));
}

function rawDataObservable(observer) {
    const colorTracker = new tracking.ColorTracker();

    tracking.track('#video', colorTracker, {
        camera: true
    });

    registerColorCustomFunction('custom', colors[0].r, colors[0].g, colors[0].b);
    colorTracker.setColors(['custom', 'yellow']);

    colorTracker.setMinDimension(config.minDimension);
    colorTracker.setMinGroupSize(config.minGroupSize);

    colorTracker.on('track', function(event) {
        const data = event.data.map(c => ({
            x: c.x + c.width / 2,
            y: c.y + c.height / 2,
            rectangle: {
                x: c.x,
                y: c.y,
                color: c.color,
                width: c.width,
                height: c.height,
            }
        }));

        observer.next(data);
    });
}

function createColor(name, hex) {
    return {
        "name": name,
        "r": parseInt(hex.substring(0, 2), 16),
        "g": parseInt(hex.substring(2, 4), 16),
        "b": parseInt(hex.substring(4, 6), 16)
    };
}

function registerColorCustomFunction(name, r1, g1, b1) {
    console.log("register color", r1, g1, b1);

    var colorTotal = r1 + g1 + b1;
    if (colorTotal === 0) {
        tracking.ColorTracker.registerColor('custom', function(r, g, b) {
            return r + g + b < 10;
        });
    } else {
        var rRatio = r1 / colorTotal;
        var gRatio = g1 / colorTotal;

        tracking.ColorTracker.registerColor(name, function(r, g, b) {
            var colorTotal2 = r + g + b;

            if (colorTotal2 === 0) {
                if (colorTotal < 10) {
                    return true;
                }
                return false;
            }

            var rRatio2 = r / colorTotal2,
                gRatio2 = g / colorTotal2,
                deltaColorTotal = colorTotal / colorTotal2,
                deltaR = rRatio / rRatio2,
                deltaG = gRatio / gRatio2;

            return deltaColorTotal > 0.9 && deltaColorTotal < 1.1 &&
                deltaR > 0.9 && deltaR < 1.1 &&
                deltaG > 0.9 && deltaG < 1.1;
        });
    }
}

function calibrate(rawData) {
    const corners = calculateCorners(rawData);

    if (corners) {
        transformer.updatePerspective([
            corners.topLeft.x, corners.topLeft.y,
            corners.topRight.x, corners.topRight.y,
            corners.bottomRight.x, corners.bottomRight.y,
            corners.bottomLeft.x, corners.bottomLeft.y
        ]);
    }
}

function calculateCorners(data) {
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

export {
    tracker,
    rawData,
    registerColorCustomFunction,
    createColor
}

/*
function calculateTrackables(eventData, corners) {
    return eventData.filter(i => {
        return !corners.some(c => i.x === c.x && i.y === c.y)
    });
}*/
