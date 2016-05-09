import Rx from '@reactivex/rxjs/dist/cjs/Rx';

const screenRatio = 4 / 3;

const colors = {
    outline: "pink",
    marker: "black",
    playgroundOutline: "blue",
    trackable: "white"
};
const canvasWidth = 1000;
const outlineWidth = 10;
const markerSize = 60;

class PlaygroundRenderer extends HTMLCanvasElement {
    createdCallback() {
        this.width = canvasWidth;
        this.height = canvasWidth / screenRatio;
        this.context = this.getContext('2d');
        this.drawOutline();
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

        this.context.beginPath();
        this.context.moveTo(state.topLeft.x, state.topLeft.y);
        this.context.lineTo(state.topRight.x, state.topRight.y);
        this.context.lineTo(state.bottomRight.x, state.bottomRight.y);
        this.context.lineTo(state.bottomLeft.x, state.bottomLeft.y);
        this.context.lineTo(state.topLeft.x, state.topLeft.y);
        this.context.strokeStyle = colors.playgroundOutline;
        this.context.stroke();

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
/*
        this.drawMarkerRect(outlineWidth / 2, outlineWidth / 2);
        this.drawMarkerRect(this.width - outlineWidth / 2 - markerSize, outlineWidth / 2);
        this.drawMarkerRect(this.width - outlineWidth / 2 - markerSize, this.height - outlineWidth / 2 - markerSize);
        this.drawMarkerRect(outlineWidth / 2, this.height - outlineWidth / 2 - markerSize);
*/
        //this.drawMarkerText("Zühlke");
    }

    drawMarkerText(text) {
        this.context.font = "60px Arial";
        this.context.textAlign="center";
        this.context.fillText(text, this.width/2, this.height/2);
    }


    drawMarkerRect(x, y) {
        this.context.fillStyle = colors.marker;
        this.context.fillRect(x, y, markerSize, markerSize);
    }

    renderTrackable(trackable) {
        this.context.beginPath();
        this.context.arc(trackable.x, trackable.y, 20, 0, 2 * Math.PI);
        this.context.strokeStyle = colors.trackable;
        this.context.lineWidth = 3;
        this.context.stroke();
    }
}

export default document.registerElement('playground-renderer', {
    prototype: PlaygroundRenderer.prototype,
    extends: 'canvas'
});
