console.clear();
import './styles.less'
import Rx from '@reactivex/rxjs/dist/cjs/Rx';
import config from '../config';
import io from 'socket.io-client';
import transformer from './transformer';
import { rawDataObservable, registerColorCustomFunction } from './tracker';
import Overlay from './Overlay';

const overlay = new Overlay();
document.querySelector('body').appendChild(overlay);

const socket = io.connect(config.busAddress);

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
    .do(configChange);

const calibration = Rx.Observable
    .merge(keypress, delayedStartup, configUpdates)
    .withLatestFrom(rawData);

calibration.subscribe(result => transformer.calibrate(result[1]));
tracker.throttleTime(1000).subscribe(trackables => socket.emit('trackables', trackables));
rawData.throttleTime(100).subscribe(points => overlay.render(points));

function transformTrackables(rawData) {
    return rawData.map(trackable => transformer.transform(trackable));
}

function configChange(change) {
    if (change.type === 'color') {
        registerColorCustomFunction(change.name, change.color);
    }
}
