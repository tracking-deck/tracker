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

const trackables = Rx.Observable
    .fromEvent(socket, 'trackables')
    .subscribe(msg => {
        let yellows = msg.filter(t => t.rectangle.color === 'yellow');
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

            let dest = {
                x: 0,
                y: 0
            }

            let tanRover = rad2deg((front.y - midpoint.y) / (front.x - midpoint.x));
            let tanDest = rad2deg((dest.y - midpoint.y) / (dest.x - midpoint.x));

            console.log(`tanRover: ${tanRover}`);
            console.log(`tanDest: ${tanDest}`);

            if (Math.abs(tanRover, tanDest) < 15) {
                // rover straight
                socket.emit('command', { target: 'lego-ev3', command: 'straight' });
            } else {
                // rover turn
                socket.emit('command', { target: 'lego-ev3', command: 'left' });
            }

            setTimeout(function () {
                socket.emit('command', { target: 'lego-ev3', command: 'stop' });
            }, 1000);
        }
    });

function rad2deg(radians) {
    return radians * 180 / Math.PI;
}
function distance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}