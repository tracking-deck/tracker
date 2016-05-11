import { setColor } from './adminService';

class CustomColorEditor extends HTMLElement {
	createdCallback() {
		this.colorName = this.attributes['color-name'] ? this.attributes['color-name'].value : '';
		this.addEventListener('keyup', e => this.onTextEnter(e));
		this.render();
	}
	
	onTextEnter(e) {
		const color = this.querySelector('input').value;
		if (this.isValid(color)) {
			setColor(this.colorName, color);
		}
	}
	
	isValid(color) {
		return color.length === 6;
	}
	
	render() {
		this.innerHTML = `
			<section>
				<span>${this.colorName}</span>
				<span>#</span>
				<input type="text">
			</section>
		`;
	}
}

export default document.registerElement('custom-color-editor', CustomColorEditor);