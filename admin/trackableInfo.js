import { trackables } from './adminService';

class TrackablesInfo extends HTMLElement {
	attachedCallback() {
        this.commandHistory = [];
        trackables.startWith([]).subscribe(t =>  this.render(t));
	}

	render(tb) {
		this.innerHTML = `
            <table>
                <thead>
                  <tr>
                      <th>Color</th>
                      <th>Count</th>
                  </tr>
                </thead>

            <tbody>
              <tr>
                <td>Total</td>
                <td>${tb.length}</td>
              </tr>
              <tr>
                <td>Custom</td>
                <td>${tb.filter(t => t.rectangle.color === 'custom').length}</td>
              </tr>
              <tr>
                <td>Yellow</td>
                <td>${tb.filter(t => t.rectangle.color === 'yellow').length}</td>
              </tr>
            </tbody>
          </table>
		`;
	}
}

export default document.registerElement('trackables-info', TrackablesInfo);
