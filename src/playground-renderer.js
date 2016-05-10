import Rx from '@reactivex/rxjs/dist/cjs/Rx';
import config from './config';

const colors = {
    outline: "pink",
    marker: "black",
    playgroundOutline: "blue",
    trackable: "white"
};

const outlineWidth = 10;
const markerSize = 60;

class PlaygroundRenderer extends HTMLCanvasElement {
    createdCallback() {
        this.width = config.canvasWidth;
        this.height = config.canvasWidth / config.screenRatio;
        this.context = this.getContext('2d');
    }

    subscribeTo(observable) {
        observable.subscribe({
            next: state => this.renderPlayground(state)
        });
    }

    renderPlayground(state) {
        this.context.clearRect(0, 0, this.width, this.height);
        this.drawOutline();
        state.trackables.forEach(i => this.renderTrackable(i));
    }

    drawOutline() {
        this.context.beginPath();
        this.context.moveTo(0, 0);
        this.context.lineTo(this.width, 0);
        this.context.lineTo(this.width, this.height);
        this.context.lineTo(0, this.height);
        this.context.lineTo(0, 0);
        this.context.lineWidth = outlineWidth;
        this.context.strokeStyle = colors.outline;
        this.context.stroke();
    }

    renderTrackable(trackable) {
        this.context.beginPath();
        this.context.arc(trackable.x, trackable.y, 10, 0, 2 * Math.PI);
        this.context.strokeStyle = colors.trackable;
        this.context.lineWidth = 3;
        this.context.stroke();
    }
}

export default document.registerElement('playground-renderer', {
    prototype: PlaygroundRenderer.prototype,
    extends: 'canvas'
});
