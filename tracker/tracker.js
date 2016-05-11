import * as tracking from 'tracking';
import config from '../config';

const customColor = { name: 'custom', hex: config.refColorCustom };

export function rawDataObservable(observer) {
    const colorTracker = new tracking.ColorTracker();

    tracking.track('#video', colorTracker, {
        camera: true
    });

    registerColorCustomFunction(customColor.name, customColor.hex);

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

export function registerColorCustomFunction(name, hex) {
    const r1 = parseInt(hex.substring(0, 2), 16);
    const g1 = parseInt(hex.substring(2, 4), 16);
    const b1 = parseInt(hex.substring(4, 6), 16);

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
