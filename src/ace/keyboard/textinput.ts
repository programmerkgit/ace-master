/* textarea to be editted */

import {dom} from '../lib/dom';
/* very important line */
// event.addCommandKeyListener(text, host.onCommandKey.bind(host));
export class TextInput {
    constructor(parentNode: HTMLElement, host: any) {
        const textArea = dom.createElement('textarea');
        textArea.className = 'ace_text-input';

        textArea.setAttribute("wrap", "off");
        textArea.setAttribute("autocorrect", "off");
        textArea.setAttribute("autocapitalize", "off");
        textArea.setAttribute("spellcheck", 'false');

        textArea.style.opacity = "0";

        parentNode.prepend(textArea)
    }
}
