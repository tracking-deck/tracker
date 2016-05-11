import CustomColorEditor from './customColorEditor';
import config from '../config';

const RefColorEditor = new CustomColorEditor();
RefColorEditor.setAttribute('color-name', 'custom');
RefColorEditor.setAttribute('default-color', config.refColorCustom);

document.querySelector('.color-editors')
    .appendChild(RefColorEditor);