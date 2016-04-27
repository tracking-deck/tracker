import * as tracking from 'tracking';

let limit1 = 0.7;
let limit2 = 1.5;
let minDimension = 12;
let minGroupSize = 100;

let colors = [
  createColor('refColor', 'FD6289')
];
  
window.onload = function() {
  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var tracker = new tracking.ColorTracker();

  tracking.track('#video', tracker, {
    camera: true
  });

  tracker.on('track', function(event) {
     context.clearRect(0, 0, canvas.width, canvas.height);
      let playGroundCoordinates = getPlaygroundCoordinates(event.data);
    if(playGroundCoordinates) {
      
      
      context.beginPath();
      context.moveTo(playGroundCoordinates.topLeft.x,playGroundCoordinates.topLeft.y);
      context.lineTo(playGroundCoordinates.topRight.x,playGroundCoordinates.topRight.y);
      context.lineTo(playGroundCoordinates.bottomRight.x,playGroundCoordinates.bottomRight.y);
      context.lineTo(playGroundCoordinates.bottomLeft.x,playGroundCoordinates.bottomLeft.y);
      context.lineTo(playGroundCoordinates.topLeft.x,playGroundCoordinates.topLeft.y);
      context.strokeStyle="red";
      context.stroke();
    
    }
     
     event.data.forEach(function(rect) {
          context.strokeStyle = rect.color;
          context.strokeRect(rect.x, rect.y, rect.width, rect.height);
          context.font = '11px Helvetica';
          context.fillStyle = "#fff";
          context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
          context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        });
  });

  colors.forEach(c => {
    registerColor(c.name, c.r, c.g, c.b);
  });

  tracker.setColors(colors.map(c => c.name));
  tracker.setMinDimension(minDimension);
  tracker.setMinGroupSize(minGroupSize);
};

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