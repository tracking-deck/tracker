class PlaygroundRenderer extends HTMLCanvasElement {
    createdCallback() {
        this.width = 600;
        this.height = 450;
        this.context = this.getContext('2d'); 
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
        this.context.moveTo(state.topLeft.x,state.topLeft.y);
        this.context.lineTo(state.topRight.x,state.topRight.y);
        this.context.lineTo(state.bottomRight.x,state.bottomRight.y);
        this.context.lineTo(state.bottomLeft.x,state.bottomLeft.y);
        this.context.lineTo(state.topLeft.x,state.topLeft.y);
        this.context.strokeStyle="red";
        this.context.stroke();
    }
    
    renderTrackable(trackable) {
        this.context.beginPath();
        this.context.arc(trackable.x,trackable.y,20,0,2*Math.PI);
        this.context.strokeStyle="blue";
        this.context.stroke();
    }
}

export default document.registerElement('playground-renderer', {
    prototype: PlaygroundRenderer.prototype,
    extends: 'canvas'
});