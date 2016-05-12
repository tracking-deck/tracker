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
                <label for="color_${this.colorName}">${this.colorName}</label>
				<input type="text" id="color_${this.colorName}" value="${this.defaultColor}">
			</section>
		`;
	}
}

export default document.registerElement('custom-color-editor', CustomColorEditor);
