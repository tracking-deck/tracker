console.clear();
import './styles.less'
import { tracker } from './tracker';
import * as t from './transformer';
import io from 'socket.io-client';
import config from '../config';


let socket = io.connect(config.busAddress);
tracker.throttleTime(1000).subscribe(trackables => socket.emit('trackables', trackables));

if (localStorage.getItem('debug') !== null) {
	let debug = localStorage.getItem('debug') === 'true';
	document.querySelector('#background').className = (debug) ? "show-webcam" :"hide-webcam";
}
