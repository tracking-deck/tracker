import { setColor } from './adminService';

class CustomColorEditor extends HTMLElement {
	attachedCallback() {
		this.colorName = this.attributes['color-name'] ? this.attributes['color-name'].value : '';
		this.defaultColor = this.attributes['default-color'] ? this.attributes['default-color'].value : '';
		this.addEventListener('keyup', () => this.setCurrentColor());
		this.render();
	}

	setCurrentColor() {
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
				<input type="text" value="${this.defaultColor}">
			</section>
		`;
	}
}

export default document.registerElement('custom-color-editor', CustomColorEditor);
