import PlaygroundRenderer from './playground-renderer';
import Rx from '@reactivex/rxjs/dist/cjs/Rx';
import './styles.less';
import config from '../config';
import io from 'socket.io-client';

let playgroundRenderer = new PlaygroundRenderer();
document.querySelector('.container')
    .appendChild(playgroundRenderer);

const socket = io.connect(config.busAddress);

let trackables = Rx.Observable.fromEvent(socket, 'trackables').startWith([]);
let virtualTrackables = Rx.Observable.fromEvent(socket, 'virtual-trackables').startWith([]);

let beamer = Rx.Observable.interval(1000/25)
 .withLatestFrom(trackables)
 .withLatestFrom(virtualTrackables)
 .map(result => { 
     return { 
         trackables: result[0][1], 
         virtualTrackables: result[1] 
     };
 });

playgroundRenderer.subscribeTo(beamer);
