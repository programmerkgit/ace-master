/* textarea to be editted */

import { dom } from '../lib/dom';
import { Editor } from '../editor';
/* very important line */

// event.addCommandKeyListener(text, host.onCommandKey.bind(host));
export class TextInput {
    textArea: HTMLTextAreaElement;

    constructor(parentNode: HTMLElement, host: Editor) {
        const textArea = dom.createElement('textarea') as HTMLTextAreaElement;
        this.textArea = textArea;
        textArea.className = 'ace_text-input';
        textArea.setAttribute('wrap', 'off');
        textArea.setAttribute('autocorrect', 'off');
        textArea.setAttribute('autocapitalize', 'off');
        textArea.setAttribute('spellcheck', 'false');

        textArea.style.opacity = '0';
        parentNode.prepend(textArea);
        textArea.addEventListener('input', this.onInput);
    }

    onInput(e: Event) {
        const data = this.textArea.value;
        this.sendText(data, true);
    }

    onCompositionStart() {

    }

    sendText(data: string, formInput: boolean) {
        /* index of selected text */
        const selectionStart: number = this.textArea.selectionStart;
        const selectionEnd: number = this.textArea.selectionEnd;
        // host.onTextInput
    }
}
