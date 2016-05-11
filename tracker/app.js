console.clear();
import './styles.less'
import './tracker';


Rx.Observable
	.fromEvent(socket, 'configUpdate')

socket.on('configUpdate', change => {
	if (change.type === 'color') {
		let newColor = createColor(change.name, change.color);
		registerColorCustomFunction(newColor.name, newColor.r, newColor.g, newColor.b);
	}
});
