import io from 'socket.io-client';
import config from '../config';

const socket = io.connect(config.busAddress);

export function setColor(name, color) {
	socket.emit('configChange', {
		type: 'color',
		name: color,
		color: color
	});
}