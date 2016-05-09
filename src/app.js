console.clear();

import PlaygroundRenderer from './playground-renderer';
import './styles.less'
import {
    tracker
} from './tracker';

// debugonly
let debug = localStorage.getItem('debug') || false;
document.querySelector('#background').style.backgroundColor = (debug) ? "transparent" :"black";



let playgroundRender = new PlaygroundRenderer();
document.querySelector('.container')
    .appendChild(playgroundRender);

playgroundRender.subscribeTo(tracker);
