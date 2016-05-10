console.clear();

import PlaygroundRenderer from './playground-renderer';
import './styles.less'
import { tracker } from './tracker';
import * as t from './transformer';

if (localStorage.getItem('debug') !== null) {
	let debug = (localStorage.getItem('debug') || false) === 'true';
	document.querySelector('#background').className = (debug) ? "show-webcam" :"hide-webcam";
}

let playgroundRender = new PlaygroundRenderer();
document.querySelector('.container')
    .appendChild(playgroundRender);

playgroundRender.subscribeTo(tracker);
