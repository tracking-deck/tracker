import Rx from '@reactivex/rxjs/dist/cjs/Rx';
import * as tracking from 'tracking';

const calibrationMode = true;
/* const minLimit = 0;
const maxLimit = 650;*/
const limit1 = 0.3;
const limit2 = 1.7;
const minDimension = 17;
const minGroupSize = 100;

const colors = [
    createColor('refColor', 'C90000')
];

export const tracker = Rx.Observable.create(observer => {
    var colorTracker = new tracking.ColorTracker();

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
                topLeft: {x: 0, y: 0},
                topRight: {x: 0, y: 0},
                bottomLeft: {x: 0, y: 0},
                bottomRight: {x: 0, y: 0},
                trackables: data
            });
        } else {
            const corners = calculateCorners(data);
            if (corners) {
                const trackables = calculateTrackables(data, corners);
                observer.next({
                    topLeft: corners[0],
                    topRight: corners[1],
                    bottomLeft: corners[3],
                    bottomRight: corners[2],
                    trackables: trackables
                });
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

function registerColor(name, r, g, b) {
    console.log("register color", r, g, b);
    var colorTotal = r + g + b;

    var rRatio = r / colorTotal;
    var gRatio = g / colorTotal;

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

      return deltaColorTotal > limit1 && deltaColorTotal < limit2 &&
        deltaR > limit1 && deltaR < limit2 &&
        deltaG > limit1 && deltaG < limit2;
    });





    /* console.log("register color", r1, g1, b1);
    let lab1 = rgb2lab(r1, g1, b1);

    tracking.ColorTracker.registerColor(name, function(r2, g2, b2) {
        let lab2 = rgb2lab(r2, g2, b2);
        let delta = deltaE(lab1, lab2);
        return (delta > minLimit && delta < maxLimit);
    });
    */
}

// source
// https://github.com/antimatter15/rgb-lab/blob/master/color.js

function rgb2lab(r, g, b){
  var x, y, z;

  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
  y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
  z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

function deltaE(labA, labB){
  var deltaL = labA[0] - labB[0];
  var deltaA = labA[1] - labB[1];
  var deltaB = labA[2] - labB[2];
  var c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  var c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  var deltaC = c1 - c2;
  var deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  var sc = 1.0 + 0.045 * c1;
  var sh = 1.0 + 0.015 * c1;
  var deltaLKlsl = deltaL / (1.0);
  var deltaCkcsc = deltaC / (sc);
  var deltaHkhsh = deltaH / (sh);
  var i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
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
