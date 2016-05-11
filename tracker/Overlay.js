import config from '../config';

class Overlay extends HTMLCanvasElement {
    createdCallback() {
        this.width = config.videoWidth;
        this.height = config.videoWidth / config.screenRatio;
        this.context = this.getContext('2d');
    }

    render(points) {
        if (config.trackerShowRectangles) {
            this.renderOverlay(points);
        }
    }

    renderOverlay(points) {
        this.context.clearRect(0, 0, this.width, this.height);

        points.forEach(point => {
            const rect = point.rectangle;
            this.context.strokeStyle = 'white';
            this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            this.context.font = '11px Helvetica';
            this.context.fillStyle = "#fff";
            this.context.fillText('color: ' + rect.color, rect.x + rect.width + 5, rect.y + 11);
            this.context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 22);
            this.context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 33);
        });
    }
}

export default document.registerElement('tracker-overlay', {
    prototype: Overlay.prototype,
    extends: 'canvas'
});
