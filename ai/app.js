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