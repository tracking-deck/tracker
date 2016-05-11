console.clear();
import './styles.less'
import { tracker, createColor, registerColorCustomFunction } from './tracker';
import * as t from './transformer';
import io from 'socket.io-client';
import config from '../config';


let socket = io.connect(config.busAddress);
tracker.throttleTime(1000).subscribe(trackables => socket.emit('trackables', trackables));

socket.on('configChange', change => {
	if (change.type === 'color') {
		let newColor = createColor(change.name, change.color);
		registerColorCustomFunction(newColor.name, newColor.r, newColor.g, newColor.b);
	}
});
