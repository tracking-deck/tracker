import PlaygroundRenderer from './playground-renderer';
import Rx from '@reactivex/rxjs/dist/cjs/Rx';
import './styles.less';
import config from '../config';
import io from 'socket.io-client';

let playgroundRenderer = new PlaygroundRenderer();
document.querySelector('.container')
    .appendChild(playgroundRenderer);

const socket = io.connect(config.busAddress);

playgroundRenderer.subscribeTo(Rx.Observable.fromEvent(socket, 'trackables'));
