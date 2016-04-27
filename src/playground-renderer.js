class PlaygroundRenderer extends HTMLCanvasElement {
    createdCallback() {
        this.width = 600;
        this.height = 450;
        this.context = this.getContext('2d'); 
    }
    
    subscribeTo(observable) {
        observable.subscribe({
            next: state => this.render(state)
        });
    }
    
    render(state) {
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
}

export default document.registerElement('playground-renderer', {
    prototype: PlaygroundRenderer.prototype,
    extends: 'canvas'
});