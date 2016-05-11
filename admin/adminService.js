import io from 'socket.io-client';
import Rx from '@reactivex/rxjs/dist/cjs/Rx';
import config from '../config';

const socket = io.connect(config.busAddress);

export const command = Rx.Observable.fromEvent(socket, 'command');

export function setColor(name, color) {
	socket.emit('configUpdate', {
		type: 'color',
		name,
		color
	});
}
