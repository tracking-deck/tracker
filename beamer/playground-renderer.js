import Rx from '@reactivex/rxjs/dist/cjs/Rx';
import config from '../config';

const colors = {
    outline: "pink",
    marker: "pink",
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
            next: trackables => this.renderPlayground(trackables)
        });
    }

    renderPlayground(trackables) {
        console.log("render", trackables);
        this.context.clearRect(0, 0, this.width, this.height);
        this.drawOutline();
        trackables.forEach(i => this.renderTrackable(i));
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
        if (trackable.rectangle.color === 'custom') {
            this.context.strokeStyle = colors.marker;
        } else {
            this.context.strokeStyle = trackable.rectangle.color;
        }
        this.context.lineWidth = 3;
        this.context.stroke();
    }
}

export default document.registerElement('playground-renderer', {
    prototype: PlaygroundRenderer.prototype,
    extends: 'canvas'
});