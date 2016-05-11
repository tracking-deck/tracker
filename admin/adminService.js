import io from 'socket.io-client';
import config from '../config';

const socket = io.connect(config.busAddress);

export function setColor(name, color) {
	socket.emit('configUpdate', {
		type: 'color',
		name: color,
		color: color
	});
}