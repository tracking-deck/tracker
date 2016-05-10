console.clear();
import PlaygroundRenderer from './playground-renderer';
import './styles.less'
import { tracker } from './tracker';
import * as t from './transformer';
import io from 'socket.io-client';
import config from './config';


let socket = io.connect(config.busAddress);

socket.emit("trackables", "hoi");


/*
socket.on('chat message', function(msg){
   console.log("message received: ", msg);
});
*/


if (localStorage.getItem('debug') !== null) {
	let debug = localStorage.getItem('debug') === 'true';
	document.querySelector('#background').className = (debug) ? "show-webcam" :"hide-webcam";
}

let playgroundRender = new PlaygroundRenderer();
document.querySelector('.container')
    .appendChild(playgroundRender);

playgroundRender.subscribeTo(tracker);
