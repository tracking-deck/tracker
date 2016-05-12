import CustomColorEditor from './customColorEditor';
import './commandsLog';
import './trackableInfo';
import './virtualTrackables';
import config from '../config';

const colorEditors = [];

// RefColorEditor
const RefColorEditor = new CustomColorEditor();
RefColorEditor.setAttribute('color-name', 'custom');
RefColorEditor.setAttribute('default-color', config.refColorCustom);
colorEditors.push(RefColorEditor);

// All
colorEditors.forEach(ce => document.querySelector('.color-editors').appendChild(ce));

document.querySelector('button[name="applyAll"]').addEventListener('click', e => {
    colorEditors.forEach(ce => ce.setCurrentColor());
});
