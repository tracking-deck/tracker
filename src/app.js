console.clear();

import PlaygroundRenderer from './playground-renderer';
import './styles.less'
import {
    tracker
} from './tracker';

// debugonly
let debug = true;
document.querySelector('#background').style.backgroundColor = (debug) ? "transparent" :"white";



let playgroundRender = new PlaygroundRenderer();
document.querySelector('.container')
    .appendChild(playgroundRender);

playgroundRender.subscribeTo(tracker);
