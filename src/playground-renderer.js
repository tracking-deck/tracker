import Rx from '@reactivex/rxjs/dist/cjs/Rx';

const screenRatio = 4/3;

const colors = {
    outline: "pink",
    marker: "blue"
};
const outlineWidth = 10;
const markerSize = 50;

class PlaygroundRenderer extends HTMLCanvasElement {
    createdCallback() {
        this.width = 1000;
        this.height = this.width / screenRatio;
        this.context = this.getContext('2d');
        this.renderPlayground();
    }

    subscribeTo(observable) {
        observable.subscribe({
            next: state => {
                this.renderPlayground(state);
                if (state.trackables.length > 0) {
                    state.trackables.forEach(i => this.renderTrackable(i));
                }
            }
        });
    }

    renderPlayground(state) {
        this.context.clearRect(0, 0, this.width, this.height);
        this.drawOutline();
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

        this.drawMarkerRect(outlineWidth/2, outlineWidth/2);
        this.drawMarkerRect(this.width - outlineWidth/2 - markerSize, outlineWidth/2);
        this.drawMarkerRect(this.width - outlineWidth/2 - markerSize, this.height - outlineWidth/2 - markerSize);
        this.drawMarkerRect(outlineWidth/2, this.height - outlineWidth/2 - markerSize);
    }

    drawMarkerRect(x, y) {
        this.context.fillStyle = colors.marker;
        this.context.fillRect(x, y, markerSize, markerSize);
    }

    renderTrackable(trackable) {
        this.context.beginPath();
        this.context.arc(trackable.x, trackable.y, 20, 0, 2 * Math.PI);
        this.context.strokeStyle = "blue";
        this.context.stroke();
    }
}

export default document.registerElement('playground-renderer', {
    prototype: PlaygroundRenderer.prototype,
    extends: 'canvas'
});
