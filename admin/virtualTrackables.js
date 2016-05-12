import io from 'socket.io-client';
import Rx from '@reactivex/rxjs/dist/cjs/Rx';
import config from '../config';

const socket = io.connect(config.busAddress);

class VirtualTrackables extends HTMLElement {
	createdCallback() {
        this.vp1 = {
            x: 150,
            y: 100,
            rectangle: {
                color: 'blue'
            }
        };
        this.render();
        
        Rx.Observable.interval(500).subscribe(r => {
            socket.emit('virtual-trackables', [this.vp1]);
        });
	}
    
    updateVirtualPoint() {
        this.vp1.x = this.querySelector('#vp1_x').value;
        this.vp1.y = this.querySelector('#vp1_y').value;
    }

	render() {
		this.innerHTML = `
			<section>
                <label for="vp1_x">vp1.x</label>
				<input type="text" id="vp1_x" value="${this.vp1.x}">
                <label for="vp1_y">vp1.y</label>
				<input type="text" id="vp1_y" value="${this.vp1.y}">
			</section>
            <button type="button" class="btn waves-effect waves-light" name="updateVP1">update virtual points</button>
		`;
        this.querySelector('button').addEventListener('click', () => this.updateVirtualPoint());
	}
}

export default document.registerElement('virtual-trackables', VirtualTrackables);
