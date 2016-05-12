import Rx from '@reactivex/rxjs/dist/cjs/Rx';
import io from 'socket.io-client';
import config from '../config';


const socket = io.connect(config.busAddress);
//Rx.Observable.fromEvent(socket, 'trackables');


Rx.Observable
    .fromEvent(document, 'keydown')
    .filter(e => e.code === 'ArrowRight')
    .subscribe(e => socket.emit('command', { target: 'lego-ev3', command: 'right' }));

Rx.Observable
    .fromEvent(document, 'keydown')
    .filter(e => e.code === 'ArrowLeft')
    .subscribe(e => socket.emit('command', { target: 'lego-ev3', command: 'left' }));

Rx.Observable
    .fromEvent(document, 'keydown')
    .filter(e => e.code === 'ArrowUp')
    .subscribe(e => socket.emit('command', { target: 'lego-ev3', command: 'straight' }));

Rx.Observable
    .fromEvent(document, 'keydown')
    .filter(e => e.code === 'ArrowDown')
    .subscribe(e => socket.emit('command', { target: 'lego-ev3', command: 'stop' }));

const virtualTrackables = Rx.Observable.fromEvent(socket, 'virtual-trackables').startWith([]);
const trackables = Rx.Observable.fromEvent(socket, 'trackables').startWith([]);

Rx.Observable.interval(1500)
    .withLatestFrom(trackables)
    .withLatestFrom(virtualTrackables)
    .map(result => {
        return {
            trackables: result[0][1],
            virtualTrackables: result[1]
        };
    })
    .subscribe(msg => {
        let dest = {
            x: 500,
            y: 500
        }

        // real world dest:
        /*
        let purples = msg.trackables.filter(t => t.rectangle.color === 'custom');
        if (purples.length === 5) {
            let corners = calculateCorners(purples);
            let others = filterCorners(purples, corners);
            if (others.length === 1) {
                dest.x = others[0].x;
                dest.y = others[0].y;
                console.log(`dest ${dest.x},${dest.y}`);
            }
        }*/

        // virtual world dest:
        if (msg.virtualTrackables.length === 1) {
            dest.x = msg.virtualTrackables[0].x;
            dest.y = msg.virtualTrackables[0].y;
            console.log(`dest ${dest.x},${dest.y}`);
        }


        let yellows = msg.trackables.filter(t => t.rectangle.color === 'yellow');
        if (yellows.length === 3) {
            let d1 = distance(yellows[0], yellows[1]);
            let d2 = distance(yellows[1], yellows[2]);
            let d3 = distance(yellows[2], yellows[0]);

            let front, back1, back2;
            if (d1 < d2 && d1 < d3) {
                front = yellows[2];
                back1 = yellows[0];
                back2 = yellows[1];
            } else if (d2 < d1 && d2 < d3) {
                front = yellows[0];
                back1 = yellows[1];
                back2 = yellows[2];
            } else if (d3 < d2 && d3 < d1) {
                front = yellows[1];
                back1 = yellows[0];
                back2 = yellows[2];
            }

            let midpoint = {
                x: (back1.x + back2.x) / 2,
                y: (back1.y + back2.y) / 2
            }
            console.log(`(${front.x},${front.y})(${back1.x},${back1.y})(${back2.x},${back2.y})(${midpoint.x},${midpoint.y})`);

            let angle = rad2deg(angleBetween(front, midpoint, dest));
            console.log(`angle: ${angle}`);
            let destLeft = isLeft(front, midpoint, dest);
            console.log(`isLeft: ${isLeft}`);

            console.log('distance:' + distance(front, dest));
            if (distance(front, dest) > 100) {
                if (Math.abs(angle) < 20) {
                    // rover straight
                    socket.emit('command', { target: 'lego-ev3', command: 'straight' });
                    setTimeout(function () {
                        socket.emit('command', { target: 'lego-ev3', command: 'stop' });
                    }, 1500);
                } else {
                    // rover turn
                    let time = Math.max(50, Math.floor(Math.abs(angle) / 10) * 100);
                    console.log(`turn ${time}ms`);

                    if (destLeft) {
                        socket.emit('command', { target: 'lego-ev3', command: 'left' });
                    } else {
                        socket.emit('command', { target: 'lego-ev3', command: 'right' });
                    }
                    setTimeout(function () {
                        socket.emit('command', { target: 'lego-ev3', command: 'stop' });
                    }, time);
                }
            }

        }
    });

function angleBetween(A, B, C) {
    var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
}
function rad2deg(radians) {
    return radians * 180 / Math.PI;
}
function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}
function isLeft(lineA, lineB, point) {
    return ((lineB.x - lineA.x) * (point.y - lineA.y) - (lineB.y - lineA.y) * (point.x - lineA.x)) > 0;
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

    return [
        topLeft,
        topRight,
        bottomRight,
        bottomLeft
    ];
}

function filterCorners(eventData, corners) {
    return eventData.filter(i => {
        return !corners.some(c => i.x === c.x && i.y === c.y)
    });
}