import Rx from '@reactivex/rxjs/dist/cjs/Rx';
import * as tracking from 'tracking';

const limit1 = 0.7;
const limit2 = 1.5;
const minDimension = 12;
const minGroupSize = 100;

const colors = [
  createColor('refColor', 'FD6289')
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
        const coordinates = getPlaygroundCoordinates(event.data);
        if (coordinates) {
            observer.next({
                topLeft: coordinates.topLeft,
                topRight: coordinates.topRight,
                bottomLeft: coordinates.bottomLeft,
                bottomRight: coordinates.bottomRight
            });
        }
    });
});

function createColor(name, hex){
    let r = parseInt(hex.substring(0,2), 16);
    let g = parseInt(hex.substring(2,4), 16);
    let b = parseInt(hex.substring(4,6), 16);
    return { "name": name, "r": r, "g": g, "b": b };
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
}


function getPlaygroundCoordinates(coordinates) {
  if(coordinates.length < 4) {
    return undefined;
  }
  
  var data = coordinates.map(c => ({ x: c.x + c.width/2, y: c.y + c.height/2 }))
  
  var topLeft = data
  .sort((a,b) => a.x > b.x)
  .slice(0,2)
  .sort((a,b) => a.y > b.y)
  .slice(0,1)[0];

var topRight = data
  .sort((a,b) => a.x < b.x)
  .slice(0,2)
  .sort((a,b) => a.y > b.y)
  .slice(0,1)[0];

var bottomLeft = data
  .sort((a,b) => a.x > b.x)
  .slice(0,2)
  .sort((a,b) => a.y < b.y)
  .slice(0,1)[0];

var bottomRight = data
  .sort((a,b) => a.x < b.x)
  .slice(0,2)
  .sort((a,b) => a.y < b.y)
  .slice(0,1)[0];
  
  return { topLeft, topRight, bottomLeft, bottomRight };
}