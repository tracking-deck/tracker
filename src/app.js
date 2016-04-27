import PlaygroundRenderer from './playground-renderer';
import { tracker } from './tracker';


let playgroundRender = new PlaygroundRenderer();
document.querySelector('.container')
  .appendChild(playgroundRender);
  
 playgroundRender.subscribeTo(tracker);