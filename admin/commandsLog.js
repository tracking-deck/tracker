import { command } from './adminService';

class CommandsLog extends HTMLElement {
	attachedCallback() {
        this.commandHistory = [];
        command.startWith([]).subscribe(command => {
            this.commandHistory.unshift(command);
            if (this.commandHistory.length > 10) {
                this.commandHistory.pop();
            }
            this.render(this.commandHistory);
        });
	}

	render(history) {
		this.innerHTML = `
            <ul>${history.map(h => this.renderCommand(h)).join('')}</ul>
		`;
	}

    renderCommand(command) {
        return `<li>Command: ${command.command}</li>`;
    }
}

export default document.registerElement('commands-log', CommandsLog);
